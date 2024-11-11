from flask import Flask, render_template, jsonify, request
import RPi.GPIO as GPIO
import time
import adafruit_dht
import board

# Initialize DHT11 sensor
dht_device = adafruit_dht.DHT11(board.D2)

app = Flask(__name__)

# GPIO Setup
yled = 18  # Yellow LED for Room 1
gled = 27  # Green LED for Room 2
rled = 22  # Red LED for Room 3
touchPin = 17  # Touch sensor pin
TRIGER = 24  # Ultrasonic trigger pin
ECHO = 23    # Ultrasonic echo pin

sys_mode = False  # Initial alert mode state (off)

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(yled, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(gled, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(rled, GPIO.OUT, initial=GPIO.LOW)
GPIO.setup(TRIGER, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)
GPIO.setup(touchPin, GPIO.IN)

# Get temperature and humidity from DHT11 sensor
def get_sensor_data():
    try:
        time.sleep(1)  # Delay for sensor stability
        humidity = dht_device.humidity
        temperature = dht_device.temperature
        return temperature, humidity
    except RuntimeError as e:
        print(f"RuntimeError: {e}. Retrying...")
        time.sleep(2)
        return get_sensor_data()
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None, None

# Get distance from ultrasonic sensor
def get_distance():
    GPIO.output(TRIGER, GPIO.LOW)
    time.sleep(0.01)
    GPIO.output(TRIGER, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIGER, GPIO.LOW)

    start = time.time()
    stop = time.time()

    while GPIO.input(ECHO) == GPIO.LOW:
        start = time.time()
    while GPIO.input(ECHO) == GPIO.HIGH:
        stop = time.time()

    elapsed_time = stop - start
    distance = (elapsed_time * 34300) / 2  # Calculate distance
    return round(distance, 2)

# Get touch sensor input to toggle alert mode
def get_touch():
    global sys_mode
    touchState = GPIO.input(touchPin)
        
    if touchState == GPIO.HIGH:
        sys_mode = not sys_mode  # Toggle the alert mode
        time.sleep(0.5)  # Debounce delay
    return sys_mode

# Endpoint to get sensor data (temp, humidity, distance)
@app.route('/sensors', methods=['GET'])
def sensors():    
    distance = get_distance()
    temperature, humidity = get_sensor_data() 
    return jsonify({'distance': distance, 'temperature': temperature, 'humidity': humidity})

# Endpoint to get touch sensor status and toggle alert mode
@app.route('/touch', methods=['GET'])
def touch():
    mode = get_touch()
    return jsonify({'sys_mode': mode})

# Toggle LED state based on room
@app.route('/toggle', methods=['POST'])
def toggle_led():
    data = request.json
    led = data.get('led')
    state = data.get('state')
    
    if led == 'room1':
        GPIO.output(yled, GPIO.HIGH if state else GPIO.LOW)
    elif led == 'room2':
        GPIO.output(gled, GPIO.HIGH if state else GPIO.LOW)
    elif led == 'room3':
        GPIO.output(rled, GPIO.HIGH if state else GPIO.LOW)

    return jsonify({'message': 'LED state updated'})

# Render the index.html page
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True, threaded=False)

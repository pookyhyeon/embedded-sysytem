임베디드 시스템 9조
==============


1주차
---
pip install 오류 해결법 
: import 가 안된 이유가 sudo pip3 install 로 설치하게 되면 라즈베리파이 전체로 영향을 줄 수가 있음. 이에, 가상환경을 생성해서 해당 환경에서 설치하면 에러가 뜨지 않음 
1. cd /home/m4den/Desktop python3 -m venv venv ( 가상환경 생성)
2. source /home/m4den/Desktop/venv/bin/activate (활성화)
3. pip install Adafruit_DHT (예시고 관련 라이브러리 설치하면 됨 )
4. python /home/m4den/Desktop/final.py (가상환경에서 파이썬 실행)
5. deactivate (가상환경 종료 )

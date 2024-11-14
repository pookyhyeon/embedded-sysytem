document.addEventListener('DOMContentLoaded', () => {
    const statusButtons = document.querySelectorAll('.status-button');
    const menuPopup = document.getElementById('menu-popup');
    const addMenuBtn = document.getElementById('add-menu-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const resetSalesBtn = document.getElementById('reset-sales-btn');
    const viewSalesDetailsBtn = document.getElementById('view-sales-details-btn');
    const salesDetailsList = document.getElementById('sales-details-list');
    const salesDetailsDiv = document.getElementById('sales-details');
    const dailySalesElement = document.getElementById('daily-sales');
    const reservationList = document.getElementById('reservation-list');
    const newReservationInput = document.getElementById('new-reservation');
    const reservationCount = document.querySelector('.reservation h3');
    
    let hasViewedSalesDetails = false; // 추가된 변수
    let dailyTotal = 0;
    let salesDetails = {};
    let currentTableId = '';
    let automationConfigured = false;
    const automationSettings = {
        tableLight: false,
        boundaryMode: false,
        kitchenLight: false,
        bathroomLight: false,
        eveningSwitch: false
    };

    
    window.addReservation = () => {
        const phoneNumber = newReservationInput.value.trim();
        if (phoneNumber) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${phoneNumber} 
                <span onclick="removeReservation(this)" style="color: red; cursor: pointer;">삭제</span> &nbsp; 
                <span onclick="sendConfirmation()" style="cursor: pointer;">예약 완료 문자 전송하기</span>
            `;
            reservationList.appendChild(listItem);
            newReservationInput.value = ''; // 입력 필드 초기화
            updateReservationCount();
        } else {
            alert("전화번호를 입력하세요.");
        }
    };

    // Function to remove a reservation
    window.removeReservation = (element) => {
        element.parentElement.remove();
        updateReservationCount();
    };

    // Function to update the reservation count
    function updateReservationCount() {
        const count = reservationList.children.length;
        reservationCount.textContent = `현재 예약 대기 ${count}팀`;
    }

    // Initial count update
    updateReservationCount();
    function updateTime() {
        const now = new Date();
        const formattedTime = now.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        document.getElementById('current-time').textContent = formattedTime;
    }

    // 1초마다 시간 업데이트
    setInterval(updateTime, 1000);
    updateTime(); // 페이지 로드 시 즉시 시간 표시

    // ON/OFF toggle functionality for status buttons
    statusButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === 'OFF') {
                button.textContent = 'ON';
                button.style.backgroundColor = '#cce5ff'; // ON 상태 색상
            } else {
                button.textContent = 'OFF';
                button.style.backgroundColor = '#f0f0f0'; // OFF 상태 색상
            }
        });
    });

    // Open menu popup
    window.openMenuPopup = (tableId) => {
        currentTableId = tableId;
        document.getElementById('table-id').textContent = tableId + " 메뉴 선택";
        menuPopup.style.display = 'block';
    };

    // Close menu popup
    closePopupBtn.addEventListener('click', () => {
        menuPopup.style.display = 'none';
    });

    // Add menu items to the sidebar and accumulate them
    addMenuBtn.addEventListener('click', () => {
        const menuQuantities = document.querySelectorAll('.menu-quantity');
        const tableSection = document.getElementById(currentTableId);
        const menuList = tableSection.querySelector('.selected-menu-list');
        const totalPriceElement = tableSection.querySelector('.total-price');
        let total = parseInt(totalPriceElement.textContent.replace(/[^0-9]/g, ''), 10) || 0;

        menuQuantities.forEach(item => {
            const quantity = parseInt(item.value, 10);
            const price = parseInt(item.getAttribute('data-price'), 10);
            const name = item.getAttribute('data-name');

            if (quantity > 0) {
                total += quantity * price;

                let existingItem = Array.from(menuList.children).find(listItem =>
                    listItem.textContent.includes(name)
                );

                if (existingItem) {
                    const existingQuantity = parseInt(existingItem.textContent.match(/(\d+)개/)[1], 10);
                    const newQuantity = existingQuantity + quantity;
                    existingItem.textContent = `${name} ${newQuantity}개 (${(newQuantity * price).toLocaleString()}원)`;
                } else {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${name} ${quantity}개 (${(quantity * price).toLocaleString()}원)`;
                    menuList.appendChild(listItem);
                }

                if (salesDetails[name]) {
                    salesDetails[name] += quantity;
                } else {
                    salesDetails[name] = quantity;
                }

                item.value = '';
            }
        });

        totalPriceElement.textContent = `총 합계: ${total.toLocaleString()}원`;
        menuPopup.style.display = 'none';
    });
    function addToSalesDetails(item, quantity) {
        if (salesDetails[item]) {
            salesDetails[item] += quantity;
        } else {
            salesDetails[item] = quantity;
        }
    }
    // Reset table and add total to daily sales when payment button is clicked
    const paymentButtons = document.querySelectorAll('.payment-btn');
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tableSection = button.closest('.table-section');
            const totalPriceElement = tableSection.querySelector('.total-price');
            let total = parseInt(totalPriceElement.textContent.replace(/[^0-9]/g, ''), 10) || 0;

            if (total > 0) {
                dailyTotal += total;
                dailySalesElement.textContent = `일일 금액: ${dailyTotal.toLocaleString()}원`;

                tableSection.querySelector('.selected-menu-list').innerHTML = '';
                totalPriceElement.textContent = '총 합계: 0원';
            }
        });
    });

    // Show or hide sales details
    viewSalesDetailsBtn.addEventListener('click', () => {
        // salesDetails가 비어 있으면 경고 메시지 출력
        if (Object.keys(salesDetails).length === 0) {
            alert("결제 내역이 없습니다.");
            return;
        }

        // 결제 내역이 있는 경우 목록을 생성하여 표시
        if (salesDetailsDiv.style.display === 'none' || salesDetailsDiv.style.display === '') {
            salesDetailsList.innerHTML = ''; // 기존 내용을 초기화
            for (const [menuItem, quantity] of Object.entries(salesDetails)) {
                const detailItem = document.createElement('li');
                detailItem.textContent = `${menuItem}: ${quantity}개`;
                salesDetailsList.appendChild(detailItem);
            }
            salesDetailsDiv.style.display = 'block';
            hasViewedSalesDetails = true; // 결제 내역을 확인했음을 표시
        } else {
            salesDetailsDiv.style.display = 'none';
        }
    });
/////////////////////////////////reset/////////////////////////////////////////////////////////
    window.resetTable = (tableId) => {
        const tableSection = document.getElementById(tableId);
        const menuList = tableSection.querySelector('.selected-menu-list');
        const totalPriceElement = tableSection.querySelector('.total-price');
        
        // Clear the selected menu list and reset the total price
        menuList.innerHTML = '';
        totalPriceElement.textContent = '총 합계: 0원';
    };

    // Function to reset all sales data
    resetSalesBtn.addEventListener('click', () => {
        dailyTotal = 0;
        salesDetails = {};
        dailySalesElement.textContent = '일일 금액: 0원';
        salesDetailsList.innerHTML = ''; // Clear sales details list
        salesDetailsDiv.style.display = 'none'; // Hide sales details
    });
/////////////////////////////////////////////////////////////////////////////////////////////
//////// 매출 관리 ///////////////////////////////////////////////////////////////
viewSalesDetailsBtn.addEventListener('click', () => {
    if (Object.keys(salesDetails).length === 0) {
        alert("결제 내역이 없습니다.");
        return;
    }

    // Populate the sales details list
    salesDetailsList.innerHTML = '';  // Clear existing content
    for (const [menuItem, quantity] of Object.entries(salesDetails)) {
        const detailItem = document.createElement('li');
        detailItem.textContent = `${menuItem}: ${quantity}개`;
        salesDetailsList.appendChild(detailItem);
    }

    // Show the sales details div below the button
    salesDetailsDiv.style.display = 'block';
    hasViewedSalesDetails = true;  // Mark as viewed
});

document.getElementById('settle-btn').addEventListener('click', () => {
    if (!hasViewedSalesDetails) {
        alert("먼저 '결제 메뉴 내역 확인'을 눌러 결제 내역을 확인하세요.");
        return;
    }

    const dailySales = dailySalesElement.textContent;
    let salesDetailsHTML = '';

    salesDetailsList.querySelectorAll('li').forEach(item => {
        salesDetailsHTML += `<li>${item.textContent}</li>`;
    });

    // 로컬 스토리지에 저장
    localStorage.setItem('dailySales', dailySales);
    localStorage.setItem('salesDetailsList', salesDetailsHTML);

    // 정산 페이지로 이동
    window.location.href = 'settle.html';
});

document.getElementById('automation-settings-btn').addEventListener('click', () => {
    const automationPopup = document.getElementById('automation-settings-popup');
    automationPopup.style.display = 'block';
});

// Save settings and close the popup
document.getElementById('save-automation-settings-btn').addEventListener('click', () => {
    document.querySelectorAll('.automation-setting').forEach(setting => {
        const type = setting.getAttribute('data-control-type');
        automationSettings[type] = setting.checked; // Save the ON/OFF state (true for ON, false for OFF)
    });
    automationConfigured = true;
    alert("자동화 세팅이 완료되었습니다.");
    document.getElementById('automation-settings-popup').style.display = 'none';
});

// Function to apply automation settings
function activateAutomation() {
    if (automationConfigured) {
        statusButtons.forEach(button => {
            const controlType = button.previousElementSibling.textContent.trim();
            if (automationSettings[controlType] !== undefined) {
                if (automationSettings[controlType]) {
                    button.textContent = 'ON';
                    button.style.backgroundColor = '#cce5ff'; // ON 상태 색상
                } else {
                    button.textContent = 'OFF';
                    button.style.backgroundColor = '#f0f0f0'; // OFF 상태 색상
                }
            }
        });
        alert("설정된 자동화가 실행되었습니다.");
    } else {
        alert("자동화 세팅을 먼저 설정하세요.");
    }
}

// Automation button functionality
document.getElementById('automation-btn').addEventListener('click', activateAutomation);
});
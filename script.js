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
    let dailyTotal = 0;
    let salesDetails = {};
    let currentTableId = '';
    document.addEventListener('DOMContentLoaded', function() {
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
    });
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
        let total = parseInt(totalPriceElement.textContent.replace(/[^0-9]/g, ''), 10) || 0; // Keep existing total

        menuQuantities.forEach(item => {
            const quantity = parseInt(item.value, 10);
            const price = parseInt(item.getAttribute('data-price'), 10);
            const name = item.getAttribute('data-name');

            if (quantity > 0) {
                total += quantity * price;

                // Check if the menu item already exists in the list
                let existingItem = Array.from(menuList.children).find(listItem =>
                    listItem.textContent.includes(name)
                );

                if (existingItem) {
                    // Update the existing item's quantity and price
                    const existingQuantity = parseInt(existingItem.textContent.match(/(\d+)개/)[1], 10);
                    const newQuantity = existingQuantity + quantity;
                    existingItem.textContent = `${name} ${newQuantity}개 (${(newQuantity * price).toLocaleString()}원)`;
                } else {
                    // Add a new item to the list
                    const listItem = document.createElement('li');
                    listItem.textContent = `${name} ${quantity}개 (${(quantity * price).toLocaleString()}원)`;
                    menuList.appendChild(listItem);
                }

                // Update sales details
                if (salesDetails[name]) {
                    salesDetails[name] += quantity;
                } else {
                    salesDetails[name] = quantity;
                }

                item.value = ''; // Reset input after adding
            }
        });

        totalPriceElement.textContent = `총 합계: ${total.toLocaleString()}원`;
        menuPopup.style.display = 'none'; // Close the popup
    });

    // Reset table and add total to daily sales when payment button is clicked
    const paymentButtons = document.querySelectorAll('.payment-btn');
    paymentButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tableSection = button.closest('.table-section');
            const totalPriceElement = tableSection.querySelector('.total-price');
            let total = parseInt(totalPriceElement.textContent.replace(/[^0-9]/g, ''), 10) || 0;

            if (total > 0) {
                // Add to daily sales
                dailyTotal += total;
                dailySalesElement.textContent = `일일 금액: ${dailyTotal.toLocaleString()}원`;

                // Reset table
                tableSection.querySelector('.selected-menu-list').innerHTML = '';
                totalPriceElement.textContent = '총 합계: 0원';
            }
        });
    });

    // Show or hide sales details
    viewSalesDetailsBtn.addEventListener('click', () => {
        if (salesDetailsDiv.style.display === 'none' || salesDetailsDiv.style.display === '') {
            salesDetailsList.innerHTML = ''; // Clear previous details
            for (const [menuItem, quantity] of Object.entries(salesDetails)) {
                const detailItem = document.createElement('li');
                detailItem.textContent = `${menuItem}: ${quantity}개`;
                salesDetailsList.appendChild(detailItem);
            }
            salesDetailsDiv.style.display = 'block';
        } else {
            salesDetailsDiv.style.display = 'none'; // Hide details section
        }
    });

    // Reset daily sales
    resetSalesBtn.addEventListener('click', () => {
        dailyTotal = 0;
        dailySalesElement.textContent = '일일 금액: 0원';
        salesDetails = {}; // Reset sales details
        salesDetailsList.innerHTML = ''; // Clear displayed details
        salesDetailsDiv.style.display = 'none'; // Hide details section
    });
});
document.addEventListener('DOMContentLoaded', function() {
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
});
document.addEventListener('DOMContentLoaded', () => {
    const settleBtn = document.getElementById('settle-btn');

    if (settleBtn) {
        settleBtn.addEventListener('click', () => {
            // 일일 금액과 결제 상세 내역 가져오기
            const dailySales = document.getElementById('daily-sales').textContent;
            const salesDetailsList = document.getElementById('sales-details-list').innerHTML;

            // 결제 상세 내역이 비어 있는 경우 확인
            if (!salesDetailsList || salesDetailsList.trim() === '') {
                alert("결제 메뉴 내역 확인 버튼을 누른 후 정산해주세요.");
                return;
            }

            // 로컬 스토리지에 저장
            localStorage.setItem('dailySales', dailySales);
            localStorage.setItem('salesDetailsList', salesDetailsList);

            // 정산 페이지로 이동
            window.location.href = 'settle.html';
        });
    }
});

function removeReservation(button) {
    const listItem = button.parentElement;
    listItem.remove();
}

function addReservation() {
    const input = document.getElementById('new-reservation');
    const phoneNumber = input.value.trim();
    
    if (phoneNumber) {
        const list = document.getElementById('reservation-list');
        const newItem = document.createElement('li');
        newItem.innerHTML = `${phoneNumber} <button onclick="removeReservation(this)">삭제</button> &nbsp; <button onclick="sendConfirmation()">예약 완료 문자 전송하기</button>`;
        list.appendChild(newItem);
        input.value = ''; // 입력 필드 초기화
    } else {
        alert('전화번호를 입력하세요.');
    }
}

function sendConfirmation() {
    if (confirm("전송하겠습니까?")) {
        alert("전송이 완료되었습니다.");
    }
}

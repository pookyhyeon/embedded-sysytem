document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.control-panel .button');
    const menuPopup = document.getElementById('menu-popup');
    const addMenuBtn = document.getElementById('add-menu-btn');
    const closePopupBtn = document.getElementById('close-popup-btn');
    let currentTableId = '';

    // ON/OFF toggle functionality
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.querySelector('.status');
            if (status.textContent === 'OFF') {
                status.textContent = 'ON';
                button.style.backgroundColor = '#cce5ff'; // ON 상태 색상
            } else {
                status.textContent = 'OFF';
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

                item.value = ''; // Reset input after adding
            }
        });

        totalPriceElement.textContent = `총 합계: ${total.toLocaleString()}원`;
        menuPopup.style.display = 'none'; // Close the popup
    });

    // Reset table function
    window.resetTable = (tableId) => {
        const tableSection = document.getElementById(tableId);
        tableSection.querySelector('.selected-menu-list').innerHTML = ''; // Clear menu list
        tableSection.querySelector('.total-price').textContent = '총 합계: 0원'; // Reset total price
    };
});

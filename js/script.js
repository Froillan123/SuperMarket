let queue = [];
let rear = -1;
let size = 5;
let selectedItems = [];
let totalQuantity;

const itemPrices = {
    'Mango': 1.00,
    'Apple': 2.00,
    'Banana': 1.50,
    'Biscuit': 3.00,
    'Crackers': 2.50,
    'Oishi': 1.00,
    'Chips': 4.00,
    'Fita': 1.50,
    'Fish': 2.00
};

function addCustomer() {
    let newCustomerName = document.querySelector('.box1').value;
    selectedItems = getSelectedItems();

    if (newCustomerName.trim() === '') {
        alert('Please enter your name!');
        return;
    }

    if (selectedItems.length === 0) {
        alert('Please select at least one item!');
        return;
    }

    if (isQueueFull()) {
        alert('Queue is full!');
        return;
    }

    let totalCost = calculateTotalCost(selectedItems);
    rear = (rear + 1) % size;
    queue[rear] = { name: newCustomerName, items: [...selectedItems], totalCost: totalCost };
    displayQueue();
    resetCart();
    resetForm();
    // Optionally, close the form after adding the customer
    document.querySelector('.login-form').classList.remove('active');
}

function getSelectedItems() {
    let items = document.querySelectorAll('.Items input[type=checkbox]:checked');
    
    // Prompt for the total quantity
    let totalQuantity = prompt('Enter total quantity for selected items:');
    if (isNaN(totalQuantity) || totalQuantity <= 0) {
        alert('Please enter a valid quantity.');
        return [];
    }

    return Array.from(items).map(item => {
        let itemName = item.nextElementSibling.textContent;
        return { name: itemName, quantity: parseInt(totalQuantity), price: itemPrices[itemName] };
    });
}


function calculateTotalCost(items) {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
}

function isQueueFull() {
    return rear === size - 1;
}

function dequeueCustomer() {
    if (isEmpty()) {
        Swal.fire({
            icon: 'warning',
            title: 'Queue is empty!',
        });
        return;
    }

    let dequeuedCustomer = queue.shift();
    rear--;

    if (isEmpty()) {
        rear = -1;
    }

    displayQueue();
    resetForm();
    // Display the total cost when dequeuing
    alert(`Total cost for ${dequeuedCustomer.name}: $${dequeuedCustomer.totalCost.toFixed(2)}`);
}

function isEmpty() {
    return rear === -1;
}

function displayQueue() {
    for (let i = 0; i < size; i++) {
        let customer = queue[i];
        let customerInfoElement = document.getElementById("customerInfo" + (i + 1));
        let goodsListElement = document.getElementById("goodsList" + (i + 1));

        if (customer) {
            customerInfoElement.textContent = customer.name;

            if (document.querySelector('.login-form').classList.contains('active')) {

                if (customer.items.length > 0) {
                    goodsListElement.innerHTML = "Items Ordered:<br>";
                    goodsListElement.innerHTML += "<ol>"; // Start ordered list

                    customer.items.forEach(item => {
                        let itemCost = item.price * item.quantity;
                        goodsListElement.innerHTML += `<li>${item.name} = $${itemCost.toFixed(2)} x ${item.quantity}</li>`;
                    });

                    goodsListElement.innerHTML += "</ol>"; // End ordered list

                    // Calculate and display the total amount
                    goodsListElement.innerHTML += `<br>Total Amount: $${customer.totalCost.toFixed(2)}`;
                }
            }
        } else {
            customerInfoElement.textContent = ""; // Reset content when no customer
            goodsListElement.innerHTML = ""; // Reset content when no customer
        }
    }
}

function resetCart() {
    selectedItems = [];
    document.querySelector('.Cart').textContent = 'Your Ordered Items:';
}

function resetForm() {
    document.getElementById('form').reset();
}

document.querySelectorAll('.Items input[type=checkbox]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        updateCart();
    });
});

function updateCart() {
    selectedItems = getSelectedItems();
    let cartElement = document.querySelector('.Cart');

    if (selectedItems.length > 0) {
        cartElement.innerHTML = 'Your Ordered Items:<br>';
        selectedItems.forEach(item => {
            let itemCost = item.price * item.quantity;
            cartElement.innerHTML += `[${item.name} = $${itemCost.toFixed(2)} x ${item.quantity}]<br>`;
        });
    } else {
        cartElement.innerHTML = 'Your Ordered Items:';
    }
}

let loginForm = document.querySelector('.login-form');

document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
}

document.querySelector('#close-login-btn').onclick = () => {
    loginForm.classList.remove('active');
}

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    addCustomer();
});

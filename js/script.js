let queue = [];
let rear = -1;
let size = 5;
let selectedItems = [];

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
    let items = document.querySelectorAll('.Items input[type=checkbox]:checked + span');
    return Array.from(items).map(item => item.textContent);
}


function calculateTotalCost(items) {
    let totalCost = 0;

    items.forEach(item => {
        // Retrieve the price per item from the itemPrices object
        let pricePerItem = getItemPrice(item);

        // Ask the user to enter the quantity for the current item
        let quantity = prompt(`Enter quantity for ${item} (Price: $${getItemPrice(item).toFixed(2)}):`)

        // Validate the entered quantity
        if (isNaN(quantity) || quantity <= 0) {
            alert('Please enter a valid quantity.');
            return; // Exit the function if the quantity is invalid
        }

        // Calculate the cost for the current item
        let itemCost = quantity * pricePerItem;

        // Update the cart display with the item and its cost
        let cartElement = document.querySelector('.Cart');
        cartElement.innerHTML += `[${item} x ${quantity} = $${itemCost.toFixed(2)}]<br>`;

        // Add the item cost to the total cost
        totalCost += itemCost;
    });

    // Return the total cost for all selected items
    return totalCost;
}


function getItemPrice(item) {
    return itemPrices[item];
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
                    goodsListElement.innerHTML += "<ol>"; 

                    customer.items.forEach(item => {
                        let itemCost = getItemPrice(item);
                        goodsListElement.innerHTML += `<li>${item} $${itemCost.toFixed(2)}</li>`;
                    });

                    goodsListElement.innerHTML += "</ol>";

                    goodsListElement.innerHTML += `<br>Total Amount: $${customer.totalCost.toFixed(2)}`;
                }
            }
        } else {
            customerInfoElement.textContent = "";
            goodsListElement.innerHTML = ""; 
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
        cartElement.innerHTML = 'Your Ordered Items:<br> [' + selectedItems.join(', ') + ']';
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

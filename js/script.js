// Initialize an empty queue, rear pointer, and size limit
let queue = [];
let rear = -1;
let size = 5;
let selectedItems = []; // Array to store selected items

// Initialize an array of counters with default values
let counters = [];
for (let i = 0; i < size; i++) {
    counters.push({ name: "", items: [], totalCost: 0 });
}

// Define item prices
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

// Function to add a customer to the queue
function addCustomer() {
    // Get the new customer's name from the input field
    let newCustomerName = document.querySelector('.box1').value;
    selectedItems = getSelectedItems(); // Get selected items from checkboxes

    // Check if the customer's name is empty
    if (newCustomerName.trim() === '') {
        alert('Please enter your name!');
        return;
    }

    // Check if at least one item is selected
    if (selectedItems.length === 0) {
        alert('Please select at least one item!');
        return;
    }

    // Check if the queue is full
    if (isQueueFull()) {
        alert('Queue is full!');
        return;
    }

    // Calculate the total cost of the selected items
    let totalCost = calculateTotalCost(selectedItems);

    // Increment the rear pointer and add the customer to the queue
    rear = (rear + 1) % size;
    queue[rear] = { name: newCustomerName, items: [...selectedItems], totalCost: totalCost };

    // Update the display and reset the cart and form
    displayQueue();
    resetCart();
    resetForm();
    // Optionally, close the form after adding the customer
    document.querySelector('.login-form').classList.remove('active');
}

// Function to get selected items from checkboxes
function getSelectedItems() {
    let items = document.querySelectorAll('.Items input[type=checkbox]:checked + span');
    return Array.from(items).map(item => item.textContent);
}

// Function to calculate the total cost of selected items
function calculateTotalCost(items) {
    let totalCost = 0;
    let cartDisplay = "";  // Accumulate cart display string

    items.forEach(item => {
        // Retrieve the price per item from the itemPrices object
        let pricePerItem = getItemPrice(item);

        // Set a default quantity if the user didn't enter one
        let quantity = 1;

        // Calculate the cost for the current item
        let itemCost = quantity * pricePerItem;

        // Accumulate the cart display string
        cartDisplay += `[${item} x ${quantity} = $${itemCost.toFixed(2)}]<br>`;

        // Add the item cost to the total cost
        totalCost += itemCost;
    });

    // Update the cart display with the accumulated string
    let cartElement = document.querySelector('.Cart');
    cartElement.innerHTML = cartDisplay;

    // Return the total cost for all selected items
    return totalCost;
}


// Function to get the price of an item from the itemPrices object
function getItemPrice(item) {
    return itemPrices[item];
}

// Function to check if the queue is full
function isQueueFull() {
    return rear === size - 1;
}

// Function to dequeue a customer
// Function to dequeue a customer
function dequeueCustomer() {
    // Check if the queue is empty
    if (isEmpty()) {
        Swal.fire({
            icon: 'warning',
            title: 'Queue is empty!',
        });

        // Hide "Calculating goods" when the queue is empty
        let calculatingGoodsElement = document.getElementById("displayCalculatingGoods");
        calculatingGoodsElement.style.display = "none";

        return;
    }

    // Dequeue the customer from the front of the queue
    let dequeuedCustomer = queue.shift();
    rear--;

    // Reset rear if the queue becomes empty
    if (isEmpty()) {
        rear = -1;
    }

    // Display a confirmation message with customer details
    Swal.fire({
        icon: "info",
        title: 'Paid Successfully',
        html: `<p><strong>Name:</strong> ${dequeuedCustomer.name}</p>
               <p><strong>Items Ordered:</strong></p>
               <ul>
                   ${dequeuedCustomer.items.map(item => `<li>${item}</li>`).join('')}
               </ul>
               <p><strong>Total Amount:</strong> $${dequeuedCustomer.totalCost.toFixed(2)}</p>`,
    });

    // Reset the form, cart, update counter data, display the queue, and reset the form
    resetForm();
    resetCart();
    displayQueue();
}


// Function to check if the queue is empty
function isEmpty() {
    return rear === -1;
}

// Function to display the current state of the queue
// Function to display the current state of the queue
function displayQueue() {
    for (let i = 0; i < size; i++) {
        let customer = queue[i];
        let calculatingGoodsElement = document.getElementById("displayCalculatingGoods");
        let customerInfoElement = document.getElementById("customerInfo" + (i + 1));
        let goodsListElement = document.getElementById("goodsList" + (i + 1));

        if (customer) {
            customerInfoElement.textContent = customer.name;

            // Display "Calculating goods" in Counter 1 when there are items
            if (i === 0 && customer.items.length > 0) {
                calculatingGoodsElement.style.display = "block";
                calculatingGoodsElement.textContent = "Calculating goods...";
            } else {
                calculatingGoodsElement.style.display = "inline";
            }

            if (document.querySelector('.login-form').classList.contains('active')) {
                goodsListElement.innerHTML = "Items Ordered:<br>";
                goodsListElement.innerHTML += "<ol>";

                if (customer.items.length > 0) {
                    let totalCost = 0; // Track total cost for each customer

                    customer.items.forEach(item => {
                        let itemCost = getItemPrice(item);
                        goodsListElement.innerHTML += `<li>${item} $${itemCost.toFixed(2)}</li>`;
                        totalCost += itemCost; // Update total cost
                    });

                    goodsListElement.innerHTML += "</ol>";

                    goodsListElement.innerHTML += `<br>Total Amount: $${totalCost.toFixed(2)}`;
                } else {
                    // If no items ordered
                    goodsListElement.innerHTML = "";
                }
            }
        } else {
            // If no customer, clear both elements
            customerInfoElement.textContent = "";
            goodsListElement.innerHTML = "";

            // If it's Counter 1 and the queue is not empty, display "Calculating goods"
            if (i === 0 && !isEmpty()) {
                calculatingGoodsElement.style.display = "block";
                calculatingGoodsElement.textContent = "Calculating goods..."; // Text to display
            } else {
                // If not Counter 1 or the queue is empty, hide "Calculating goods"
                calculatingGoodsElement.style.display = "block";
            }
        }
    }
}


// Function to reset the selected items array and cart display
function resetCart() {
    selectedItems = [];
    document.querySelector('.Cart').textContent = 'Your Ordered Items:';
}

// Function to reset the form after a customer is added
function resetForm() {
    document.getElementById('form').reset();
}

// Event listener for checkbox changes to update the cart display
document.querySelectorAll('.Items input[type=checkbox]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        updateCart();
    });
});

// Function to update the cart display based on selected items
function updateCart() {
    selectedItems = getSelectedItems();
    let cartElement = document.querySelector('.Cart');

    if (selectedItems.length > 0) {
        cartElement.innerHTML = 'Your Ordered Items:<br> [' + selectedItems.join(', ') + ']';
    } else {
        cartElement.innerHTML = 'Your Ordered Items:';
    }
}

// Event listener for login button to toggle the login form
let loginForm = document.querySelector('.login-form');
document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
}

// Event listener for close login button to hide the login form
document.querySelector('#close-login-btn').onclick = () => {
    loginForm.classList.remove('active');
}

// Event listener for form submission to add a customer
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    addCustomer();
});

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
    document.querySelector('.superMenu').classList.remove('active');
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

        let calculatingGoodsElement = document.getElementById("displayCalculatingGoods");
        calculatingGoodsElement.style.display = "none";
    }

    // Display a confirmation message with customer details
    Swal.fire({
        icon: "info",
        title: 'Customer Paid Successfully',
        html: `<p style="font-size: 16px;"><strong>Name:</strong> ${dequeuedCustomer.name}</p><br>
               <p style="font-size: 16px;"><strong>Items Ordered:</strong></p>
               <ul style="font-size: 16px;">
                   ${dequeuedCustomer.items.map(item => `<li>${item} $${getItemPrice(item).toFixed(2)}</li>`).join('')}
               </ul><br>
               <p style="font-size: 18px;"><strong>Total Amount:</strong> $${dequeuedCustomer.totalCost.toFixed(2)}</p>`,
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
function displayQueue() {
    let calculatingGoodsElement = document.getElementById("displayCalculatingGoods");
    calculatingGoodsElement.style.display = "none"; // Hide "Calculating goods" by default

    for (let i = 0; i < size; i++) {
        let customer = queue[i];
        let customerInfoElement = document.getElementById("customerInfo" + (i + 1));
        let goodsListElement = document.getElementById("goodsList" + (i + 1));

        if (customer) {
            customerInfoElement.textContent = customer.name;

            if (i === 0 && customer.items.length > 0) {
                calculatingGoodsElement.style.display = "block";
                calculatingGoodsElement.textContent = "Calculating goods...";
            }

            if (document.querySelector('.superMenu').classList.contains('active')) {
                goodsListElement.innerHTML = "Items Ordered:<br>";
                goodsListElement.innerHTML += "<ol>";

                if (customer.items.length > 0) {
                    let totalCost = 0;

                    customer.items.forEach(item => {
                        let itemCost = getItemPrice(item);
                        goodsListElement.innerHTML += `<li>${item} $${itemCost.toFixed(2)}</li>`;
                        totalCost += itemCost;
                    });

                    goodsListElement.innerHTML += "</ol>";
                    goodsListElement.innerHTML += `<br>Total Amount: $${totalCost.toFixed(2)}`;
                } else {
                    goodsListElement.innerHTML = "";
                }
            }
        } else {
            customerInfoElement.textContent = "";
            goodsListElement.innerHTML = "";

            if (i === 0 && !isEmpty()) {
                calculatingGoodsElement.style.display = "block";
                calculatingGoodsElement.textContent = "Calculating goods...";
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
let loginForm = document.querySelector('.superMenu');
document.querySelector('#customer').onclick = () => {
    loginForm.classList.toggle('active');
}

// Event listener for close login button to hide the login form
document.querySelector('#close-menu').onclick = () => {
    loginForm.classList.remove('active');
}

// Event listener for form submission to add a customer
document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    addCustomer();
});


// Express Counter Script

const randomNames = "Carl, Jacob, Kenji, Joanne, Joaana, HeroBrine, Justin, Timberlake, Warren, Dave, Jammy, Ace, Hakari, Gutang";
let availableNames = randomNames.split(', '); 

const itemExpress = {
    'Mango': 3.00,
    'Apple': 5.00,
    'Banana': 3.50,
    'Biscuit': 12.00,
    'Crackers': 12.50,
    'Oishi': 8.00,
    'Chips': 6.00,
    'Fita': 7.50,
    'Fish': 22.00,
    'Chicken': 15.00,
    'Beef': 25.00,
    'Pork': 27.00,
    'Kangkong': 5.00,
    'Shrimp': 17.00,
    'Prawn': 15.00,
    'Squid': 18.00,
    'Tuna': 50.00,
    'Salmon': 35.00,
    'Tofu': 23.00,
    'Egg': 10.00
};

const counterNames = ["Customer 1", "Customer 2", "Customer 3", "Customer 4", "Customer 5", "Customer 6", "Customer 7", "Customer 8", "Customer 9", "Customer 10"];
let currentCounterIndex = 0;

// Initialize an array to represent the Express Counter queue
let expressCounterQueue = [];

document.addEventListener("DOMContentLoaded", () => {

    generateCounters(); // This will be null in order to not accepting error when loading

    // Call generateCustomerForNextCounter initially to add customers to the counters
    generateCustomerForNextCounter();
});

document.getElementById("nextCounterBtn").addEventListener("click", dequeueCustomerExpress);
document.getElementById("nextCustomer").addEventListener("click", enqueueCustomer);

function getRandomName() {
    if (availableNames.length === 0) {
        // If all names have been used, reset the list
        availableNames = randomNames.split(', ');
    }
    
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    const selectedName = availableNames[randomIndex];
    // Remove the selected name from the available names list
    availableNames.splice(randomIndex, 1);

    return selectedName;
}



function enqueueCustomer() {
    if (expressCounterQueue.length < 10) {
        const randomName = getRandomName();
        const selectedProducts = getRandomProducts(5);
        const totalCost = calculateTotalCostproduct(selectedProducts);

        // Add the customer to the queue
        expressCounterQueue.push({
            name: randomName,
            items: selectedProducts,
            totalCost: totalCost
        });

        // Display the customer information
        displayExpressCounterQueue();
    } else {
        // Display a message if the maximum counter limit is reached
        Swal.fire({
            icon: 'warning',
            title: 'Queue Overflow',
            text: 'Cannot add more customers.',
        });
    }
}

function dequeueCustomerExpress() {
    // Check if there is a customer in the Express Counter queue
    if (expressCounterQueue.length > 0) {
        const dequeuedCustomer = expressCounterQueue.shift(); // Dequeue the customer

        // Display a confirmation message with customer details
        Swal.fire({
            icon: "info",
            title: 'Customer Paid Successfully',
            html: `<p style="font-size: 16px;"><strong>Name:</strong> ${dequeuedCustomer.name}</p><br>
               <p style="font-size: 16px;"><strong>Items Ordered:</strong></p>
               <ul style="font-size: 16px;">
                   ${dequeuedCustomer.items.map(item => `<li>${item} $${itemExpress[item].toFixed(2)}</li>`).join('')}
               </ul><br>
               <p style="font-size: 18px;"><strong>Total Amount:</strong> $${dequeuedCustomer.totalCost.toFixed(2)}</p>`,
        });

        // Display the updated Express Counter queue
        displayExpressCounterQueue();
    } else {
        // Display a message if there is no customer in the Express Counter queue
        Swal.fire({
            icon: 'warning',
            title: 'Queue is empty!',
        });
    }
}

function displayExpressCounterQueue() {
    const countersContainer = document.getElementById("countersContainer");
    countersContainer.innerHTML = ""; // Clear the existing counters

    expressCounterQueue.forEach((customer, index) => {
        if (customer.items.length > 0) {
            const counterElement = document.createElement("div");
            counterElement.classList.add("grid-box");
            counterElement.id = `counter${index + 1}`;

            // Add a conditional check to set green border for the first counter
            if (index === 0) {
                counterElement.style.border = "2px solid green";
            }


            // Calculate and add the total cost
            const totalCost = calculateTotalCostproduct(customer.items); // Change here

            counterElement.innerHTML = `<h3>Customer ${index + 1}</h3>
                                        <div class="customer-information">
                                            <p class="span">Name: ${customer.name}</p><br>
                                            <ul class="item-list">
                                                ${customer.items.map(item => `<li>${item} $${itemExpress[item].toFixed(2)}</li>`).join('')}
                                            </ul><br>
                                            <p>Total Amount: $${totalCost.toFixed(2)}</p>
                                        </div>`;

            countersContainer.appendChild(counterElement);
        }
    });
}


function getRandomProducts(count) {
    const allProducts = Object.keys(itemExpress);
    const randomProducts = [];

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * allProducts.length);
        randomProducts.push(allProducts[randomIndex]);
    }

    return randomProducts;
}

function calculateTotalCostproduct(products) {
    return products.reduce((total, product) => total + itemExpress[product], 0); 
}

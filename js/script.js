let queue = [];
let rear = -1;
let size = 5;
let selectedItems = [];

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

    rear = (rear + 1) % size;
    queue[rear] = { name: newCustomerName, items: [...selectedItems] };
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
                    goodsListElement.innerHTML = "Item Ordered:<br>";
                    goodsListElement.innerHTML += "<ol>"; // Start ordered list

                    customer.items.forEach(item => {
                        goodsListElement.innerHTML += `<li>${item}</li>`;
                    });

                    goodsListElement.innerHTML += "</ol>"; // End ordered list
                } else {
                    goodsListElement.innerHTML = "Item Ordered:"; // Display only when items are present
                }
            }
        } else {
            customerInfoElement.textContent = "";
            goodsListElement.innerHTML = "Item Ordered:"; // Reset content when no customer
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
            cartElement.innerHTML += `${item}<br>`;
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
let queue = [];
let rear = -1;
let size = 5; 

function addCustomer() {
    let newCustomer = prompt("Enter new customer name:");

    if (isQueueFull()) {
        alert("Queue is full!");
        return;
    }


    rear = (rear + 1) % size;
    queue[rear] = newCustomer;
    displayQueue();
}

function getRandomRefNo() {
    let random3Digit = Math.floor(Math.random() * 900) + 100;
    return "1772" + random3Digit;
}

function isQueueFull() {
    return rear == size - 1;
}

function dequeueCustomer() {
    if (isEmpty()) {
        alert("Queue is empty!");
        return;
    }

    if (rear < 0) {
        alert("Queue is empty!");
        return;
    }

    let dequeuedCustomer = queue.shift();
    rear = rear - 1;

    if (isEmpty()) {
        rear = -1;
    }

    displayQueue();
}

function isEmpty() {
    return rear == -1;
}



function displayQueue() {
    for (let i = 0; i < size; i++) {
        let customer = queue[i];

        if (customer) {
            document.getElementById("customerInfo" + (i + 1)).textContent = customer;
            document.getElementById("goodsList" + (i + 1)).textContent = "Item 1, Item 2, Item 3";
        } else {
            document.getElementById("customerInfo" + (i + 1)).textContent = "";
            document.getElementById("goodsList" + (i + 1)).textContent = "";
        }
    }
}

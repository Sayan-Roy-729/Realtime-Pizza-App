import axios from "axios";
import moment from "moment";
import Noty from "noty";

import initAdmin from "./admin";

const addToCart = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector("#cartCounter");

// Add to cart by sending axios request
const updateCart = (pizza) => {
    axios
        .post("/update-cart", pizza)
        .then((response) => {
            cartCounter.innerText = response.data.totalQty;
            new Noty({
                type: "success",
                timeout: 1000,
                text: "Item added to cart",
                progressBar: false,
                layout: "topRight",
            }).show();
        })
        .catch((err) => {
            new Noty({
                type: "error",
                timeout: 1000,
                text: "Something went wrong. Try again",
                progressBar: false,
                layout: "topRight",
            }).show();
        });
};

// Add listener to every pizza card
addToCart.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        const pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    });
});

// Remove alert message after X seconds
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
    setTimeout(() => {
        alertMsg.remove();
    }, 2000);
}



// Change order status
let statuses = document.querySelectorAll(".status_line");
let time = document.createElement("small");

const updateStatus = (order) => {
    statuses.forEach((status) => {
        status.classList.remove('step-completed');
        status.classList.remove('current');
    });

    let stepCompleted = true;
    statuses.forEach((status) => {
        let dataProp = status.dataset.status;
        if (stepCompleted) {
            status.classList.add("step-completed");
        }
        if (dataProp === order.status) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format("hh:mm A");
            status.appendChild(time);
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add("current");
            }
        }
    });
};

const hiddenInput = document.querySelector("#hiddenInput");
const order = hiddenInput ? JSON.parse(hiddenInput.value) : null;
updateStatus(order);

// Socket
let socket = io();
initAdmin(socket);
// Join
if (order) {
    socket.emit("join", `order_${order._id}`);
}

let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes('admin')) {
    socket.emit('join', 'adminRoom');
} 

socket.on("order", (data) => {
    const updatedOrder = { ...order };
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);

    new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Order updated',
        progressBar: false,
    }).show();
});

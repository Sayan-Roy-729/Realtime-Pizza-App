import axios from "axios";
import Noty from "noty";

import initAdmin from './admin';

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

initAdmin();
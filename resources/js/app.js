import axios from "axios";
import Noty from 'noty';

const addToCart = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector("#cartCounter");

const updateCart = (pizza) => {
    axios
        .post("/update-cart", pizza)
        .then((response) => {
            cartCounter.innerText = response.data.totalQty;
            new Noty({
                type: 'success',
                timeout: 1000,
                text: 'Item added to cart',
                progressBar: false,
                layout: 'topRight',
            }).show();
        })
        .catch((err) => {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: 'Something went wrong. Try again',
                progressBar: false,
                layout: 'topRight',
            }).show();
        });
};

addToCart.forEach((btn) => {
    btn.addEventListener("click", (event) => {
        const pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    });
});

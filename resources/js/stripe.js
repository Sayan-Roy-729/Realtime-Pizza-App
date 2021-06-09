import { loadStripe } from "@stripe/stripe-js";

import { placeOrder } from "./apiService";
import { CardWidget } from './CardWidget';

const initStripe = async () => {
    const stripe = await loadStripe(
        "pk_test_51IiKV7SGTYp6ckpFSknK6V8Yt4FFJyQ0J8Gf9q4ab3OLdRRSgGmMHZAt547LEz0nKLEy1RfoUT57Cf83ijaiww4D00SFrRC0BU"
    );
    let card;

    const mountWidget = () => {
        // const elements = stripe.elements();

        // let style = {
        //     base: {
        //         color: "#32325d",
        //         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        //         fontSmoothing: "antialiased",
        //         fontSize: "16px",
        //         "::placeholder": {
        //             color: "#aab7c4",
        //         },
        //     },
        //     invalid: {
        //         color: "#fa755a",
        //         iconColor: "#fa755a",
        //     },
        // };
        // card = elements.create("card", { style, hidePostalCode: true });
        // card.mount("#card-element");
    };

    const paymentType = document.querySelector("#paymentType");
    if (!paymentType) {
        return;
    }
    paymentType.addEventListener("change", (event) => {
        if (event.target.value === "card") {
            // Display Widget
            card = new CardWidget(stripe);
            card.mount();
            // mountWidget();
        } else {
            card.destroy();
        }
    });

    // Ajax call
    const paymentForm = document.querySelector("#payment-form");
    if (paymentForm) {
        paymentForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const formData = new FormData(paymentForm);

            const formObject = {};
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }

            if (!card) {
                // Ajax
                placeOrder(formObject);
                return;
            }
            // Verify card
            const token = await card.createToken();
            formObject.stripeToken = token.id;
            // Send to the backend
            placeOrder(formObject);
            // stripe
            //     .createToken(card)
            //     .then((result) => {
            //         console.log(result);
            //         formObject.stripeToken = result.token.id;
            //         placeOrder(formObject);
            //     })
            //     .catch((err) => {
            //         console.log(err);
            //     });
        });
    }
};

export default initStripe;

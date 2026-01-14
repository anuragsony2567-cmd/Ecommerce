import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from 'react-redux';
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
import "../Stripe.css";
import { selectCurrentOrder } from "../features/order/orderSlice";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  "pk_test_51QIJu1EDyIGp3ib4HrxAPweWfgOJzwQr5R5wSR66W8JrhsyUvhkNaF2YhjwHQQ1H005dCdhF6f2fashpytFWxiVK00OAhK9zaE"
);

export default function StripeCheckout() {
  const [clientSecret, setClientSecret] = useState("");
  const currentOrder = useSelector(selectCurrentOrder)


  const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true, // send cookies/session
  });
useEffect(() => {
  // Create PaymentIntent as soon as the page loads
  api
    .post("/create-payment-intent", {
      totalAmount: currentOrder.totalAmount,
      orderId: currentOrder.id,
    })
    .then((response) => {
      console.log(response.data);
      setClientSecret(response.data.clientSecret); 
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error.response?.data || error.message);
    });
}, []);

console.log (clientSecret)

  const appearance = {
    theme: 'stripe',
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div className="Stripe">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
} 
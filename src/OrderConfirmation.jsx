import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import emailjs from "@emailjs/browser";
import "./OrderConfirmation.css";
import Check from "./assets/check.png";

emailjs.init("jgvl-_8kKxjxQvtYm");

export default function OrderConfirmation() {
  const location = useLocation();
  const { name, email, orderId } = location.state || {};

  useEffect(() => {
    if (email && name) {
      const templateParams = {
        to_name: name,
        to_email: email,
        message: `Thank you for your order, ${name}! Your order ID is: ${orderId}. We'll be informing you about your order status soon.`,
      };

      emailjs
        .send("service_zighp2c", "template_0uxrk4d", templateParams)
        .then((response) => {
          console.log("SUCCESS!", response.status, response.text);
        })
        .catch((err) => {
          console.log("FAILED...", err);
        });

      localStorage.setItem("cart", "[]");
      window.dispatchEvent(new Event("cart-update"));
    }
  }, [email, name]);

  return (
    <div>
      <Navbar />
      <div className="confirmation-container">
        <h1>Thank you for your order {name}!</h1>
        <p>Your order ID: {orderId}</p>
        <p>We've sent all the information to your email!</p>
        <img src={Check} alt="Check icon" />
      </div>
    </div>
  );
}

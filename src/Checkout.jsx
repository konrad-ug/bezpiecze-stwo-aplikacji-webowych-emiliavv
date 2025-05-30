import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar/Navbar";
import keycloak from "./keycloak";
import "./Checkout.css";
import { sanitizeInput, sanitizeEmail, sanitizePhone, sanitizeCardNumber, sanitizeZipCode } from "./utils/sanitize";

export default function Checkout() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shipping: { street: "", city: "", zipCode: "", country: "" },
    payment: { cardNumber: "", expiryDate: "", cvv: "" },
    contact: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      password: "",
      repeatPassword: "",
    },
    isChecked: false,
  });

  const validateAllData = () => {
    const { shipping, payment, contact, isChecked } = formData;

    const baseValidation =
      Object.values(shipping).every((val) => val.trim() !== "") &&
      Object.values(payment).every((val) => val.trim() !== "") &&
      Object.values(contact)
        .slice(0, 4)
        .every((val) => val.trim() !== "");

    if (isChecked) {
      return (
        baseValidation &&
        contact.password.trim() !== "" &&
        contact.repeatPassword.trim() !== "" &&
        contact.password === contact.repeatPassword
      );
    }

    return baseValidation;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAllData()) {
      alert("Please fill in all required fields");
      return;
    }

    if (
      formData.isChecked &&
      formData.contact.password !== formData.contact.repeatPassword
    ) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          productName: item.title
        })),
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        shipping: formData.shipping,
        contact: {
          name: formData.contact.name,
          surname: formData.contact.surname,
          email: formData.contact.email,
          phone: formData.contact.phone
        },
        status: "pending",
        date: new Date().toISOString()
      };

      await keycloak.updateToken(30);
      const response = await axios.post("http://localhost:3001/api/order-history", orderData, {
        headers: {
          Authorization: `Bearer ${keycloak.token}`
        }
      });

      localStorage.setItem('cart', '[]');
      window.dispatchEvent(new Event('cart-update'));
      
      navigate("/order-confirmation", {
        state: {
          name: formData.contact.name,
          email: formData.contact.email,
          orderId: response.data.id
        },
      });
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order. Please try again.");
    }
  };

  const handleInputChange = (section, field, value) => {
    let sanitizedValue = value;

    switch (field) {
      case 'email':
        sanitizedValue = sanitizeEmail(value);
        break;
      case 'phone':
        sanitizedValue = sanitizePhone(value);
        break;
      case 'cardNumber':
        sanitizedValue = sanitizeCardNumber(value);
        break;
      case 'zipCode':
        sanitizedValue = sanitizeZipCode(value);
        break;
      default:
        sanitizedValue = sanitizeInput(value);
    }

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: sanitizedValue,
      },
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      isChecked: !prev.isChecked,
    }));
  };

  return (
    <div>
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>
        <form onSubmit={handleSubmit} className="checkout-form-container">
          <div className="checkout-section">
            <h2>Shipping Address</h2>
            <div className="section-content">
              <input
                type="text"
                placeholder="Street Address"
                value={formData.shipping.street}
                onChange={(e) =>
                  handleInputChange("shipping", "street", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.shipping.city}
                onChange={(e) =>
                  handleInputChange("shipping", "city", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="ZIP Code"
                value={formData.shipping.zipCode}
                onChange={(e) =>
                  handleInputChange("shipping", "zipCode", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={formData.shipping.country}
                onChange={(e) =>
                  handleInputChange("shipping", "country", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2>Payment Method</h2>
            <div className="section-content">
              <input
                type="text"
                placeholder="Card Number"
                value={formData.payment.cardNumber}
                onChange={(e) =>
                  handleInputChange("payment", "cardNumber", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="MM/YY"
                value={formData.payment.expiryDate}
                onChange={(e) =>
                  handleInputChange("payment", "expiryDate", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="CVV"
                value={formData.payment.cvv}
                onChange={(e) =>
                  handleInputChange("payment", "cvv", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="checkout-section">
            <h2>Contact Information</h2>
            <div className="section-content">
              <input
                type="text"
                placeholder="Name"
                value={formData.contact.name}
                onChange={(e) =>
                  handleInputChange("contact", "name", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Surname"
                value={formData.contact.surname}
                onChange={(e) =>
                  handleInputChange("contact", "surname", e.target.value)
                }
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.contact.email}
                onChange={(e) =>
                  handleInputChange("contact", "email", e.target.value)
                }
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.contact.phone}
                onChange={(e) =>
                  handleInputChange("contact", "phone", e.target.value)
                }
                required
              />
            </div>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="hello-checkbox"
              checked={formData.isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="hello-checkbox">
              I want to create an account and get 10% off next order !
            </label>
          </div>

          {formData.isChecked && (
            <div className="password-section">
              <input
                type="password"
                placeholder="Password"
                value={formData.contact.password}
                onChange={(e) =>
                  handleInputChange("contact", "password", e.target.value)
                }
                required
              />
              <input
                type="password"
                placeholder="Repeat Password"
                value={formData.contact.repeatPassword}
                onChange={(e) =>
                  handleInputChange("contact", "repeatPassword", e.target.value)
                }
                required
              />
            </div>
          )}

          <button type="submit" className="place-order-button">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

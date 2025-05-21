import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import "./SignIn.css";

export default function SignIn() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (formData.password !== formData.repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    const userData = {
      name: formData.name,
      surname: formData.surname,
      email: formData.email,
      password: formData.password,
    };

    localStorage.setItem(
      "users",
      JSON.stringify([
        ...JSON.parse(localStorage.getItem("users") || "[]"),
        userData,
      ])
    );

    alert("Registration successful! Please sign in.");
    setFormData({
      name: "",
      surname: "",
      email: "",
      password: "",
      repeatPassword: "",
    });
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      window.location.href = "/";
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="sign">
        <h1>
          Already have an account ? <span className="pink">Sign in !</span>
        </h1>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Sign in</button>
        </form>
        <h1>
          Don't yet have an account ?{" "}
          <span className="pink">
            Register and get <span style={{ fontWeight: "bold" }}>10%</span> off
            your first order !
          </span>
        </h1>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="surname"
            placeholder="Surname"
            value={formData.surname}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="repeatPassword"
            placeholder="Repeat password"
            value={formData.repeatPassword}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

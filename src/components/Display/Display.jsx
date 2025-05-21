import React from "react";
import Sale from "../../assets/Sale.png";
import Register from "../../assets/Register.png";
import Code from "../../assets/Code.png";
import "./Display.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Display() {
  return (
    <div className="carousel-container">
      <div
        id="carouselExampleControls"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <a href="#">
              <img className="d-block w-100" src={Sale} alt="First slide" />
            </a>
          </div>
          <div className="carousel-item">
            <a href="#">
              <img
                className="d-block w-100"
                src={Register}
                alt="Second slide"
              />
            </a>
          </div>
          <div className="carousel-item">
            <img className="d-block w-100" src={Code} alt="Third slide" />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="sr-only"></span>
        </button>
      </div>
    </div>
  );
}

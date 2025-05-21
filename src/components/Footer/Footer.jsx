import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="footer">
      <br />
      <div className="contact">
        <p>Contact Us:</p>
        <ul>
          <li>📞 +48 123 456 789</li>
          <li>📩 berry@shop.com</li>
          <li>
            <a href="#"> Facebook</a>
          </li>
          <li>
            <a href="#"> Instagram</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

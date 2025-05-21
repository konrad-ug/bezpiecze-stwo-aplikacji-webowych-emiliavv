import React from "react";
import Navbar from "./components/Navbar/Navbar";
import "./SignIn.css";
import keycloak from "./keycloak";

export default function SignIn() {
  const handleSignIn = () => {
    keycloak.login();
  };

  const handleRegister = () => {
    keycloak.register();
  };

  return (
    <div>
      <Navbar />
      <div className="sign">
        <h1>
          Already have an account ? <span className="pink">Sign in !</span>
        </h1>
        <div className="auth-buttons">
          <button onClick={handleSignIn} className="auth-button">Sign in with Keycloak</button>
        </div>
        <h1>
          Don't yet have an account ?{" "}
          <span className="pink">
            Register and get <span style={{ fontWeight: "bold" }}>10%</span> off
            your first order !
          </span>
        </h1>
        <div className="auth-buttons">
          <button onClick={handleRegister} className="auth-button">Register with Keycloak</button>
        </div>
      </div>
    </div>
  );
}

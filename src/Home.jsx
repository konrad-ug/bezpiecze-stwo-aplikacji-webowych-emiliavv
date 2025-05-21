import React from "react";
import "./Home.css";
import Navbar from "./components/Navbar/Navbar";
import Display from "./components/Display/Display";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Display />
    </div>
  );
}

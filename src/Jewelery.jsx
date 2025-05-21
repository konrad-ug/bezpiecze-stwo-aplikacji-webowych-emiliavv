import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Filter, { FilterProvider } from "./components/Filter/Filter";
import JeweleryContent from "./components/JeweleryContent/JeweleryContent";
import "./Jewelery.css";

const Jewelery = () => {
  return (
    <FilterProvider>
      <div className="jewelery">
        <Navbar />
        <h1 id="jewelery">Jewelery</h1>
        <div className="content">
          <Filter />
          <JeweleryContent />
        </div>
      </div>
    </FilterProvider>
  );
};

export default Jewelery;

import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Filter, { FilterProvider } from "./components/Filter/Filter";
import ClothesContent from "./components/clothesContent/clothesContent";
import "./Clothes.css";

const Clothes = () => {
  return (
    <FilterProvider>
      <div className="clothes">
        <Navbar />
        <h1 id="women-clothes">Women's Clothes</h1>
        <div className="content">
          <Filter />
          <ClothesContent />
        </div>
      </div>
    </FilterProvider>
  );
};

export default Clothes;

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useFilter } from "../Filter/Filter";
import { addToCart } from "../cartAdd/cartAdd";
import cart from "../../assets/basket.png";

const JeweleryContent = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { state: filterState } = useFilter();
  const [productRatings, setProductRatings] = useState({});

  const handleProductClick = useCallback(
    (productId) => {
      navigate(`/product/${productId}`);
    },
    [navigate]
  );

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://fakestoreapi.com/products/category/jewelery"
        );
        const jeweleryData = response.data;
        setItems(jeweleryData);
        setLoading(false);

        const ratingsPromises = jeweleryData.map(async (product) => {
          const savedRatings = localStorage.getItem(`ratings_${product.id}`);
          const ratings = savedRatings ? JSON.parse(savedRatings) : [];

          if (ratings.length > 0) {
            const sum = ratings.reduce((acc, curr) => acc + curr, 0);
            return {
              productId: product.id,
              averageRating: sum / ratings.length,
              ratingCount: ratings.length,
            };
          }
          return {
            productId: product.id,
            averageRating: product.rating.rate,
            ratingCount: product.rating.count,
          };
        });

        const ratingsResults = await Promise.all(ratingsPromises);
        const ratingsMap = ratingsResults.reduce((acc, curr) => {
          acc[curr.productId] = {
            averageRating: curr.averageRating,
            ratingCount: curr.ratingCount,
          };
          return acc;
        }, {});

        setProductRatings(ratingsMap);
      } catch (error) {
        console.error("Error fetching jewelery:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const { minPrice, maxPrice, rating } = filterState;

        const meetsMinPrice = !minPrice || item.price >= Number(minPrice);
        const meetsMaxPrice = !maxPrice || item.price <= Number(maxPrice);
        const meetsRating =
          !rating ||
          (rating === "5"
            ? productRatings[item.id]?.averageRating === 5
            : productRatings[item.id]?.averageRating >= Number(rating));

        return meetsMinPrice && meetsMaxPrice && meetsRating;
      })
      .sort((a, b) => {
        switch (filterState.sort) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "rating-desc":
            return (
              (productRatings[b.id]?.averageRating || 0) -
              (productRatings[a.id]?.averageRating || 0)
            );
          default:
            return 0;
        }
      });
  }, [items, filterState, productRatings]);

  if (loading) {
    return (
      <div className="jewelery">
        <h1 id="loading-jewelery">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="jewelery">
      <div className="box jewelery-container">
        {filteredItems.map((item) => (
          <div key={item.id} className="item jewelery-item">
            <img
              id="pictures-jewelery"
              src={item.image}
              alt={item.title}
              onClick={() => handleProductClick(item.id)}
            />
            <h2 id="describtions-jewelery">{item.title}</h2>
            <p id="prices-jewelery">${item.price}</p>
            <button
              className="addToBasket"
              onClick={() => {
                addToCart(item);
              }}
            >
              <img id="cart" src={cart} alt="Add to basket" />
            </button>
            <p className="small-rating">
              {(productRatings[item.id]?.averageRating || 0).toFixed(1)} ★ (
              {productRatings[item.id]?.ratingCount || 0} reviews)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JeweleryContent;

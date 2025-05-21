import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Navbar.css";
import Logo from "../../assets/Logo.png";
import keycloak from "../../keycloak";
import { sanitizeInput } from "../../utils/sanitize";

export default function Navbar() {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [products, setProducts] = useState([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    category: "",
    rating: "",
  });
  const searchInputRef = useRef(null);

  useLayoutEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(totalItems);
    };
    updateCartCount();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(totalItems);
    };

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cart-update", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cart-update", updateCartCount);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await keycloak.logout();
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e) => {
    const query = sanitizeInput(e.target.value).toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    if (filters.minPrice) {
      filtered = filtered.filter(
        (product) => product.price >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(
        (product) => product.price <= Number(filters.maxPrice)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(
        (product) => product.rating.rate >= Number(filters.rating)
      );
    }

    setSuggestions(filtered.slice(0, 5));
    setShowSuggestions(true);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    handleSearch({ target: { value: searchQuery } });
  };

  const handleSuggestionClick = (product) => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate(`/product/${product.id}`);
  };

  const categories = ["jewelery", "women's clothing"];

  return (
    <div className="Navbar">
      <div className="Main">
        <ul>
          <li className="company">
            <img src={Logo} alt="logo" />
            <h1>
              <Link to="/">Berry</Link>
            </h1>
          </li>
          <li>
            <div className="right">
              {keycloak.authenticated ? (
                <>
                  {keycloak.hasRealmRole('admin') && (
                    <Link to="/admin" className="me-3">Panel Admina</Link>
                  )}
                  <Link to="/" onClick={handleLogout}>Sign Out</Link>
                </>
              ) : (
                <Link to="/SignIn">Sign In / Register</Link>
              )}
              <Link to="/Cart">Shopping bag({cartItemCount})</Link>
            </div>
          </li>
        </ul>
      </div>
      <div className="Nav">
        <ul>
          <li>
            <Link to="/Clothes">Clothes</Link>
          </li>
          <li>
            <Link to="/Jewelery">Jewelery</Link>
          </li>
          <li>
            <Link to="#">Bags</Link>
          </li>
          <li className="search-container">
            <div className="search-header">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="🔎 Search..."
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => setShowSuggestions(true)}
              />
              <button
                className="advanced-search-toggle"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                {showAdvancedSearch ? "▼" : "▲"}
              </button>
            </div>

            {showAdvancedSearch && (
              <div className="advanced-filters">
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="price-filters">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min Price"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max Price"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                  />
                </div>
                <select
                  name="rating"
                  value={filters.rating}
                  onChange={handleFilterChange}
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ ★</option>
                  <option value="3">3+ ★</option>
                  <option value="2">2+ ★</option>
                  <option value="1">1+ ★</option>
                </select>
              </div>
            )}

            {showSuggestions && suggestions.length > 0 && (
              <div className="suggestions">
                {suggestions.map((product) => (
                  <div
                    key={product.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(product)}
                  >
                    <div className="suggestion-main">
                      <span className="title">{product.title}</span>
                      <span className="category">{product.category}</span>
                    </div>
                    <div className="suggestion-details">
                      <span className="price">${product.price}</span>
                      <span className="rating">★ {product.rating.rate}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
}

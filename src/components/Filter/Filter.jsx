import React, { createContext, useContext, useReducer, useMemo } from "react";
import "./Filter.css";

export const FilterContext = createContext();

const filterReducer = (state, action) => {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, ...action.payload };
    case "RESET_FILTERS":
      return initialState;
    default:
      return state;
  }
};

const initialState = {
  minPrice: "",
  maxPrice: "",
  rating: "",
  sort: "",
};

export const FilterProvider = ({ children }) => {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const value = useMemo(
    () => ({
      state,
      dispatch,
      setFilters: (filters) =>
        dispatch({ type: "SET_FILTER", payload: filters }),
      resetFilters: () => dispatch({ type: "RESET_FILTERS" }),
    }),
    [state]
  );

  return (
    <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
};

const Filter = () => {
  const { state, setFilters, resetFilters } = useFilter();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
  };

  return (
    <div className="filter-container">
      <div className="filter-header">
        <h2>Filter</h2>
        <button onClick={resetFilters}>Clear</button>
      </div>

      <div className="filter-content">
        <div className="filter-section">
          <h3>Price:</h3>
          <div className="price-inputs">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={state.minPrice}
              onChange={handleFilterChange}
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={state.maxPrice}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <div className="filter-section">
          <h3>Rating:</h3>
          <div className="filter-options">
            <label>
              <input
                type="radio"
                name="rating"
                value=""
                checked={state.rating === ""}
                onChange={handleFilterChange}
              />
              Any
            </label>
            <label>
              <input
                type="radio"
                name="rating"
                value="5"
                checked={state.rating === "5"}
                onChange={handleFilterChange}
              />
              5★
            </label>
            {[4, 3, 2, 1].map((rating) => (
              <label key={rating}>
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={state.rating === rating.toString()}
                  onChange={handleFilterChange}
                />
                {rating}+★
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Sort:</h3>
          <div className="filter-options">
            <label>
              <input
                type="radio"
                name="sort"
                value=""
                checked={state.sort === ""}
                onChange={handleFilterChange}
              />
              Default
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                value="price-asc"
                checked={state.sort === "price-asc"}
                onChange={handleFilterChange}
              />
              Price ↑
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                value="price-desc"
                checked={state.sort === "price-desc"}
                onChange={handleFilterChange}
              />
              Price ↓
            </label>
            <label>
              <input
                type="radio"
                name="sort"
                value="rating-desc"
                checked={state.sort === "rating-desc"}
                onChange={handleFilterChange}
              />
              Top Rated
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;

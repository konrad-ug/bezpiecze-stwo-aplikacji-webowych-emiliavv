import React, { useReducer, useLayoutEffect, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import "./Cart.css";

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return {
        ...state,
        items: action.payload,
      };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case "APPLY_DISCOUNT":
      return {
        ...state,
        discountCode: action.payload.code,
        discount: action.payload.value,
      };
    case "SET_DISCOUNT_CODE":
      return {
        ...state,
        discountCode: action.payload,
      };
    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        discountCode: "",
        discount: 0,
      };
    default:
      return state;
  }
};

const initialState = {
  items: [],
  discountCode: "",
  discount: 0,
};

const Cart = () => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
    dispatch({ type: "SET_CART", payload: cartItems });
  }, []);

  useEffect(() => {
    const handleCartUpdate = () => {
      const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
      dispatch({ type: "SET_CART", payload: cartItems });
    };

    window.addEventListener("cart-update", handleCartUpdate);
    return () => {
      window.removeEventListener("cart-update", handleCartUpdate);
    };
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQuantity },
      });
    }

    const updatedCart = state.items
      .map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
      .filter((item) => item.quantity > 0);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-update"));
  };

  const removeFromCart = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
    const updatedCart = state.items.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cart-update"));
  };

  const handleDiscountCode = (code) => {
    if (code === "EXAM20") {
      dispatch({
        type: "APPLY_DISCOUNT",
        payload: { code, value: 20 },
      });
    }
  };

  const cartTotal = useMemo(() => {
    const subtotal = state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return state.discount
      ? subtotal - (subtotal * state.discount) / 100
      : subtotal;
  }, [state.items, state.discount]);

  const originalTotal = useMemo(() => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [state.items]);

  return (
    <div>
      <Navbar />
      <h1 className="cart-title">Shopping bag</h1>
      <div className="cart-container">
        <div className="cart-items-container">
          {state.items.length === 0 ? (
            <p className="noting-incart">
              Your shopping bag is empty... <span>Time to go shopping!</span>
            </p>
          ) : (
            state.items.map((item) => (
              <div key={item.id} className="cart-items">
                <img src={item.image} alt={item.title} />
                <div className="products-incart">
                  <h2>{item.title}</h2>
                  <p className="price">Price: {item.price}$</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                  />
                  <button onClick={() => removeFromCart(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {state.items.length > 0 && (
          <div className="cart-summary">
            <hr />
            <h2>
              Summary: <span>${cartTotal.toFixed(2)}</span>
            </h2>
            {state.discount > 0 && (
              <div className="discount-applied">
                <p>Code Applied !</p>
                <p className="original-price">${originalTotal.toFixed(2)}</p>
              </div>
            )}
            <button onClick={() => navigate("/checkout")}>
              Go to checkout
            </button>
            <div className="discount-section">
              <input
                type="text"
                value={state.discountCode}
                onChange={(e) =>
                  dispatch({
                    type: "SET_DISCOUNT_CODE",
                    payload: e.target.value,
                  })
                }
                placeholder="Enter discount code"
              />
              <button onClick={() => handleDiscountCode(state.discountCode)}>
                Apply
              </button>
            </div>
            <hr />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

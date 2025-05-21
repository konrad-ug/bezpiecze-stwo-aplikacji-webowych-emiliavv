import React from "react";
import PropTypes from 'prop-types';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import keycloak from "./keycloak";
import Home from "./Home.jsx";
import Clothes from "./Clothes.jsx";
import Jewelery from "./Jewelery.jsx";
import Cart from "./Cart";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import Inventory from "./components/admin/Inventory";
import ProductDetail from "./ProductDetail.jsx";
import Checkout from "./Checkout";
import OrderConfirmation from "./OrderConfirmation";
import SignIn from "./SignIn";

const PrivateRoute = ({ children, requireAdmin }) => {
  if (!keycloak.authenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && !keycloak.hasRealmRole('admin')) {
    return <Navigate to="/" replace />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requireAdmin: PropTypes.bool
};

PrivateRoute.defaultProps = {
  requireAdmin: false
};

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {keycloak.authenticated && (
          <>
          </>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clothes" element={<Clothes />} />
          <Route path="/jewelery" element={<Jewelery />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <PrivateRoute>
              <Checkout />
            </PrivateRoute>
          } />
          <Route path="/order-confirmation" element={
            <PrivateRoute>
              <OrderConfirmation />
            </PrivateRoute>
          } />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/admin" element={
            <PrivateRoute requireAdmin={true}>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
      {/* Brand Logo */}
      <Link to="/admin" className="brand-link">
        <span className="brand-text font-weight-light">Admin Panel</span>
      </Link>

      {/* Sidebar */}
      <div className="sidebar">
        {/* Sidebar user panel (optional) */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex">
          <div className="info">
            <a href="#" className="d-block">
              Emilia Wójcik
            </a>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="mt-2">
          <ul
            className="nav nav-pills nav-sidebar flex-column"
            data-widget="treeview"
            role="menu"
          >
            <li className="nav-item">
              <Link to="/admin" className="nav-link">
                <i className="nav-icon fas fa-tachometer-alt"></i>
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/products" className="nav-link">
                <i className="nav-icon fas fa-box"></i>
                <p>Products</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/categories" className="nav-link">
                <i className="nav-icon fas fa-list"></i>
                <p>Categories</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/orders" className="nav-link">
                <i className="nav-icon fas fa-shopping-cart"></i>
                <p>Orders</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/inventory" className="nav-link">
                <i className="nav-icon fas fa-warehouse"></i>
                <p>Inventory</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AdminLayout = () => {
  useEffect(() => {
    // Add AdminLTE CSS
    const adminLteLink = document.createElement('link');
    adminLteLink.rel = 'stylesheet';
    adminLteLink.href = 'https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/css/adminlte.min.css';
    document.head.appendChild(adminLteLink);

    // Add Font Awesome CSS
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);

    return () => {
      document.head.removeChild(adminLteLink);
      document.head.removeChild(fontAwesomeLink);
    };
  }, []);

  return (
    <div className="wrapper">
      <Navbar />
      <Sidebar />
      
      <div className="content-wrapper">
        <Outlet />
      </div>

      <footer className="main-footer">
        <div className="float-right d-none d-sm-inline">
          Version 1.0.0
        </div>
        <strong>Copyright &copy; {new Date().getFullYear()}</strong> All rights reserved.
      </footer>
    </div>
  );
};

export default AdminLayout;

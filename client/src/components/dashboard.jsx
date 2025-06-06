import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const Dashboard = () => {
  const location = useLocation();

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{
        width: '200px',
        backgroundColor: '#2c3e50',
        color: '#ecf0f1',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <h2>Dashboard</h2>
        <Link 
          to="/dashboard/home"
          style={{ color: location.pathname === '/dashboard/home' ? '#1abc9c' : '#ecf0f1', textDecoration: 'none' }}
        >
          Home
        </Link>
        <Link 
          to="/dashboard/clients"
          style={{ color: location.pathname === '/dashboard/clients' ? '#1abc9c' : '#ecf0f1', textDecoration: 'none' }}
        >
          Clients
        </Link>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

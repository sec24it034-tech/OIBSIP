import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../api';
import { FaBox, FaMoneyBill, FaExclamationTriangle, FaShoppingCart, FaFire, FaCheck } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <h1 className="mb-3">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-4 mb-3">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '10px', 
              backgroundColor: '#e3f2fd',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1565c0',
              fontSize: '1.5rem'
            }}>
              <FaBox />
            </div>
            <div>
              <p style={{ margin: 0, color: '#666' }}>Total Orders</p>
              <h2 style={{ margin: 0 }}>{stats?.totalOrders || 0}</h2>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '10px', 
              backgroundColor: '#e8f5e9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#2e7d32',
              fontSize: '1.5rem'
            }}>
              <FaMoneyBill />
            </div>
            <div>
              <p style={{ margin: 0, color: '#666' }}>Total Revenue</p>
              <h2 style={{ margin: 0 }}>₹{stats?.totalRevenue || 0}</h2>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '10px', 
              backgroundColor: '#fff3e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#e65100',
              fontSize: '1.5rem'
            }}>
              <FaShoppingCart />
            </div>
            <div>
              <p style={{ margin: 0, color: '#666' }}>Pending Orders</p>
              <h2 style={{ margin: 0 }}>{stats?.pendingOrders || 0}</h2>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '10px', 
              backgroundColor: '#fce4ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c2185b',
              fontSize: '1.5rem'
            }}>
              <FaExclamationTriangle />
            </div>
            <div>
              <p style={{ margin: 0, color: '#666' }}>Low Stock Items</p>
              <h2 style={{ margin: 0 }}>{stats?.lowStockItems || 0}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Cards */}
      <div className="grid grid-3 mb-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <FaBox style={{ fontSize: '2rem', color: '#1565c0', marginBottom: '0.5rem' }} />
          <h3>{stats?.pendingOrders || 0}</h3>
          <p>Order Received</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <FaFire style={{ fontSize: '2rem', color: '#e65100', marginBottom: '0.5rem' }} />
          <h3>{stats?.inKitchenOrders || 0}</h3>
          <p>In Kitchen</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <FaCheck style={{ fontSize: '2rem', color: '#2e7d32', marginBottom: '0.5rem' }} />
          <h3>{stats?.deliveredOrders || 0}</h3>
          <p>Delivered</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Recent Orders</h3>
          <Link to="/admin/orders" className="btn btn-outline">View All</Link>
        </div>

        {stats?.recentOrders?.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>{order.user?.name || 'Unknown'}</td>
                  <td>₹{order.grandTotal}</td>
                  <td>
                    <span className={`status-badge status-${order.orderStatus.toLowerCase().replace(' ', '')}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No recent orders</p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-2 mt-3">
        <Link to="/admin/orders" className="btn btn-primary">Manage Orders</Link>
        <Link to="/admin/inventory" className="btn btn-secondary">Manage Inventory</Link>
      </div>
    </div>
  );
};

export default Dashboard;
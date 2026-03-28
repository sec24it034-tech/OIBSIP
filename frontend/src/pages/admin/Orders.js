import React, { useEffect, useState } from 'react';
import { getAllOrders, updateAdminOrderStatus } from '../../api';
import { toast } from 'react-toastify';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders(statusFilter);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      toast.success('Order status updated!');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['Order Received', 'In Kitchen', 'Out for Delivery', 'Delivered', 'Cancelled'];
    return allStatuses.filter(s => s !== currentStatus);
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Order Received': return 'status-received';
      case 'In Kitchen': return 'status-kitchen';
      case 'Out for Delivery': return 'status-delivery';
      case 'Delivered': return 'status-delivered';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      <h1 className="mb-3">Manage Orders</h1>

      {/* Filter */}
      <div className="card mb-3">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FaFilter />
          <label>Filter by Status:</label>
          <select 
            className="form-control" 
            style={{ width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Orders</option>
            <option value="Order Received">Order Received</option>
            <option value="In Kitchen">In Kitchen</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <p>No orders found</p>
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6)}</td>
                  <td>
                    <div>
                      <strong>{order.user?.name || 'Unknown'}</strong>
                      <br />
                      <small style={{ color: '#666' }}>{order.user?.phone}</small>
                    </div>
                  </td>
                  <td>
                    {order.orderItems.map((item, idx) => (
                      <div key={idx} style={{ fontSize: '0.9rem' }}>
                        {item.name} x {item.quantity}
                      </div>
                    ))}
                  </td>
                  <td>₹{order.grandTotal}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-control"
                      style={{ width: 'auto', padding: '0.5rem' }}
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="">Change Status</option>
                      {getStatusOptions(order.orderStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
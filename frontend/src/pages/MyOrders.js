import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/slices/orderSlice';
import { FaBox, FaClock, FaMoneyBillWave } from 'react-icons/fa';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

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
    <div className="my-orders-page">
      <h1 className="text-center mb-3">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center" style={{ padding: '4rem' }}>
          <FaBox style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }} />
          <h3>No orders yet</h3>
          <p style={{ color: '#666', marginBottom: '1.5rem' }}>
            You haven't placed any orders yet.
          </p>
          <Link to="/menu" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="grid">
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: 0 }}>Order #{order._id.slice(-6)}</h3>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    {new Date(order.orderPlacedAt).toLocaleDateString()} at {new Date(order.orderPlacedAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                {order.orderItems.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <hr />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {order.paymentStatus === 'paid' ? (
                      <span style={{ color: '#4caf50' }}><FaMoneyBillWave /> Paid</span>
                    ) : (
                      <span style={{ color: '#ff9800' }}><FaClock /> Pending</span>
                    )}
                  </div>
                  <p style={{ fontWeight: 'bold', color: '#ff6b35', fontSize: '1.1rem' }}>
                    Total: ₹{order.grandTotal}
                  </p>
                </div>

                <Link to={`/order/${order._id}`} className="btn btn-outline">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
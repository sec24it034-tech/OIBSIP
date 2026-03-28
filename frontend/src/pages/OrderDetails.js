import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getOrderById } from '../api';
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { io } from 'socket.io-client';

// Connect to socket server
const socket = io('http://localhost:5000');

const OrderDetails = () => {
  const { orderId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(orderId);
        setOrder(response.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Join order room for real-time updates
    socket.emit('join-room', orderId);

    // Listen for order status updates
    socket.on('orderStatusUpdate', (data) => {
      if (data.orderId === orderId) {
        setOrder(prev => ({ ...prev, orderStatus: data.status }));
      }
    });

    return () => {
      socket.off('orderStatusUpdate');
    };
  }, [orderId]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Order Received': return 'status-received';
      case 'In Kitchen': return 'status-kitchen';
      case 'Out for Delivery': return 'status-delivery';
      case 'Delivered': return 'status-delivered';
      default: return '';
    }
  };

  const getStatusStep = (status) => {
    const steps = ['Order Received', 'In Kitchen', 'Out for Delivery', 'Delivered'];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center" style={{ padding: '4rem' }}>
        <h2>Order not found</h2>
        <Link to="/my-orders" className="btn btn-primary mt-3">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <Link to="/my-orders" className="btn btn-outline mb-3">
        <FaArrowLeft style={{ marginRight: '8px' }} />
        Back to My Orders
      </Link>

      <div className="grid grid-2">
        {/* Order Info */}
        <div>
          <div className="card mb-3">
            <h3>Order #{order._id.slice(-6)}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
              <p style={{ color: '#666' }}>
                Placed on: {new Date(order.orderPlacedAt).toLocaleString()}
              </p>
            </div>

            {/* Order Progress */}
            <div style={{ marginTop: '2rem' }}>
              <h4>Order Progress</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                {['Order Received', 'In Kitchen', 'Out for Delivery', 'Delivered'].map((step, index) => (
                  <div key={step} style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: index <= getStatusStep(order.orderStatus) ? '#ff6b35' : '#ddd',
                      color: index <= getStatusStep(order.orderStatus) ? 'white' : '#666',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.5rem',
                      fontSize: '0.8rem'
                    }}>
                      {index + 1}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: index <= getStatusStep(order.orderStatus) ? '#333' : '#666' }}>
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="card mb-3">
            <h3>Order Items</h3>
            {order.orderItems.map((item, index) => (
              <div key={index} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: index < order.orderItems.length - 1 ? '1px solid #eee' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0 }}>{item.name}</h4>
                  <span>₹{item.price * item.quantity}</span>
                </div>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>Quantity: {item.quantity}</p>
                {item.customizations && (
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    {item.customizations.base && <span>Base: {item.customizations.base}, </span>}
                    {item.customizations.sauce && <span>Sauce: {item.customizations.sauce}, </span>}
                    {item.customizations.cheese && <span>Cheese: {item.customizations.cheese}</span>}
                    {item.customizations.toppings?.length > 0 && (
                      <span>, Toppings: {item.customizations.toppings.join(', ')}</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Shipping Info */}
        <div>
          <div className="card mb-3">
            <h3>Payment Details</h3>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <span>₹{order.totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Delivery:</span>
                <span>₹{order.deliveryCharge}</span>
              </div>
              <hr />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                <strong>Total:</strong>
                <strong style={{ color: '#ff6b35', fontSize: '1.2rem' }}>₹{order.grandTotal}</strong>
              </div>
              <div style={{ marginTop: '1rem' }}>
                <p><strong>Payment Method:</strong> {order.paymentMethod === 'online' ? 'Online' : 'Cash on Delivery'}</p>
                <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Shipping Address</h3>
            <div style={{ marginTop: '1rem' }}>
              <p><FaMapMarkerAlt style={{ marginRight: '8px', color: '#ff6b35' }} />
                {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
              </p>
              <p style={{ marginTop: '0.5rem' }}><FaPhone style={{ marginRight: '8px', color: '#ff6b35' }} /> {user?.phone}</p>
              <p><FaEnvelope style={{ marginRight: '8px', color: '#ff6b35' }} /> {user?.email}</p>
            </div>

            {order.notes && (
              <div style={{ marginTop: '1rem' }}>
                <strong>Order Notes:</strong>
                <p>{order.notes}</p>
              </div>
            )}
          </div>

          {order.estimatedDelivery && (
            <div className="card mt-3">
              <h4>Estimated Delivery</h4>
              <p style={{ fontSize: '1.2rem', color: '#ff6b35' }}>
                {new Date(order.estimatedDelivery).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../api';
import { FaCheck, FaPizzaSlice, FaHome } from 'react-icons/fa';

const OrderConfirmation = () => {
  const { orderId } = useParams();
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
  }, [orderId]);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page" style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
      <div className="card">
        <div style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: '#4caf50', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2rem'
        }}>
          <FaCheck />
        </div>

        <h2 style={{ marginBottom: '1rem' }}>Order Placed Successfully!</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Thank you for your order. Your order ID is: <strong>{orderId}</strong>
        </p>

        {order && (
          <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
              <div>
                <strong>Order Status:</strong>
                <p>{order.orderStatus}</p>
              </div>
              <div>
                <strong>Payment Status:</strong>
                <p>{order.paymentStatus}</p>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Total Amount:</strong>
              <p style={{ fontSize: '1.25rem', color: '#ff6b35', fontWeight: 'bold' }}>
                ₹{order.grandTotal}
              </p>
            </div>

            <div>
              <strong>Estimated Delivery:</strong>
              <p>
                {order.estimatedDelivery && new Date(order.estimatedDelivery).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/my-orders" className="btn btn-primary">
            View My Orders
          </Link>
          <Link to="/" className="btn btn-outline">
            <FaHome style={{ marginRight: '5px' }} />
            Back to Home
          </Link>
        </div>
      </div>

      <div className="card mt-3">
        <FaPizzaSlice style={{ fontSize: '3rem', color: '#ff6b35', marginBottom: '1rem' }} />
        <p>Your pizza is being prepared with love!</p>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          We'll notify you when your order status changes. You can also track your order from the "My Orders" page.
        </p>
      </div>
    </div>
  );
};

export default OrderConfirmation;
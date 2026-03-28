import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { createOrder, createRazorpayOrder, verifyPayment } from '../api';
import { clearCart } from '../store/slices/cartSlice';
import { toast } from 'react-toastify';
import { FaCreditCard, FaMoneyBillWave } from 'react-icons/fa';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, totalPrice } = useSelector((state) => state.cart);

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  const [paymentMethod, setPaymentMethod] = useState('online');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const deliveryCharge = 50;
  const grandTotal = totalPrice + deliveryCharge;

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.pincode) {
      toast.error('Please fill in complete shipping address');
      return;
    }

    setLoading(true);

    try {
      // Create order
      const orderData = {
        orderItems: items.map(item => ({
          pizza: item.pizza,
          quantity: item.quantity,
          customizations: item.customizations,
        })),
        shippingAddress,
        paymentMethod,
        notes,
      };

      const orderResponse = await createOrder(orderData);
      const order = orderResponse.data.data;

      if (paymentMethod === 'online') {
        // Create Razorpay order
        const razorpayResponse = await createRazorpayOrder({
          orderId: order._id,
          amount: order.grandTotal,
        });

        const razorpayOrder = razorpayResponse.data.data;

        // Initialize Razorpay checkout
        const options = {
          key: 'your-razorpay-key-id', // In production, fetch this from API
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'Pizza App',
          description: 'Order Payment',
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              // Verify payment
              await verifyPayment({
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: order._id,
              });

              dispatch(clearCart());
              navigate(`/order-confirmation/${order._id}`);
              toast.success('Payment successful!');
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          theme: {
            color: '#ff6b35',
          },
        };

        // Load Razorpay checkout (in production, use Razorpay SDK)
        // For demo, we'll simulate successful payment
        dispatch(clearCart());
        navigate(`/order-confirmation/${order._id}`);
      } else {
        // COD
        dispatch(clearCart());
        navigate(`/order-confirmation/${order._id}`);
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center" style={{ padding: '4rem' }}>
        <h2>Your cart is empty</h2>
        <p>Add some pizzas to your cart first!</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="text-center mb-3">Checkout</h1>

      <div className="grid grid-2">
        {/* Shipping Details */}
        <div>
          <div className="card">
            <h3>Shipping Address</h3>
            
            <div className="form-group">
              <label>Street Address</label>
              <input
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter your street address"
                required
              />
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={shippingAddress.state}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={shippingAddress.pincode}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Pincode"
                required
              />
            </div>

            <div className="form-group">
              <label>Order Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-control"
                placeholder="Any special instructions for your order"
                rows="3"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="card mt-3">
            <h3>Payment Method</h3>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div
                className={`ingredient-option ${paymentMethod === 'online' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('online')}
              >
                <FaCreditCard style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
                <h4>Online Payment</h4>
                <p>Pay via Razorpay</p>
              </div>

              <div
                className={`ingredient-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('cod')}
              >
                <FaMoneyBillWave style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} />
                <h4>Cash on Delivery</h4>
                <p>Pay when you receive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3>Order Summary</h3>
            
            {items.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>₹{totalPrice}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Delivery:</span>
              <span>₹{deliveryCharge}</span>
            </div>

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
              <h3>Total:</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b35' }}>
                ₹{grandTotal}
              </span>
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Place Order - ₹${grandTotal}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
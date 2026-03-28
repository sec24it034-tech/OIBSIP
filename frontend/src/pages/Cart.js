import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { FaTrash, FaPlus, FaMinus, FaShoppingBag } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalItems, totalPrice } = useSelector((state) => state.cart);

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) {
      handleRemove(id);
      return;
    }
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('Cart cleared');
  };

  const deliveryCharge = 50;
  const grandTotal = totalPrice + deliveryCharge;

  if (items.length === 0) {
    return (
      <div className="text-center" style={{ padding: '4rem' }}>
        <FaShoppingBag style={{ fontSize: '4rem', color: '#ccc', marginBottom: '1rem' }} />
        <h2>Your cart is empty</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Looks like you haven't added any pizzas to your cart yet.
        </p>
        <Link to="/menu" className="btn btn-primary">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="text-center mb-3">Your Cart</h1>

      <div className="grid grid-2">
        {/* Cart Items */}
        <div>
          {items.map((item) => (
            <div key={item.id} className="card mb-2" style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
                {item.customizations && (
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    {item.customizations.base && <span>Base: {item.customizations.base}, </span>}
                    {item.customizations.sauce && <span>Sauce: {item.customizations.sauce}, </span>}
                    {item.customizations.cheese && <span>Cheese: {item.customizations.cheese}</span>}
                    {item.customizations.toppings?.length > 0 && (
                      <span>, Toppings: {item.customizations.toppings.join(', ')}</span>
                    )}
                  </div>
                )}
                <p style={{ color: '#ff6b35', fontWeight: 'bold' }}>₹{item.price}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-outline"
                    style={{ padding: '0.25rem 0.5rem' }}
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                  >
                    <FaMinus />
                  </button>
                  <span style={{ minWidth: '30px', textAlign: 'center' }}>{item.quantity}</span>
                  <button 
                    className="btn btn-outline"
                    style={{ padding: '0.25rem 0.5rem' }}
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <FaPlus />
                  </button>
                </div>

                <button 
                  className="btn"
                  style={{ color: '#dc3545', padding: '0.5rem' }}
                  onClick={() => handleRemove(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}

          <button 
            className="btn btn-outline"
            onClick={handleClearCart}
            style={{ marginTop: '1rem' }}
          >
            Clear Cart
          </button>
        </div>

        {/* Cart Summary */}
        <div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Total Items:</span>
                <span>{totalItems}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Subtotal:</span>
                <span>₹{totalPrice}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Delivery Charge:</span>
                <span>₹{deliveryCharge}</span>
              </div>
            </div>

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0' }}>
              <h3>Grand Total:</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b35' }}>
                ₹{grandTotal}
              </span>
            </div>

            <Link to="/checkout" className="btn btn-primary w-100">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
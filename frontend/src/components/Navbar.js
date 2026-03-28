import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaPizzaSlice, FaHome, FaList, FaCog } from 'react-icons/fa';
import { logoutUser } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <FaPizzaSlice style={{ marginRight: '8px' }} />
          Pizza App
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            <FaHome style={{ marginRight: '5px' }} />
            Home
          </Link>
          
          <Link to="/menu" className="navbar-link">
            <FaList style={{ marginRight: '5px' }} />
            Menu
          </Link>

          <Link to="/custom-pizza" className="navbar-link">
            Create Your Pizza
          </Link>

          <Link to="/cart" className="navbar-link" style={{ position: 'relative' }}>
            <FaShoppingCart />
            {totalItems > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ff6b35',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
              }}>
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin" className="navbar-link">
                  <FaCog style={{ marginRight: '5px' }} />
                  Admin
                </Link>
              )}
              
              <Link to="/my-orders" className="navbar-link">
                My Orders
              </Link>
              
              <Link to="/profile" className="navbar-link">
                <FaUser style={{ marginRight: '5px' }} />
                {user?.name}
              </Link>
              
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>
                <FaSignOutAlt />
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
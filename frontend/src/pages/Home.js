import React from 'react';
import { Link } from 'react-router-dom';
import { FaPizzaSlice, FaShoppingCart, FaCog, FaClock, FaStar } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero" style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        color: 'white',
        padding: '4rem 1rem',
        textAlign: 'center',
        borderRadius: '0 0 50px 50px',
        marginBottom: '3rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          <FaPizzaSlice style={{ color: '#ff6b35', marginRight: '15px' }} />
          Welcome to Pizza App
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
          Delicious pizzas made just the way you like them!
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/menu" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            <FaShoppingCart style={{ marginRight: '8px' }} />
            Order Now
          </Link>
          <Link to="/custom-pizza" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
            Create Your Own
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" style={{ padding: '2rem 0' }}>
        <h2 className="text-center" style={{ marginBottom: '2rem' }}>Why Choose Us?</h2>
        <div className="grid grid-4">
          <div className="card text-center">
            <div style={{ fontSize: '3rem', color: '#ff6b35', marginBottom: '1rem' }}>
              <FaPizzaSlice />
            </div>
            <h3>Fresh Ingredients</h3>
            <p>We use only the freshest ingredients for our pizzas.</p>
          </div>
          
          <div className="card text-center">
            <div style={{ fontSize: '3rem', color: '#ff6b35', marginBottom: '1rem' }}>
              <FaCog />
            </div>
            <h3>Customizable</h3>
            <p>Create your perfect pizza with our customization options.</p>
          </div>
          
          <div className="card text-center">
            <div style={{ fontSize: '3rem', color: '#ff6b35', marginBottom: '1rem' }}>
              <FaClock />
            </div>
            <h3>Fast Delivery</h3>
            <p>Get your pizza delivered within 45 minutes.</p>
          </div>
          
          <div className="card text-center">
            <div style={{ fontSize: '3rem', color: '#ff6b35', marginBottom: '1rem' }}>
              <FaStar />
            </div>
            <h3>Best Quality</h3>
            <p> rated by thousands of happy customers.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works" style={{ padding: '3rem 0', backgroundColor: '#f8f9fa', marginTop: '3rem' }}>
        <h2 className="text-center" style={{ marginBottom: '2rem' }}>How It Works</h2>
        <div className="grid grid-3">
          <div className="card text-center">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ff6b35',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              1
            </div>
            <h3>Choose Your Pizza</h3>
            <p>Select from our menu or create your own custom pizza.</p>
          </div>
          
          <div className="card text-center">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ff6b35',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              2
            </div>
            <h3>Place Order</h3>
            <p>Add to cart and checkout with your preferred payment method.</p>
          </div>
          
          <div className="card text-center">
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#ff6b35',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '1.5rem',
              fontWeight: 'bold'
            }}>
              3
            </div>
            <h3>Enjoy!</h3>
            <p>Receive your hot and fresh pizza at your doorstep.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <h2>Ready to Order?</h2>
        <p style={{ marginBottom: '1.5rem' }}>Browse our delicious pizzas and start your order now!</p>
        <Link to="/menu" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
          View Menu
        </Link>
      </section>
    </div>
  );
};

export default Home;
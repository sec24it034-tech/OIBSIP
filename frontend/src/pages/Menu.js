import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPizzas } from '../store/slices/pizzaSlice';
import { addToCart } from '../store/slices/cartSlice';
import { FaShoppingCart, FaLeaf, FaFire } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Menu = () => {
  const dispatch = useDispatch();
  const { pizzas, loading } = useSelector((state) => state.pizza);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(fetchPizzas());
  }, [dispatch]);

  const handleAddToCart = (pizza) => {
    dispatch(addToCart({ pizza, quantity: 1 }));
    toast.success(`${pizza.name} added to cart!`);
  };

  const filteredPizzas = filter === 'all' 
    ? pizzas 
    : pizzas.filter(pizza => pizza.category === filter);

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <h1 className="text-center mb-3">Our Menu</h1>
      
      {/* Filter Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button 
          className={`btn ${filter === 'veg' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('veg')}
        >
          <FaLeaf style={{ marginRight: '5px' }} />
          Veg
        </button>
        <button 
          className={`btn ${filter === 'non-veg' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('non-veg')}
        >
          <FaFire style={{ marginRight: '5px' }} />
          Non-Veg
        </button>
      </div>

      {/* Pizza Grid */}
      {pizzas.length === 0 ? (
        <div className="text-center" style={{ padding: '3rem' }}>
          <h3>No pizzas available</h3>
          <p>Please check back later!</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredPizzas.map((pizza) => (
            <div key={pizza._id} className="pizza-card">
              <div className="pizza-image" style={{
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem',
                color: '#ccc'
              }}>
                🍕
              </div>
              <div className="pizza-info">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{pizza.name}</h3>
                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '10px',
                    fontSize: '0.8rem',
                    backgroundColor: pizza.category === 'veg' ? '#4caf50' : '#f44336',
                    color: 'white'
                  }}>
                    {pizza.category === 'veg' ? <FaLeaf /> : <FaFire />} {pizza.category}
                  </span>
                </div>
                <p style={{ color: '#666', marginBottom: '1rem' }}>{pizza.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="pizza-price">₹{pizza.price}</span>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleAddToCart(pizza)}
                  >
                    <FaShoppingCart style={{ marginRight: '5px' }} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Custom Pizza Link */}
      <div className="text-center" style={{ marginTop: '3rem' }}>
        <h3>Don't see what you like?</h3>
        <p>Create your own custom pizza with your favorite ingredients!</p>
        <Link to="/custom-pizza" className="btn btn-secondary">
          Create Custom Pizza
        </Link>
      </div>
    </div>
  );
};

export default Menu;
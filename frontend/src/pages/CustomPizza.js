import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIngredients } from '../store/slices/pizzaSlice';
import { addToCart } from '../store/slices/cartSlice';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CustomPizza = () => {
  const dispatch = useDispatch();
  const { ingredients, loading } = useSelector((state) => state.pizza);
  
  const [selectedBase, setSelectedBase] = useState(null);
  const [selectedSauce, setSelectedSauce] = useState(null);
  const [selectedCheese, setSelectedCheese] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const handleToppingToggle = (topping) => {
    setSelectedToppings(prev => {
      if (prev.includes(topping.name)) {
        return prev.filter(t => t !== topping.name);
      }
      if (prev.length >= 5) {
        toast.warning('Maximum 5 toppings allowed');
        return prev;
      }
      return [...prev, topping.name];
    });
  };

  const calculatePrice = () => {
    let price = 200; // Base price
    if (selectedBase) price += 20;
    if (selectedSauce) price += 15;
    if (selectedCheese) price += 30;
    price += selectedToppings.length * 25;
    return price;
  };

  const handleAddToCart = () => {
    if (!selectedBase || !selectedSauce || !selectedCheese) {
      toast.error('Please select base, sauce, and cheese');
      return;
    }

    const customizations = {
      base: selectedBase.name,
      sauce: selectedSauce.name,
      cheese: selectedCheese.name,
      toppings: selectedToppings
    };

    dispatch(addToCart({ 
      pizza: null, 
      quantity: 1, 
      customizations 
    }));
    
    toast.success('Custom pizza added to cart!');
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="custom-pizza-page">
      <h1 className="text-center mb-3">Create Your Own Pizza</h1>
      <p className="text-center mb-3" style={{ color: '#666' }}>
        Customize your perfect pizza by selecting your favorite ingredients
      </p>

      <div className="grid grid-2">
        {/* Selection Panel */}
        <div>
          {/* Base Selection */}
          <div className="card mb-3">
            <h3>Select Base <span style={{ color: '#ff6b35' }}>*</span></h3>
            <div className="grid grid-2">
              {ingredients.bases.map(base => (
                <div
                  key={base._id}
                  className={`ingredient-option ${selectedBase?._id === base._id ? 'selected' : ''}`}
                  onClick={() => setSelectedBase(base)}
                >
                  <h4>{base.name}</h4>
                  <p>₹{base.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sauce Selection */}
          <div className="card mb-3">
            <h3>Select Sauce <span style={{ color: '#ff6b35' }}>*</span></h3>
            <div className="grid grid-2">
              {ingredients.sauces.map(sauce => (
                <div
                  key={sauce._id}
                  className={`ingredient-option ${selectedSauce?._id === sauce._id ? 'selected' : ''}`}
                  onClick={() => setSelectedSauce(sauce)}
                >
                  <h4>{sauce.name}</h4>
                  <p>₹{sauce.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cheese Selection */}
          <div className="card mb-3">
            <h3>Select Cheese <span style={{ color: '#ff6b35' }}>*</span></h3>
            <div className="grid grid-2">
              {ingredients.cheeses.map(cheese => (
                <div
                  key={cheese._id}
                  className={`ingredient-option ${selectedCheese?._id === cheese._id ? 'selected' : ''}`}
                  onClick={() => setSelectedCheese(cheese)}
                >
                  <h4>{cheese.name}</h4>
                  <p>₹{cheese.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Toppings Selection */}
          <div className="card mb-3">
            <h3>Select Toppings (max 5)</h3>
            <div className="grid grid-3">
              {ingredients.toppings.map(topping => (
                <div
                  key={topping._id}
                  className={`ingredient-option ${selectedToppings.includes(topping.name) ? 'selected' : ''}`}
                  onClick={() => handleToppingToggle(topping)}
                >
                  <h4>{topping.name}</h4>
                  <p>₹{topping.price}</p>
                  {selectedToppings.includes(topping.name) && (
                    <FaCheck style={{ color: '#4caf50' }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Panel */}
        <div>
          <div className="card" style={{ position: 'sticky', top: '100px' }}>
            <h3>Your Custom Pizza</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Base:</strong>
              <p>{selectedBase ? selectedBase.name : 'Not selected'}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Sauce:</strong>
              <p>{selectedSauce ? selectedSauce.name : 'Not selected'}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Cheese:</strong>
              <p>{selectedCheese ? selectedCheese.name : 'Not selected'}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Toppings:</strong>
              <p>{selectedToppings.length > 0 ? selectedToppings.join(', ') : 'None selected'}</p>
            </div>

            <hr />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Total Price:</h3>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ff6b35' }}>
                ₹{calculatePrice()}
              </span>
            </div>

            <button
              className="btn btn-primary w-100"
              style={{ marginTop: '1.5rem' }}
              onClick={handleAddToCart}
            >
              <FaShoppingCart style={{ marginRight: '8px' }} />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPizza;
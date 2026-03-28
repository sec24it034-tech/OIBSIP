import { createSlice } from '@reduxjs/toolkit';

const getCartFromStorage = () => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

const initialState = {
  items: getCartFromStorage(),
  totalItems: 0,
  totalPrice: 0,
};

// Helper to calculate price
const calculateCustomPrice = (customizations) => {
  let price = 200;
  if (customizations?.base) price += 20;
  if (customizations?.sauce) price += 15;
  if (customizations?.cheese) price += 30;
  if (customizations?.toppings?.length > 0) {
    price += customizations.toppings.length * 25;
  }
  return price;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { pizza, quantity, customizations } = action.payload;
      const price = pizza ? pizza.price : calculateCustomPrice(customizations);
      
      const newItem = {
        id: Date.now().toString(),
        pizza: pizza?._id || null,
        name: pizza ? pizza.name : 'Custom Pizza',
        quantity,
        price,
        customizations: customizations || null,
        image: pizza?.image || null,
      };
      
      state.items.push(newItem);
      localStorage.setItem('cart', JSON.stringify(state.items));
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.items));
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(state.items));
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
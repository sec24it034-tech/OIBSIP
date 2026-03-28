const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a pizza name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  image: {
    type: String
  },
  category: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  },
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  sauce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  cheese: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient',
    required: true
  },
  toppings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient'
  }],
  price: {
    type: Number,
    required: [true, 'Please provide a price']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pizza', pizzaSchema);
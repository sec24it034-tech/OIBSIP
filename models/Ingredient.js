const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide an ingredient name'],
    trim: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['base', 'sauce', 'cheese', 'topping'],
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 100
  },
  unit: {
    type: String,
    default: 'pcs'
  },
  lowStockThreshold: {
    type: Number,
    default: 20
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  image: String,
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
ingredientSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Ingredient', ingredientSchema);
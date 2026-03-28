const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');
const Ingredient = require('../models/Ingredient');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/pizza
// @desc    Get all pizzas
// @access  Public
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find({ isAvailable: true })
      .populate('base', 'name price')
      .populate('sauce', 'name price')
      .populate('cheese', 'name price')
      .populate('toppings', 'name price');

    res.status(200).json({
      success: true,
      count: pizzas.length,
      data: pizzas
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/pizza/:id
// @desc    Get single pizza
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id)
      .populate('base', 'name price')
      .populate('sauce', 'name price')
      .populate('cheese', 'name price')
      .populate('toppings', 'name price');

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pizza
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/pizza/ingredients/bases
// @desc    Get all pizza bases
// @access  Public
router.get('/ingredients/bases', async (req, res) => {
  try {
    const bases = await Ingredient.find({ category: 'base', isAvailable: true });
    res.status(200).json({
      success: true,
      data: bases
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/pizza/ingredients/sauces
// @desc    Get all sauces
// @access  Public
router.get('/ingredients/sauces', async (req, res) => {
  try {
    const sauces = await Ingredient.find({ category: 'sauce', isAvailable: true });
    res.status(200).json({
      success: true,
      data: sauces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/pizza/ingredients/cheeses
// @desc    Get all cheeses
// @access  Public
router.get('/ingredients/cheeses', async (req, res) => {
  try {
    const cheeses = await Ingredient.find({ category: 'cheese', isAvailable: true });
    res.status(200).json({
      success: true,
      data: cheeses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/pizza/ingredients/toppings
// @desc    Get all toppings
// @access  Public
router.get('/ingredients/toppings', async (req, res) => {
  try {
    const toppings = await Ingredient.find({ category: 'topping', isAvailable: true });
    res.status(200).json({
      success: true,
      data: toppings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/pizza/ingredients/all
// @desc    Get all ingredients for customization
// @access  Public
router.get('/ingredients/all', async (req, res) => {
  try {
    const [bases, sauces, cheeses, toppings] = await Promise.all([
      Ingredient.find({ category: 'base', isAvailable: true }),
      Ingredient.find({ category: 'sauce', isAvailable: true }),
      Ingredient.find({ category: 'cheese', isAvailable: true }),
      Ingredient.find({ category: 'topping', isAvailable: true })
    ]);

    res.status(200).json({
      success: true,
      data: {
        bases,
        sauces,
        cheeses,
        toppings
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Admin routes - Create, Update, Delete pizzas
// @route   POST /api/pizza
// @desc    Create a pizza
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const pizza = await Pizza.create(req.body);
    res.status(201).json({
      success: true,
      data: pizza
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/pizza/:id
// @desc    Update a pizza
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza not found'
      });
    }

    res.status(200).json({
      success: true,
      data: pizza
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/pizza/:id
// @desc    Delete a pizza
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);

    if (!pizza) {
      return res.status(404).json({
        success: false,
        message: 'Pizza not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Pizza deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
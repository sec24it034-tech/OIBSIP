const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');
const Order = require('../models/Order');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

// @route   GET /api/admin/ingredients
// @desc    Get all ingredients (inventory)
// @access  Private/Admin
router.get('/ingredients', protect, admin, async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ category: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: ingredients.length,
      data: ingredients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/ingredients/low-stock
// @desc    Get ingredients with low stock
// @access  Private/Admin
router.get('/ingredients/low-stock', protect, admin, async (req, res) => {
  try {
    const ingredients = await Ingredient.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });

    res.status(200).json({
      success: true,
      count: ingredients.length,
      data: ingredients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   POST /api/admin/ingredients
// @desc    Add new ingredient
// @access  Private/Admin
router.post('/ingredients', protect, admin, async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/ingredients/:id
// @desc    Update ingredient
// @access  Private/Admin
router.put('/ingredients/:id', protect, admin, async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient not found'
      });
    }

    // Check for low stock and send email
    if (ingredient.stock <= ingredient.lowStockThreshold) {
      const adminUser = await User.findOne({ role: 'admin' });
      if (adminUser) {
        await sendEmail(
          adminUser.email,
          'Low Stock Alert - Pizza App',
          `Warning: ${ingredient.name} (${ingredient.category}) is running low. Current stock: ${ingredient.stock} ${ingredient.unit}`
        );
      }
    }

    res.status(200).json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/ingredients/:id/stock
// @desc    Update ingredient stock
// @access  Private/Admin
router.put('/ingredients/:id/stock', protect, admin, async (req, res) => {
  try {
    const { stock } = req.body;
    
    const ingredient = await Ingredient.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true }
    );

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ingredient
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   DELETE /api/admin/ingredients/:id
// @desc    Delete ingredient
// @access  Private/Admin
router.delete('/ingredients/:id', protect, admin, async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);

    if (!ingredient) {
      return res.status(404).json({
        success: false,
        message: 'Ingredient not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Ingredient deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    
    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .sort({ orderPlacedAt: -1 })
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/orders/:id
// @desc    Get single order details
// @access  Private/Admin
router.get('/orders/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   PUT /api/admin/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/orders/:id/status', protect, admin, async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    ).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.emit('orderStatusUpdate', {
      orderId: order._id,
      status: orderStatus
    });

    // Send email notification to user
    await sendEmail(
      order.user.email,
      `Order Status Update - ${orderStatus}`,
      `Your order #${order._id} status has been updated to: ${orderStatus}`
    );

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Order Received' });
    const inKitchenOrders = await Order.countDocuments({ orderStatus: 'In Kitchen' });
    const outForDeliveryOrders = await Order.countDocuments({ orderStatus: 'Out for Delivery' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$grandTotal' } } }
    ]);

    const lowStockItems = await Ingredient.countDocuments({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] }
    });

    const recentOrders = await Order.find()
      .sort({ orderPlacedAt: -1 })
      .limit(10)
      .populate('user', 'name');

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        inKitchenOrders,
        outForDeliveryOrders,
        deliveredOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        lowStockItems,
        recentOrders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
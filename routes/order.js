const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Pizza = require('../models/Pizza');
const Ingredient = require('../models/Ingredient');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');

// @route   POST /api/order
// @desc    Create new order
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, notes } = req.body;

    // Calculate totals
    let totalPrice = 0;
    const orderItemsWithDetails = [];

    for (const item of orderItems) {
      let pizza;
      
      if (item.pizza) {
        // Pre-defined pizza
        pizza = await Pizza.findById(item.pizza);
        if (!pizza) {
          return res.status(404).json({
            success: false,
            message: `Pizza not found: ${item.pizza}`
          });
        }
      }

      const itemPrice = pizza ? pizza.price : calculateCustomPrice(item.customizations);
      totalPrice += itemPrice * item.quantity;

      orderItemsWithDetails.push({
        pizza: pizza ? pizza._id : null,
        name: pizza ? pizza.name : 'Custom Pizza',
        quantity: item.quantity,
        price: itemPrice,
        customizations: item.customizations || null
      });
    }

    const deliveryCharge = 50;
    const grandTotal = totalPrice + deliveryCharge;

    // Calculate estimated delivery time (45 minutes from now)
    const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000);

    const order = await Order.create({
      user: req.user.id,
      orderItems: orderItemsWithDetails,
      shippingAddress,
      paymentMethod,
      totalPrice,
      deliveryCharge,
      grandTotal,
      estimatedDelivery,
      notes,
      orderStatus: 'Order Received'
    });

    // Update ingredient stock
    await updateIngredientStock(orderItems);

    res.status(201).json({
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

// Helper function to calculate custom pizza price
function calculateCustomPrice(customizations) {
  let price = 200; // Base price
  
  if (customizations.base) price += 20;
  if (customizations.sauce) price += 15;
  if (customizations.cheese) price += 30;
  if (customizations.toppings && customizations.toppings.length > 0) {
    price += customizations.toppings.length * 25;
  }
  
  return price;
}

// Helper function to update ingredient stock after order
async function updateIngredientStock(orderItems) {
  for (const item of orderItems) {
    if (item.customizations) {
      const { base, sauce, cheese, toppings } = item.customizations;
      const quantity = item.quantity || 1;

      if (base) {
        await Ingredient.findOneAndUpdate(
          { name: base, category: 'base' },
          { $inc: { stock: -quantity } }
        );
      }
      
      if (sauce) {
        await Ingredient.findOneAndUpdate(
          { name: sauce, category: 'sauce' },
          { $inc: { stock: -quantity } }
        );
      }
      
      if (cheese) {
        await Ingredient.findOneAndUpdate(
          { name: cheese, category: 'cheese' },
          { $inc: { stock: -quantity } }
        );
      }

      if (toppings && toppings.length > 0) {
        for (const topping of toppings) {
          await Ingredient.findOneAndUpdate(
            { name: topping, category: 'topping' },
            { $inc: { stock: -quantity } }
          );
        }
      }
    }
  }
}

// @route   GET /api/order/myorders
// @desc    Get current user's orders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
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

// @route   GET /api/order/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
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

// @route   PUT /api/order/:id/status
// @desc    Update order status (Admin only)
// @access  Private/Admin
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.orderStatus = orderStatus;
    
    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    // Emit socket event for real-time updates
    const io = req.app.get('io');
    io.emit('orderStatusUpdate', {
      orderId: order._id,
      status: orderStatus
    });

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

// @route   PUT /api/order/:id/payment
// @desc    Update payment status after successful payment
// @access  Private
router.put('/:id/payment', protect, async (req, res) => {
  try {
    const { razorpayPaymentId, razorpayOrderId } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = 'paid';
    order.paymentId = razorpayPaymentId;
    order.razorpayOrderId = razorpayOrderId;

    await order.save();

    // Send confirmation email
    const user = req.user;
    await sendEmail(
      user.email,
      'Order Confirmed - Pizza App',
      `Your order #${order._id} has been confirmed. Total: ₹${order.grandTotal}`
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

module.exports = router;
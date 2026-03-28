const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order for payment
// @access  Private
router.post('/create-order', protect, async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    // Verify the order belongs to the user
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderId.toString(),
      notes: {
        orderId: orderId.toString(),
        userId: req.user.id.toString()
      }
    });

    // Save Razorpay order ID to our order
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency
      }
    });
  } catch (error) {
    console.error('Razorpay error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initialization failed'
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify payment signature
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Update order payment status
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.paymentStatus = 'paid';
    order.paymentId = razorpayPaymentId;
    order.razorpayOrderId = razorpayOrderId;
    order.orderStatus = 'Order Received';
    
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// @route   GET /api/payment/key
// @desc    Get Razorpay key
// @access  Public
router.get('/key', (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID
  });
});

module.exports = router;
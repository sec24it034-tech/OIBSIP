const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [{
    pizza: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza'
    },
    name: String,
    quantity: Number,
    price: Number,
    customizations: {
      base: String,
      sauce: String,
      cheese: String,
      toppings: [String]
    }
  }],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'online'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentId: String,
  razorpayOrderId: String,
  orderStatus: {
    type: String,
    enum: ['Order Received', 'In Kitchen', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Order Received'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  deliveryCharge: {
    type: Number,
    default: 50
  },
  grandTotal: {
    type: Number,
    required: true
  },
  orderPlacedAt: {
    type: Date,
    default: Date.now
  },
  estimatedDelivery: Date,
  notes: String
});

module.exports = mongoose.model('Order', orderSchema);
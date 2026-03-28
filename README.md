 HEAD
# Pizza Delivery Application

A full-stack Pizza Delivery Application built with modern web technologies.

## Features

### User Features
- User registration and login with JWT authentication
- Email verification and password recovery
- Browse pizza menu (Veg and Non-Veg categories)
- Custom pizza builder with multiple options:
  - Base selection
  - Sauce selection
  - Cheese selection
  - Toppings (up to 5)
- Shopping cart functionality
- Checkout with online payment (Razorpay test mode) or COD
- Order tracking with real-time status updates
- Order history and details view

### Admin Features
- Admin dashboard with statistics
- Order management (view and update status)
- Inventory management (add, edit, delete ingredients)
- Low stock alerts
- Real-time order status updates via Socket.io

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for real-time updates
- Razorpay for payment integration

### Frontend
- React.js
- Redux Toolkit for state management
- React Router for navigation
- React Toastify for notifications
- Socket.io-client for real-time updates

## Project Structure

```
pizza-app/
├── server.js                 # Express server entry point
├── package.json              # Backend dependencies
├── .env                      # Environment variables
├── models/                   # MongoDB models
│   ├── User.js
│   ├── Pizza.js
│   ├── Order.js
│   └── Ingredient.js
├── routes/                   # API routes
│   ├── auth.js
│   ├── user.js
│   ├── pizza.js
│   ├── order.js
│   ├── admin.js
│   └── payment.js
├── middleware/               # Custom middleware
│   └── auth.js
├── utils/                    # Utility functions
│   └── email.js
└── frontend/                 # React frontend
    ├── package.json
    ├── public/
    └── src/
        ├── components/
        ├── pages/
        ├── store/
        └── api/
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd pizza-app
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pizza-app
JWT_SECRET=your-secret-key
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-email-password
EMAIL_FROM=your-email@gmail.com
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
FRONTEND_URL=http://localhost:3000
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Creating Admin User

To create an admin user, you can directly update a user's role in the database or create a seed script. The admin role grants access to the admin dashboard and inventory management.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgotpassword` - Request password reset
- `PUT /api/auth/resetpassword/:resettoken` - Reset password

### Pizza
- `GET /api/pizza` - Get all available pizzas
- `GET /api/pizza/:id` - Get single pizza details
- `GET /api/pizza/ingredients/all` - Get all ingredients for customization

### Order
- `POST /api/order` - Create new order
- `GET /api/order/myorders` - Get user's orders
- `GET /api/order/:id` - Get order details

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/ingredients` - Get all ingredients
- `POST /api/admin/ingredients` - Add new ingredient
- `PUT /api/admin/ingredients/:id` - Update ingredient
- `DELETE /api/admin/ingredients/:id` - Delete ingredient

## License

MIT License

# OIBSIP Internship

## Task 1 - Landing Page

This is a responsive landing page created using HTML and CSS.

### Features:
- Modern UI Design
- Responsive Layout
- Hover Effects
- Clean Structure

### Author:
Aruna T
 84cf4a8aea2c9a49902fe46c10185c7c2844ac76

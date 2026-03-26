// Login Authentication System - JavaScript

// Storage keys
const USERS_KEY = 'auth_users';
const CURRENT_USER_KEY = 'current_user';

// DOM Elements
const tabButtons = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');
const dashboard = document.getElementById('dashboard');
const formContainer = document.querySelector('.form-container');
const logoutBtn = document.getElementById('logout-btn');

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    checkExistingSession();
    setupTabNavigation();
    setupFormHandlers();
});

// Check if user is already logged in
function checkExistingSession() {
    const currentUser = getFromStorage(CURRENT_USER_KEY);
    if (currentUser) {
        showDashboard(currentUser);
    }
}

// Tab Navigation
function setupTabNavigation() {
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tabName}-form`) {
                    form.classList.add('active');
                }
            });
            
            // Clear any error messages
            clearErrors();
        });
    });
}

// Form Handlers
function setupFormHandlers() {
    // Login Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin();
    });

    // Register Form Submit
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleRegistration();
    });

    // Logout Button
    logoutBtn.addEventListener('click', handleLogout);
}

// Handle Login
function handleLogin() {
    clearErrors();
    
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    // Validation
    if (!username || !password) {
        showError(loginError, 'Please fill in all fields');
        return;
    }

    // Get users from storage
    const users = getFromStorage(USERS_KEY) || [];
    
    // Find matching user
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // Store current user session
        saveToStorage(CURRENT_USER_KEY, user);
        showDashboard(user);
    } else {
        showError(loginError, 'Invalid username or password');
    }
}

// Handle Registration
function handleRegistration() {
    clearErrors();
    
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm = document.getElementById('register-confirm').value;

    // Validation
    if (!username || !email || !password || !confirm) {
        showError(registerError, 'Please fill in all fields');
        return;
    }

    // Username validation
    if (username.length < 3) {
        showError(registerError, 'Username must be at least 3 characters');
        return;
    }

    // Email validation
    if (!isValidEmail(email)) {
        showError(registerError, 'Please enter a valid email address');
        return;
    }

    // Password validation
    if (password.length < 6) {
        showError(registerError, 'Password must be at least 6 characters');
        return;
    }

    // Confirm password
    if (password !== confirm) {
        showError(registerError, 'Passwords do not match');
        return;
    }

    // Get existing users
    const users = getFromStorage(USERS_KEY) || [];

    // Check if username already exists
    if (users.some(u => u.username === username)) {
        showError(registerError, 'Username already exists');
        return;
    }

    // Check if email already exists
    if (users.some(u => u.email === email)) {
        showError(registerError, 'Email already registered');
        return;
    }

    // Create new user
    const newUser = {
        username,
        email,
        password,
        memberSince: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };

    // Save user
    users.push(newUser);
    saveToStorage(USERS_KEY, users);

    // Auto login after registration
    saveToStorage(CURRENT_USER_KEY, newUser);
    showDashboard(newUser);
}

// Handle Logout
function handleLogout() {
    // Remove current user from storage
    localStorage.removeItem(CURRENT_USER_KEY);
    
    // Show login form
    dashboard.classList.add('hidden');
    formContainer.classList.remove('hidden');
    
    // Reset forms
    loginForm.reset();
    registerForm.reset();
    
    // Switch to login tab
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === 'login') {
            btn.classList.add('active');
        }
    });
    
    authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === 'login-form') {
            form.classList.add('active');
        }
    });
}

// Show Dashboard
function showDashboard(user) {
    // Hide form container
    formContainer.classList.add('hidden');
    
    // Update dashboard content
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('dashboard-username').textContent = user.username;
    document.getElementById('dashboard-email').textContent = user.email;
    document.getElementById('member-since').textContent = user.memberSince || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Show dashboard
    dashboard.classList.remove('hidden');
}

// Utility Functions
function getFromStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (e) {
        return null;
    }
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(element, message) {
    element.textContent = message;
    element.classList.add('show');
}

function clearErrors() {
    loginError.classList.remove('show');
    registerError.classList.remove('show');
    loginError.textContent = '';
    registerError.textContent = '';
}

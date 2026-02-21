const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Signup GET
router.get('/signup', (req, res) => {
    res.render('users/signup');
});

// Signup POST
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        req.flash('error', 'All fields are required');
        return res.redirect('/signup');
    }

    if (password.length < 6) {
        req.flash('error', 'Password must be at least 6 characters long');
        return res.redirect('/signup');
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already exists');
            return res.redirect('/signup');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        req.flash('success', 'Account created successfully. Please log in.');
        res.redirect('/login');
    } catch (error) {
        req.flash('error', 'An error occurred during signup');
        res.redirect('/signup');
    }
});

// Login GET
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Login POST
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        req.flash('error', 'Email and password are required');
        return res.redirect('/login');
    }

    try {
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Set session
        req.session.userId = user._id;
        req.flash('success', 'Logged in successfully');
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'An error occurred during login');
        res.redirect('/login');
    }
});

// Logout POST
router.post('/logout', (req, res) => {
    console.log('POST /logout called, session:', req.session ? req.session.userId : null);
    req.session.destroy((err) => {
        if (err) {
            req.flash('error', 'Error logging out');
            return res.redirect('/');
        }
        req.flash('success', 'Logged out successfully');
        res.redirect('/');
    });
});

// Logout GET (convenience/fallback) -- mirrors POST
router.get('/logout', (req, res) => {
    console.log('GET /logout called, session:', req.session ? req.session.userId : null);
    req.session.destroy((err) => {
        if (err) {
            req.flash('error', 'Error logging out');
            return res.redirect('/');
        }
        req.flash('success', 'Logged out successfully');
        res.redirect('/');
    });
});

// Profile GET
router.get('/profile', async (req, res) => {
    if (!req.session || !req.session.userId) {
        req.flash('error', 'You must be logged in to view your profile');
        return res.redirect('/login');
    }
    try {
        const user = await User.findById(req.session.userId).select('name email');
        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/');
        }
        res.render('users/profile', { user });
    } catch (err) {
        req.flash('error', 'Could not load profile');
        res.redirect('/');
    }
});

module.exports = router;
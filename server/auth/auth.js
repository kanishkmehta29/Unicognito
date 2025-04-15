const express = require("express");
const router = require("express-promise-router")();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

// Sign up route
router.post("/signup", async function (req, res) {
  try {
    const { name, email, password } = req.body;
    
    // Enhanced validation for required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user with required and default fields
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      description: " ",
      profilePic: "",
      rating: 0,
      discussions: [],
      courses: [],
      projects: [],
      posts: [],
      connections: [],
      favPosts: [],
      views: 0,
      portfolio: []
    });
    
    // Save user
    const savedUser = await newUser.save();
    
    // Generate token
    const token = jwt.sign(
      { isowner: true, id: savedUser.email },
      process.env.JWT_SEC,
      { expiresIn: '7d' } // Optional: Adding token expiration
    );
    
    // Set cookie and send response
    res.cookie("token", token, { 
      httpOnly: true, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.status(201).json({ 
      user: savedUser._id, 
      token,
      message: "User created successfully"
    });
    
  } catch (error) {
    console.log("Signup error:", error);
    
    // Improved error response
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login route
router.post("/login", async function (req, res) {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    // Check if user.password exists before comparing
    if (!user.password) {
      console.error("User has no password stored:", email);
      return res.status(500).json({ message: "Authentication error" });
    }
    
    // Compare passwords
    try {
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Authentication successful
      const token = jwt.sign(
        { isowner: true, id: user.email },
        process.env.JWT_SEC,
        { expiresIn: '7d' }
      );
      
      // Set cookie and send response
      res.cookie("token", token, { 
        httpOnly: true, 
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(200).json({ 
        user: user._id, 
        token,
        message: "Login successful"
      });
    } catch (bcryptError) {
      console.error("bcrypt comparison error:", bcryptError);
      return res.status(500).json({ message: "Authentication error" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Sign out route
router.get("/signout", async function (req, res) {
  try {
    // Clear the authentication cookie
    res.clearCookie("token", { 
      httpOnly: true, 
      sameSite: "strict",
      path: "/"
    });
    
    // Send success response
    res.status(200).json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Check authenticated user
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token || (req.headers.authorization || '').replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SEC);
    
    // Find user 
    const user = await User.findOne({ email: decoded.id })
      .select('-password'); // Don't send password
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Return user details
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    
    console.error("Auth check error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
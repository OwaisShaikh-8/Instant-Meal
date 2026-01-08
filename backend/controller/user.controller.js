import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import createTokenAndSaveCookie from "../jwt/generateToken.js";

// ===================================
// 📝 REGISTER CUSTOMER
// ===================================
export const registerCustomer = async (req, res) => {
    console.log("customer register hit");
    
  const { fullname, email, password, confirmPassword } = req.body;

  try {
    // ✅ Validate required fields
    if (!fullname || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        error: "All fields are required" 
      });
    }

    // ✅ Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        error: "Passwords do not match" 
      });
    }

    // ✅ Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters" 
      });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Invalid email format" 
      });
    }

    // ✅ Check if user already exists (use 409 Conflict status)
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        error: "Email already registered" 
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new user
    const newUser = new User({
      fullname: fullname.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "customer",
    });

    await newUser.save();

    // ✅ Generate token and set cookie
    const token = createTokenAndSaveCookie(newUser._id, res);

    // ✅ Return user data WITHOUT password
    res.status(201).json({
      message: "Customer registered successfully",
      token,
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
      },
    });

  } catch (error) {
    console.error("Register Customer Error:", error);
    
    // ✅ Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        error: Object.values(error.errors).map(e => e.message).join(", ")
      });
    }

    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
};

// ===================================
// 🏢 REGISTER VENDOR
// ===================================
export const registerVendor = async (req, res) => {
  const { fullname, email, password, confirmPassword, companyName } = req.body;

  try {
    // ✅ Validate required fields
    if (!fullname || !email || !password || !confirmPassword || !companyName) {
      return res.status(400).json({ 
        error: "All fields are required" 
      });
    }

    // ✅ Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        error: "Passwords do not match" 
      });
    }

    // ✅ Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        error: "Password must be at least 6 characters" 
      });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Invalid email format" 
      });
    }

    // ✅ Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ 
        error: "Email already registered" 
      });
    }

    // ✅ Check if company name already exists
    const existingCompany = await User.findOne({ 
      companyName: companyName.trim(),
      role: "vendor" 
    });
    if (existingCompany) {
      return res.status(409).json({ 
        error: "Company name already registered" 
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create new vendor
    const newUser = new User({
      fullname: fullname.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "vendor",
      companyName: companyName.trim(),
    });

    await newUser.save();

    // ✅ Generate token and set cookie
    const token = createTokenAndSaveCookie(newUser._id, res);

    // ✅ Return user data WITHOUT password
    res.status(201).json({
      message: "Vendor registered successfully",
      token,
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        role: newUser.role,
        companyName: newUser.companyName,
      },
    });

  } catch (error) {
    console.error("Register Vendor Error:", error);
    
    // ✅ Handle mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ 
        error: Object.values(error.errors).map(e => e.message).join(", ")
      });
    }

    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
};

// ===================================
// 🔐 LOGIN
// ===================================
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        error: "Email and password are required" 
      });
    }

    // ✅ Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });

    // ✅ Check if user exists BEFORE comparing password
    if (!user) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ 
        error: "Invalid credentials" 
      });
    }

    // ✅ Generate token and set cookie
    const token = createTokenAndSaveCookie(user._id, res);

    // ✅ Return success with user data (NO password!)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        ...(user.companyName && { companyName: user.companyName }),
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
};

// ===================================
// 🚪 LOGOUT
// ===================================
export const logout = (req, res) => {
  try {
    // ✅ Clear JWT cookie with proper options
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ 
      message: "Logout successful" 
    });

  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({ 
      error: "Internal server error" 
    });
  }
};

// ===================================
// 👥 GET ALL USERS (Admin only)
// ===================================
export const allUsers = async (req, res) => {
  try {
    // ✅ Fetch all users WITHOUT passwords
    const users = await User.find().select("-password");

    // ✅ Return users with metadata
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });

  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
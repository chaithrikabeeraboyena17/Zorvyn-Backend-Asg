const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            message: "Users fetched successfully",
            users
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
};

// create user
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email, and password are required"
            });
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email"
            });
        }

        // strictly check if role is admin - REJECT IMMEDIATELY
        if (role && role === "admin") {
            console.warn("Attempt to create admin user via API - rejected");
            return res.status(401).json({
                message: "Unauthorized - Admin users can only be created directly in MongoDB Atlas"
            });
        }

        // only allow viewer and analyst roles
        let assignedRole = "viewer";
        if (role) {
            if (role !== "viewer" && role !== "analyst") {
                return res.status(400).json({
                    message: "Invalid role. Only viewer and analyst are allowed"
                });
            }
            assignedRole = role;
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: assignedRole
        });

        await user.save();

        res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
};

// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // create token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Login error",
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    loginUser
};
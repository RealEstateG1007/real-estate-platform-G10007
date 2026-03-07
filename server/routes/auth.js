const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ActivityLog = require('../models/ActivityLog');

// Register
router.post('/register', async (req, res) => {
    try {
        // Limit Admins to 3
        if (req.body.role === 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount >= 3) {
                return res.status(403).json("You don't have access. You cannot register as an admin.");
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || 'buyer'
        });

        const user = await newUser.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secretkey", // In production use .env
            { expiresIn: "5d" }
        );

        const { password, ...others } = user._doc;

        // Log Registration Action
        await ActivityLog.create({
            user: user._id,
            action: 'User Registered',
            details: `New account created: ${user.username} (${user.role})`
        });

        res.status(200).json({ ...others, token });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).json("User not found!");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json("Wrong credentials!");

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "secretkey", // In production use .env
            { expiresIn: "5d" }
        );

        const { password, ...others } = user._doc;

        // Log Login Action
        await ActivityLog.create({
            user: user._id,
            action: 'User Logged In',
            details: `Successful login by: ${user.username}`
        });

        res.status(200).json({ ...others, token });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;

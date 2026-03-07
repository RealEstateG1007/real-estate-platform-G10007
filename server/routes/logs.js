const router = require('express').Router();
const ActivityLog = require('../models/ActivityLog');
const verify = require('./verifyToken');

// Get All Logs (Admin Only)
router.get('/', verify, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json("You are not authorized to view logs.");
        }

        const logs = await ActivityLog.find()
            .populate('user', 'username email role')
            .sort({ createdAt: -1 });

        res.status(200).json(logs);
    } catch (err) {
        console.error("Fetch Logs Error:", err);
        res.status(500).json(err);
    }
});

module.exports = router;

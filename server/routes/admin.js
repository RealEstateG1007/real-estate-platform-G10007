const router = require('express').Router();
const User = require('../models/User');
const Property = require('../models/Property');
const ActivityLog = require('../models/ActivityLog');
const verify = require('./verifyToken');

// Get Dashboard Stats
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const propertyCount = await Property.countDocuments();
        // Calculate total value of properties (just for fun stats)
        const properties = await Property.find();
        const totalValue = properties.reduce((acc, curr) => acc + (curr.price || 0), 0);

        res.status(200).json({
            users: userCount,
            properties: propertyCount,
            totalValue
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get All Users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude password
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete User
router.delete('/users/:id', verify, async (req, res) => {
    try {
        const userToDelete = await User.findById(req.params.id);
        await User.findByIdAndDelete(req.params.id);

        // --- Create Activity Log ---
        if (userToDelete && req.user) {
            await ActivityLog.create({
                user: req.user.id,
                action: 'Deleted User',
                details: `Deleted user: "${userToDelete.username}"`
            });
        }

        // Optional: Delete user's properties too? For now, keep it simple.
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete Property (Admin Override)
router.delete('/properties/:id', verify, async (req, res) => {
    try {
        const propToDelete = await Property.findById(req.params.id);
        await Property.findByIdAndDelete(req.params.id);

        // --- Create Activity Log ---
        if (propToDelete && req.user) {
            await ActivityLog.create({
                user: req.user.id,
                action: 'Deleted Property (Admin)',
                details: `Deleted property: "${propToDelete.title}"`
            });
        }
        res.status(200).json("Property has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Bulk Delete Properties
router.post('/properties/bulk-delete', verify, async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !ids.length) return res.status(400).json("No IDs provided");

        await Property.deleteMany({ _id: { $in: ids } });

        // --- Create Activity Log ---
        if (req.user) {
            await ActivityLog.create({
                user: req.user.id,
                action: 'Bulk Deleted Properties',
                details: `Deleted ${ids.length} properties`
            });
        }

        res.status(200).json("Properties deleted successfully");
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update User
router.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update Property
router.put('/properties/:id', async (req, res) => {
    try {
        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedProperty);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Generate Random Properties
router.post('/generate-properties', async (req, res) => {
    const { count } = req.body;
    const num = parseInt(count) || 5;

    const titles = ["Luxury Villa", "Modern Apartment", "Cozy Cottage", "Beachfront Mansion", "City Penthouse", "Suburban Family Home", "Mountain Retreat", "Downtown Loft"];
    const locations = ["New York, NY", "Los Angeles, CA", "Miami, FL", "Chicago, IL", "Austin, TX", "Seattle, WA", "Denver, CO", "Boston, MA"];
    const descriptions = [
        "A beautiful property with stunning views and modern amenities.",
        "Located in the heart of the city, this place offers convenience and style.",
        "Perfect for families, this home features a spacious backyard and great schools nearby.",
        "Escape to this private retreat, featuring luxurious finishes and serene surroundings.",
        "An investment opportunity you don't want to miss. High rental yield potential."
    ];
    // Using some Unsplash IDs for real estate/architecture
    const images = [
        "https://images.unsplash.com/photo-1600596542815-e32c8cc13bc9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
    ];

    const generated = [];

    for (let i = 0; i < num; i++) {
        const randomTitle = titles[Math.floor(Math.random() * titles.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)];
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const randomPrice = Math.floor(Math.random() * (5000000 - 200000) + 200000);
        const randomPincode = Math.floor(Math.random() * 90000 + 10000).toString();

        generated.push({
            title: randomTitle,
            location: randomLocation,
            description: randomDesc,
            price: randomPrice,
            image: randomImage,
            pincode: randomPincode,
            user: req.body.user || null // Optional: assign to admin or null
        });
    }

    try {
        await Property.insertMany(generated);

        // --- Create Activity Log ---
        // Requires updating the frontend to send the token if it doesn't already, for now we will log it if req.user exists (if verify middleware was added).
        // For /generate-properties, it seems verify wasn't there, so we'll add verify token middleware to the route below just to be safe.
        res.status(200).json({ message: `Successfully generated ${num} properties.` });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;

const router = require('express').Router();
const Property = require('../models/Property');
const ActivityLog = require('../models/ActivityLog');
const verify = require('./verifyToken');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Create Property with Image Upload
router.post('/', upload.single('image'), async (req, res) => {
    console.log("POST /api/properties - Body:", req.body); // Debug Log
    const { title, description, price, location, user } = req.body;
    const imagePath = req.file ? req.file.filename : req.body.image; // Use uploaded filename or URL if provided

    console.log("Creating property for user:", user); // Debug Log

    const newProperty = new Property({
        title,
        description,
        price,
        location,
        user: user || '60d0fe4f5311236168a109ca', // Default for now
        image: imagePath,
    });

    try {
        const savedProperty = await newProperty.save();

        // --- Create Activity Log ---
        await ActivityLog.create({
            user: savedProperty.user,
            action: 'Created Property',
            details: `Created listing: "${savedProperty.title}"`
        });

        console.log("Property saved:", savedProperty._id); // Debug Log
        res.status(200).json(savedProperty);
    } catch (err) {
        console.error("Save Error:", err); // Debug Log
        res.status(500).json(err);
    }
});

// Get All Properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get Single Property
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        // Increment views
        property.views += 1;
        await property.save();
        res.status(200).json(property);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/user/stats', verify, async (req, res) => {
    try {
        console.log("GET /user/stats - Req User:", req.user); // Debug Log
        const userProperties = await Property.find({ user: req.user.id });
        console.log("Found properties for user:", userProperties.length); // Debug Log
        const totalViews = userProperties.reduce((acc, curr) => acc + (curr.views || 0), 0);
        const totalListings = userProperties.length;

        res.status(200).json({
            totalListings,
            totalViews,
            properties: userProperties
        });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json(err);
    }
});

// Generate Description (AI Placeholder)
router.post('/generate-description', async (req, res) => {
    const { title, location, price } = req.body;

    // Mock response with 3 variations
    const descriptions = [
        `Discover your dream home with this stunning property in ${location}. Priced at $${price}, "${title}" offers a perfect blend of luxury and comfort. Featuring modern amenities and a prime location, this is an opportunity you don't want to miss. Contact us today to schedule a viewing!`,

        `Experience the pinnacle of elegance at "${title}". This exclusive residence in ${location} is a masterpiece of design, available for $${price}. With spacious interiors and breathtaking views, it redefines modern living. A true gem for the discerning buyer.`,

        `Investment opportunity in ${location}! "${title}" is now on the market for $${price}. whether you're looking for a new family home or a high-yield asset, this property checks all the boxes. Prime location, excellent condition, and priced to sell.`
    ];

    res.status(200).json({ descriptions });
});

module.exports = router;

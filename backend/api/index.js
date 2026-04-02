// Vercel serverless function entry point

const app = require('../app');

const mongoose = require('mongoose');

const { notFound, errorHandler } = require('../middlewares/errorMiddleware');

// Mount error handlers
app.use(notFound);
app.use(errorHandler);

// Serverless handler for Vercel
module.exports = async (req, res) => {
    // Connect if not already connected (avoid cold start connection exhaustion)
    if (mongoose.connection.readyState !== 1) {
        try {
            // Establish a new connection to the database
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('[(Serverless)] MongoDB Connected via Vercel');
        } catch (error) {
            // If connection fails, immediately return an error back to the user
            console.error(`[(Serverless Error)] MongoDB Connection Failed: ${error.message}`);
            return res.status(500).json({ message: 'Database Connection Error. Please try again later.' });
        }
    }
    
    // Hand over the request to the populated Express app for standard routing
    return app(req, res);
};

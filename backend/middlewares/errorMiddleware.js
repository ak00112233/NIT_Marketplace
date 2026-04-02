// Catch 404 errors
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Global error handler: catches all errors and returns JSON (hides stack traces in production)
const errorHandler = (err, req, res, next) => {
    console.error('[(ErrorHandler Middleware)]', err.message);

    // Handle Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message).join(', ');
        return res.status(400).json({ message: `Validation Error: ${messages}` });
    }

    // Handle invalid Mongoose Object IDs
    if (err.name === 'CastError') {
        return res.status(400).json({ message: `Invalid reference provided for ${err.path}: ${err.value}` });
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message || 'An unexpected server error occurred.',
        // Only include stack trace in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { notFound, errorHandler };

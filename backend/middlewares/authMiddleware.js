const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const adminRepository = require('../repositories/adminRepository');

// Resolve user from users or admins collection
const resolveUser = async (id) => {
    const user = await userRepository.findById(id);
    if (user) return user;
    const adminUser = await adminRepository.findById(id);
    if (adminUser) {
        // Attach role field for admin
        const adminObj = adminUser.toObject ? adminUser.toObject() : { ...adminUser };
        adminObj.role = 'admin';
        return adminObj;
    }
    return null;
};

// Verify JWT token and attach user to req.user (without password)
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            const user = await resolveUser(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found', redirect: '/auth' });
            }

            const userObj = user.toObject ? user.toObject() : user;
            const { password, ...userWithoutPassword } = userObj;
            req.user = userWithoutPassword;

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed', redirect: '/auth' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token', redirect: '/auth' });
    }
};

// Require admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

// Optional authentication: attach user if valid token exists, otherwise continue
const optionalAuth = async (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
            const user = await resolveUser(decoded.id);
            if (user) {
                const userObj = user.toObject ? user.toObject() : user;
                const { password, ...userWithoutPassword } = userObj;
                req.user = userWithoutPassword;
            }
        } catch (error) {
            // Ignore token errors for optional auth
        }
    }
    next();
};

module.exports = { protect, admin, optionalAuth };

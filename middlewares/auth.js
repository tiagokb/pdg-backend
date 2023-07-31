const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

// Middleware to verify JWT token
exports.verifyToken = (req, res, next) => {
    
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(authorization, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }

        // Attach the user ID to the request for further use
        req.userId = decoded.userId;
        next();
    });
};

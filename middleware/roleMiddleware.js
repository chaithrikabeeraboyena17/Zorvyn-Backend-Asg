const User = require("../models/User");

// role check middleware
const authorizeRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }

            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (!allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    message: "Access denied: insufficient permissions"
                });
            }

            next(); // allow request

        } catch (error) {
            res.status(500).json({
                message: "Authorization error",
                error: error.message
            });
        }
    };
};

module.exports = authorizeRoles;
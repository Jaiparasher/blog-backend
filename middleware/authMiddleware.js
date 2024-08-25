
const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
    try {
        const accessToken = req.header("Authorization")?.replace("Bearer ", "");
  
        if (!accessToken) {
            throw new ApiError(401, "Unauthorized request");
        }
    
        const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
    
        const user = await User.findById(decodedToken?.id).select(" -password");
        
        if (!user) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

module.exports = { protect };

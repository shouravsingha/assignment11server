import User from '../models/User.js';

const verifyAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only area.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default verifyAdmin;

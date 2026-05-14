import User from '../models/User.js';

const userController = {}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

userController.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

userController.getUserProfile = async (req, res) => {
    try {
        console.log('Getting user profile for Firebase UID:', req.user.uid);

        const user = await User.findOne({ firebaseUid: req.user.uid });

        if (!user) {
            console.error('User not found with Firebase UID:', req.user.uid);
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodGroup: user.bloodGroup,
                avatar: user.avatar,
                district: user.district,
                upazila: user.upazila,
                status: user.status,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error.message);
        res.status(500).json({
            success: false,
            message: `Failed to fetch profile: ${error.message}`
        })
    }
}

userController.updateProfile = async (req, res) => {
    try {
        const { name, avatar, bloodGroup, district, upazila } = req.body;

        // Validation
        if (!name || !bloodGroup || !district || !upazila) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (name, bloodGroup, district, upazila)'
            });
        }

        if (!bloodGroups.includes(bloodGroup)) {
            return res.status(400).json({
                success: false,
                message: 'Please select a valid blood group'
            });
        }

        const existingUser = await User.findOne({ firebaseUid: req.user.uid });

        if (!existingUser) {
            console.error('User not found with Firebase UID:', req.user.uid);
            return res.status(404).json({
                success: false,
                message: 'User not found. Please logout and login again.'
            });
        }

        const user = await User.findOneAndUpdate(
            { firebaseUid: req.user.uid },
            {
                $set: {
                    name: name.trim(),
                    avatar: avatar || existingUser.avatar,
                    bloodGroup,
                    district,
                    upazila,
                    updatedAt: new Date()
                }
            },
            { new: true, runValidators: true }
        );

        console.log('Profile updated successfully:', user._id);
        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodGroup: user.bloodGroup,
                avatar: user.avatar,
                district: user.district,
                upazila: user.upazila,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Profile update error:', error.message);
        console.error('Full error stack:', error);
        res.status(500).json({
            success: false,
            message: `Failed to update profile: ${error.message}`
        })
    }
}

userController.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'blocked'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const user = await User.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: `User ${status} successfully`, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

userController.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!['donor', 'volunteer', 'admin'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, message: `User role updated to ${role}`, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

userController.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDonors = await User.countDocuments({ role: 'donor' });
        const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalDonors,
                totalVolunteers,
                totalAdmins
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default userController

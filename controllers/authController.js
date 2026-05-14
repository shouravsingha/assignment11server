import User from '../models/User.js'

const authController = {}

// Register/Sync Firebase User with MongoDB
authController.register = async (req, res) => {
    try {
        const { firebaseUid, name, email, avatar, bloodGroup, district, upazila } = req.body

        // Validation
        if (!firebaseUid || !name || !email || !bloodGroup || !district || !upazila) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields (firebaseUid, name, email, bloodGroup, district, upazila)'
            })
        }

        // Check if user already exists by email
        let user = await User.findOne({ email: email.toLowerCase() })

        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered in our system'
            })
        }

        // Check if Firebase UID already exists
        const existingUser = await User.findOne({ firebaseUid })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'This Firebase account is already linked'
            })
        }

        // Create new user with Firebase UID
        user = new User({
            firebaseUid: firebaseUid.trim(),
            name: name.trim(),
            email: email.toLowerCase(),
            avatar: avatar || 'https://i.ibb.co/default-avatar.png',
            bloodGroup,
            district,
            upazila,
            role: 'donor',
            status: 'active'
        })

        // Save user
        await user.save()

        console.log('User registered successfully with Firebase UID:', firebaseUid);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                name: user.name,
                email: user.email,
                role: user.role,
                bloodGroup: user.bloodGroup,
                avatar: user.avatar,
                district: user.district,
                upazila: user.upazila
            }
        })
    } catch (error) {
        console.error('Registration error:', error)
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        })
    }
}

// Get User Profile (Login replacement for Firebase users)
authController.login = async (req, res) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email: email.toLowerCase() })

        if (!user) {
            return res.status(404).json({
                message: 'User not found. Please register first.'
            })
        }

        if (user.status === 'blocked') {
            return res.status(403).json({
                message: 'Your account has been blocked. Please contact support.'
            })
        }

        res.status(200).json({
            success: true,
            message: 'User data retrieved',
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
        })
    } catch (error) {
        console.error('Login/Fetch error:', error)
        res.status(500).json({
            message: error.message || 'Failed to fetch user data'
        })
    }
}

export default authController





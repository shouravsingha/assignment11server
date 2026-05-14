import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: [true, 'Firebase UID is required'],
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    avatar: {
        type: String,
        default: 'https://i.ibb.co/default-avatar.png'
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: [true, 'Please select a blood group']
    },
    district: {
        type: String,
        required: [true, 'Please select a district']
    },
    upazila: {
        type: String,
        required: [true, 'Please select an upazila']
    },
    role: {
        type: String,
        enum: ['donor', 'volunteer', 'admin'],
        default: 'donor'
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export default mongoose.model('User', userSchema)

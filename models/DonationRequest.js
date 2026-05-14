import mongoose from 'mongoose'

const donationRequestSchema = new mongoose.Schema({
    requesterEmail: {
        type: String,
        required: true,
        lowercase: true
    },
    requesterName: {
        type: String,
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    recipientDistrict: {
        type: String,
        required: true
    },
    recipientUpazila: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    fullAddress: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    donationDate: {
        type: Date,
        required: true
    },
    donationTime: {
        type: String,
        required: true
    },
    requestMessage: {
        type: String,
        required: true
    },
    donationStatus: {
        type: String,
        enum: ['pending', 'inprogress', 'done', 'canceled'],
        default: 'pending'
    },
    donorName: {
        type: String,
        default: null
    },
    donorEmail: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const DonationRequest = mongoose.model('DonationRequest', donationRequestSchema)
export default DonationRequest

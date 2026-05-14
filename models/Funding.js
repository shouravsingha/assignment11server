import mongoose from 'mongoose'

const fundingSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        lowercase: true
    },
    userName: {
        type: String,
        required: true
    },
    fundAmount: {
        type: Number,
        required: true,
        min: 1
    },
    paymentMethodId: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed'
    },
    fundingDate: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const Funding = mongoose.model('Funding', fundingSchema)
export default Funding

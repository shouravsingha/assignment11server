import Stripe from 'stripe';
import Funding from '../models/Funding.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const fundingController = {}

fundingController.createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;
        const amountInCents = Math.round(amount * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

fundingController.saveFunding = async (req, res) => {
    try {
        const { fundAmount, transactionId, paymentMethodId } = req.body;
        
        // Get user info from database
        const user = await User.findOne({ firebaseUid: req.user.uid });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const newFunding = new Funding({
            userEmail: user.email,
            userName: user.name,
            fundAmount,
            transactionId,
            paymentMethodId,
            status: 'completed',
            fundingDate: new Date()
        });

        await newFunding.save();

        res.json({
            success: true,
            message: 'Funding record saved successfully',
            funding: newFunding
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

fundingController.getAllFundings = async (req, res) => {
    try {
        const fundings = await Funding.find().sort({ createdAt: -1 });
        res.json({ success: true, fundings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

fundingController.getTotalFundings = async (req, res) => {
    try {
        const result = await Funding.aggregate([
            { $group: { _id: null, total: { $sum: "$fundAmount" } } }
        ]);
        
        const total = result.length > 0 ? result[0].total : 0;
        res.json({ success: true, total });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export default fundingController

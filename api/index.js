import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import 'express-async-errors'
import connectDB from '../config/database.js'

// Route Imports
import authRoutes from '../routes/authRoutes.js'
import userRoutes from '../routes/userRoutes.js'
import donationRoutes from '../routes/donationRoutes.js'
import fundingRoutes from '../routes/fundingRoutes.js'

// Load environment variables
dotenv.config()

// Initialize Express
const app = express()

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Database Connection (Serverless Pattern)
let isConnected = false;
const connect = async () => {
    if (isConnected) return;
    await connectDB();
    isConnected = true;
};

// Favicon request ignore
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

// Create a main router
const mainRouter = express.Router()

mainRouter.use('/auth', authRoutes)
mainRouter.use('/users', userRoutes)
mainRouter.use('/donation-requests', donationRoutes)
mainRouter.use('/funding', fundingRoutes)

mainRouter.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        message: 'BloodCare Server is perfectly running on Vercel',
        timestamp: new Date().toISOString()
    })
})

// Root route to prevent 404 on homepage
mainRouter.get('/', (req, res) => {
    res.send('BloodCare API is Live')
})

// Apply middleware to connect DB on every request (standard for Vercel)
app.use(async (req, res, next) => {
    await connect();
    next();
});

app.use('/api', mainRouter)
app.use('/', mainRouter)

// Error Handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    })
})

export default app

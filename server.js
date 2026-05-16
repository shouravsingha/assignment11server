import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import 'express-async-errors'
import connectDB from './config/database.js'

// Route Imports
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import donationRoutes from './routes/donationRoutes.js'
import fundingRoutes from './routes/fundingRoutes.js'

// Load environment variables
dotenv.config()

// Initialize Express
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
    origin: '*', // For production, you can replace this with your Vercel frontend URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())

// Database Connection
connectDB()

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/donation-requests', donationRoutes)
app.use('/api/funding', fundingRoutes)

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'UP',
        message: 'BloodCare Server is perfectly running on Vercel',
        database: 'Connected',
        timestamp: new Date().toISOString()
    })
})

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

// Error Handler Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err)
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    })
})

export default app

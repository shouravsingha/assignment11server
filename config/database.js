import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
    try {
        const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vqipep0.mongodb.net/bloodDonation?retryWrites=true&w=majority`;
        const conn = await mongoose.connect(uri)
        console.log(`✅ MongoDB connected: ${conn.connection.host}`)
        return conn
    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB

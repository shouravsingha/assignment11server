import express from 'express'
import verifyToken from '../middleware/verifyToken.js'
import userController from '../controllers/userController.js'

const router = express.Router()

router.get('/', verifyToken, userController.getAllUsers)
router.get('/profile', verifyToken, userController.getUserProfile)
router.put('/profile', verifyToken, userController.updateProfile)

export default router

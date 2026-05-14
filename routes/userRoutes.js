import express from 'express'
import verifyToken from '../middleware/verifyToken.js'
import verifyAdmin from '../middleware/verifyAdmin.js'
import userController from '../controllers/userController.js'

const router = express.Router()

// Public/User routes
router.get('/profile', verifyToken, userController.getUserProfile)
router.put('/profile', verifyToken, userController.updateProfile)

// Admin only routes
router.get('/', verifyToken, verifyAdmin, userController.getAllUsers)
router.get('/admin-stats', verifyToken, verifyAdmin, userController.getAdminStats)
router.patch('/:id/status', verifyToken, verifyAdmin, userController.updateStatus)
router.patch('/:id/role', verifyToken, verifyAdmin, userController.updateRole)

export default router

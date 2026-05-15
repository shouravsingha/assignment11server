import express from 'express'
import verifyToken from '../middleware/verifyToken.js'
import fundingController from '../controllers/fundingController.js'

const router = express.Router()

router.post('/create-payment-intent', verifyToken, fundingController.createPaymentIntent)
router.post('/save-funding', verifyToken, fundingController.saveFunding)
router.get('/', fundingController.getAllFundings)
router.get('/total', fundingController.getTotalFundings)

export default router

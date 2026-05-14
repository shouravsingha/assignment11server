import express from 'express'
import verifyToken from '../middleware/verifyToken.js'
import donationController from '../controllers/donationController.js'

const router = express.Router()

router.post('/', verifyToken, donationController.createDonationRequest)
router.get('/', donationController.getAllDonationRequests)
router.get('/:id', donationController.getDonationRequestById)
router.post('/:id/donate', verifyToken, donationController.donateToRequest)
router.patch('/:id/status', verifyToken, donationController.updateDonationRequestStatus)
router.put('/:id', verifyToken, donationController.updateDonationRequest)
router.delete('/:id', verifyToken, donationController.deleteDonationRequest)

export default router

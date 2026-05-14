import mongoose from 'mongoose'
import DonationRequest from '../models/DonationRequest.js'
import User from '../models/User.js'

const donationController = {}

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
const donationStatuses = ['pending', 'inprogress', 'done', 'canceled']
const editableFields = [
    'recipientName',
    'recipientDistrict',
    'recipientUpazila',
    'hospitalName',
    'fullAddress',
    'bloodGroup',
    'donationDate',
    'donationTime',
    'requestMessage'
]

const escapeRegExp = (value) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const normalizeString = (value) => {
    return typeof value === 'string' ? value.trim() : value
}

const normalizePage = (value) => {
    const page = Number.parseInt(value, 10)
    return Number.isNaN(page) || page < 1 ? 1 : page
}

const normalizeLimit = (value) => {
    const limit = Number.parseInt(value, 10)
    if (Number.isNaN(limit) || limit < 1) return 10
    return Math.min(limit, 50)
}

const getCurrentUser = async (req) => {
    return User.findOne({ firebaseUid: req.user.uid })
}

const ensureActiveUser = (user, res, blockedMessage = 'Your account is blocked. You cannot manage donation requests.') => {
    if (!user) {
        res.status(404).json({
            success: false,
            message: 'User not found. Please login again.'
        })
        return false
    }

    if (user.status === 'blocked') {
        res.status(403).json({
            success: false,
            message: blockedMessage
        })
        return false
    }

    return true
}

const getDonationRequestOr404 = async (id, res) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({
            success: false,
            message: 'Invalid donation request id'
        })
        return null
    }

    const donationRequest = await DonationRequest.findById(id)

    if (!donationRequest) {
        res.status(404).json({
            success: false,
            message: 'Donation request not found'
        })
        return null
    }

    return donationRequest
}

const getValidatedDonationPayload = (body, { partial = false } = {}) => {
    const payload = {}
    const errors = []

    for (const field of editableFields) {
        const value = body[field]

        if (!partial && (value === undefined || value === null || normalizeString(value) === '')) {
            errors.push(`${field} is required`)
            continue
        }

        if (partial && value === undefined) {
            continue
        }

        if (typeof value === 'string' && value.trim() === '') {
            errors.push(`${field} cannot be empty`)
            continue
        }

        payload[field] = normalizeString(value)
    }

    if (payload.bloodGroup && !bloodGroups.includes(payload.bloodGroup)) {
        errors.push('Please provide a valid blood group')
    }

    if (payload.donationDate) {
        const donationDate = new Date(payload.donationDate)

        if (Number.isNaN(donationDate.getTime())) {
            errors.push('Please provide a valid donation date')
        } else {
            const today = new Date()
            today.setHours(0, 0, 0, 0)

            const selectedDate = new Date(donationDate)
            selectedDate.setHours(0, 0, 0, 0)

            if (selectedDate < today) {
                errors.push('Donation date cannot be in the past')
            }

            payload.donationDate = donationDate
        }
    }

    if (payload.donationTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(payload.donationTime)) {
        errors.push('Please provide a valid donation time')
    }

    if (payload.requestMessage && payload.requestMessage.length < 10) {
        errors.push('Request message must be at least 10 characters long')
    }

    return { payload, errors }
}

donationController.createDonationRequest = async (req, res) => {
    try {
        const requester = await getCurrentUser(req)

        if (!ensureActiveUser(requester, res, 'Your account is blocked. You cannot create donation requests.')) {
            return
        }

        const { payload, errors } = getValidatedDonationPayload(req.body)

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: errors[0],
                errors
            })
        }

        const donationRequest = new DonationRequest({
            requesterEmail: requester.email,
            requesterName: requester.name,
            ...payload,
            donationStatus: 'pending'
        })

        await donationRequest.save()

        res.status(201).json({
            success: true,
            message: 'Donation request created successfully',
            request: donationRequest
        })
    } catch (error) {
        console.error('Create donation error:', error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

donationController.getAllDonationRequests = async (req, res) => {
    try {
        const {
            bloodGroup,
            district,
            upazila,
            status,
            search,
            requesterEmail,
            page = 1,
            limit = 10
        } = req.query

        const filter = {}
        if (bloodGroup) filter.bloodGroup = bloodGroup
        if (district) filter.recipientDistrict = district
        if (upazila) filter.recipientUpazila = upazila
        if (status) filter.donationStatus = status
        if (requesterEmail) filter.requesterEmail = requesterEmail.toLowerCase()

        if (search) {
            const searchRegex = new RegExp(escapeRegExp(search.trim()), 'i')
            filter.$or = [
                { recipientName: searchRegex },
                { hospitalName: searchRegex },
                { fullAddress: searchRegex },
                { requesterName: searchRegex },
                { recipientUpazila: searchRegex }
            ]
        }

        const currentPage = normalizePage(page)
        const pageLimit = normalizeLimit(limit)
        const total = await DonationRequest.countDocuments(filter)

        const requests = await DonationRequest.find(filter)
            .sort({ createdAt: -1 })
            .limit(pageLimit)
            .skip((currentPage - 1) * pageLimit)

        res.json({
            success: true,
            requests,
            pagination: {
                page: currentPage,
                limit: pageLimit,
                total,
                pages: Math.ceil(total / pageLimit)
            }
        })
    } catch (error) {
        console.error('Get all donations error:', error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

donationController.getDonationRequestById = async (req, res) => {
    try {
        const donationRequest = await getDonationRequestOr404(req.params.id, res)

        if (!donationRequest) {
            return
        }

        res.json({
            success: true,
            request: donationRequest
        })
    } catch (error) {
        console.error('Get donation by ID error:', error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

donationController.updateDonationRequest = async (req, res) => {
    try {
        const donationRequest = await getDonationRequestOr404(req.params.id, res)

        if (!donationRequest) {
            return
        }

        const user = await getCurrentUser(req)

        if (!ensureActiveUser(user, res)) {
            return
        }

        const isRequester = donationRequest.requesterEmail === user.email
        const isAdmin = user.role === 'admin'
        const isVolunteer = user.role === 'volunteer'
        const hasEditableFields = editableFields.some((field) => req.body[field] !== undefined)
        const hasStatusUpdate = req.body.donationStatus !== undefined

        if (!hasEditableFields && !hasStatusUpdate) {
            return res.status(400).json({
                success: false,
                message: 'No donation request changes were provided'
            })
        }

        if (hasEditableFields) {
            if (!isRequester && !isAdmin) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to edit this request'
                })
            }

            if (donationRequest.donationStatus === 'done' && !isAdmin) {
                return res.status(400).json({
                    success: false,
                    message: 'Completed donation requests can only be edited by an admin'
                })
            }

            const { payload, errors } = getValidatedDonationPayload(req.body, { partial: true })

            if (errors.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: errors[0],
                    errors
                })
            }

            Object.assign(donationRequest, payload)
        }

        if (hasStatusUpdate) {
            if (!isRequester && !isAdmin && !isVolunteer) {
                return res.status(403).json({
                    success: false,
                    message: 'You do not have permission to update this request status'
                })
            }

            const donationStatus = req.body.donationStatus

            if (!donationStatuses.includes(donationStatus)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide a valid donation status'
                })
            }

            donationRequest.donationStatus = donationStatus

            if (donationStatus === 'inprogress') {
                const donorName = normalizeString(req.body.donorName) || donationRequest.donorName
                const donorEmail = normalizeString(req.body.donorEmail) || donationRequest.donorEmail

                if (!donorName || !donorEmail) {
                    return res.status(400).json({
                        success: false,
                        message: 'Donor name and email are required when marking as in progress'
                    })
                }

                donationRequest.donorName = donorName
                donationRequest.donorEmail = donorEmail.toLowerCase()
            }

            if (donationStatus === 'pending' || donationStatus === 'canceled') {
                donationRequest.donorName = null
                donationRequest.donorEmail = null
            }
        }

        await donationRequest.save()

        res.json({
            success: true,
            message: 'Donation request updated successfully',
            request: donationRequest
        })
    } catch (error) {
        console.error('Update donation error:', error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

donationController.updateDonationRequestStatus = async (req, res) => {
    req.body = {
        donationStatus: req.body.donationStatus,
        donorName: req.body.donorName,
        donorEmail: req.body.donorEmail
    }

    return donationController.updateDonationRequest(req, res)
}

donationController.donateToRequest = async (req, res) => {
    try {
        const donationRequest = await getDonationRequestOr404(req.params.id, res)

        if (!donationRequest) {
            return
        }

        const donor = await getCurrentUser(req)

        if (!ensureActiveUser(donor, res)) {
            return
        }

        if (donationRequest.requesterEmail === donor.email) {
            return res.status(400).json({
                success: false,
                message: 'You cannot donate to your own request'
            })
        }

        if (donationRequest.donationStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'This request is no longer pending'
            })
        }

        donationRequest.donationStatus = 'inprogress'
        donationRequest.donorName = normalizeString(req.body.donorName) || donor.name
        donationRequest.donorEmail = donor.email

        await donationRequest.save()

        res.json({
            success: true,
            message: 'Donation request accepted successfully',
            request: donationRequest
        })
    } catch (error) {
        console.error('Donate to request error:', error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

donationController.deleteDonationRequest = async (req, res) => {
    try {
        const donationRequest = await getDonationRequestOr404(req.params.id, res)

        if (!donationRequest) {
            return
        }

        const user = await getCurrentUser(req)

        if (!ensureActiveUser(user, res)) {
            return
        }

        const isRequester = donationRequest.requesterEmail === user.email
        const isAdmin = user.role === 'admin'

        if (!isRequester && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to delete this request'
            })
        }

        if (donationRequest.donationStatus === 'done') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete a completed donation request'
            })
        }

        await DonationRequest.findByIdAndDelete(req.params.id)

        res.json({
            success: true,
            message: 'Donation request deleted successfully'
        })
    } catch (error) {
        console.error('Delete donation error:', error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

donationController.getDonationStats = async (req, res) => {
    try {
        const totalRequests = await DonationRequest.countDocuments();
        const pendingRequests = await DonationRequest.countDocuments({ donationStatus: 'pending' });
        const inProgressRequests = await DonationRequest.countDocuments({ donationStatus: 'inprogress' });
        const doneRequests = await DonationRequest.countDocuments({ donationStatus: 'done' });
        const canceledRequests = await DonationRequest.countDocuments({ donationStatus: 'canceled' });

        res.json({
            success: true,
            stats: {
                totalRequests,
                pendingRequests,
                inProgressRequests,
                doneRequests,
                canceledRequests
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export default donationController

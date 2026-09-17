const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, bookingController.createBooking);
router.get('/farmer', verifyToken, bookingController.getFarmerBookings);
router.get('/owner', verifyToken, bookingController.getOwnerBookings);
router.patch('/:id/status', verifyToken, bookingController.updateBookingStatus);

module.exports = router;

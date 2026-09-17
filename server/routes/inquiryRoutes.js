const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, inquiryController.getInquiries);
router.post('/', verifyToken, inquiryController.sendInquiry);

module.exports = router;

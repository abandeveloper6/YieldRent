const express = require('express');
const router = express.Router();
const machineryController = require('../controllers/machineryController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', machineryController.getAllMachinery);
router.get('/:id', machineryController.getMachineryById);

// Owner operations
router.post('/', verifyToken, requireRole('owner', 'admin'), machineryController.createMachinery);
router.put('/:id', verifyToken, requireRole('owner', 'admin'), machineryController.updateMachinery);
router.patch('/:id/toggle-availability', verifyToken, requireRole('owner', 'admin'), machineryController.toggleAvailability);
router.delete('/:id', verifyToken, requireRole('owner', 'admin'), machineryController.deleteMachinery);

module.exports = router;

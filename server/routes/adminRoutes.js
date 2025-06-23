const express = require('express');
const {
  registerAdmin,
  registerDoctor,
  getDoctors,
  getPatients,
  getAllAppointments,
  deleteUser,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('admin'));

router.post('/register', registerAdmin);
router.route('/doctors').post(registerDoctor).get(getDoctors);
router.get('/patients', getPatients);
router.get('/appointments', getAllAppointments);
router.delete('/users/:id', deleteUser);

module.exports = router;
const express = require('express');
const {
  createAppointment,
  cancelAppointment,
  getAppointments,
  getDoctors,
  getDoctorAvailability,
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('patient'));

router.route('/appointments').post(createAppointment).get(getAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);
router.get('/doctors', getDoctors);
router.get('/doctors/:id/availability', getDoctorAvailability);

module.exports = router;
const express = require('express');
const {
  updateSchedule,
  getAppointments,
  updateAppointmentStatus,
  addAppointmentNotes,
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect, authorize('doctor'));

router.put('/schedule', updateSchedule);
router.get('/appointments', getAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);
router.put('/appointments/:id/notes', addAppointmentNotes);

module.exports = router;
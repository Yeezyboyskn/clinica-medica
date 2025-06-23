const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Schedule = require('../models/Schedule');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create appointment
// @route   POST /api/v1/patients/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return next(new ErrorResponse(`Doctor not found with id of ${doctorId}`, 404));
    }

    // Check if doctor has schedule
    const schedule = await Schedule.findOne({ doctor: doctorId });
    if (!schedule) {
      return next(new ErrorResponse(`Doctor does not have a schedule set up`, 400));
    }

    // Check if appointment time is within doctor's working hours
    // (Implement your own logic here based on schedule)

    // Check if appointment time is available
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingAppointment) {
      return next(new ErrorResponse(`Appointment slot already taken`, 400));
    }

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason,
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Cancel appointment
// @route   PUT /api/v1/patients/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        patient: req.user._id,
      },
      { status: 'cancelled' },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return next(
        new ErrorResponse(`Appointment not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all appointments for patient
// @route   GET /api/v1/patients/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialty')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get available doctors
// @route   GET /api/v1/patients/doctors
// @access  Private
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().select('name specialty');

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get available time slots for a doctor on a specific date
// @route   GET /api/v1/patients/doctors/:id/availability
// @access  Private
exports.getDoctorAvailability = async (req, res, next) => {
  try {
    const { date } = req.query;
    const doctorId = req.params.id;

    // Get doctor's schedule
    const schedule = await Schedule.findOne({ doctor: doctorId });
    if (!schedule) {
      return next(new ErrorResponse(`Doctor does not have a schedule set up`, 400));
    }

    // Get doctor's appointments for the day
    const appointments = await Appointment.find({
      doctor: doctorId,
      date,
      status: { $in: ['pending', 'confirmed'] },
    });

    // Generate available time slots
    // (Implement your own logic here based on schedule and existing appointments)

    const availableSlots = []; // This should be populated with available time slots

    res.status(200).json({
      success: true,
      data: availableSlots,
    });
  } catch (err) {
    next(err);
  }
};
const Appointment = require('../models/Appointment');
const Schedule = require('../models/Schedule');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create or update doctor schedule
// @route   PUT /api/v1/doctors/schedule
// @access  Private
exports.updateSchedule = async (req, res, next) => {
  try {
    const { workingDays, startTime, endTime, appointmentDuration, breaks } = req.body;

    let schedule = await Schedule.findOne({ doctor: req.user._id });

    if (!schedule) {
      // Create new schedule
      schedule = await Schedule.create({
        doctor: req.user._id,
        workingDays,
        startTime,
        endTime,
        appointmentDuration,
        breaks,
      });
    } else {
      // Update existing schedule
      schedule.workingDays = workingDays;
      schedule.startTime = startTime;
      schedule.endTime = endTime;
      schedule.appointmentDuration = appointmentDuration;
      schedule.breaks = breaks;
      await schedule.save();
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get doctor's appointments
// @route   GET /api/v1/doctors/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    let query = { doctor: req.user._id };

    if (status) {
      query.status = status;
    }

    if (date) {
      query.date = date;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone')
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

// @desc    Update appointment status
// @route   PUT /api/v1/doctors/appointments/:id/status
// @access  Private
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        doctor: req.user._id,
      },
      { status },
      { new: true, runValidators: true }
    ).populate('patient', 'name phone');

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

// @desc    Add notes to appointment
// @route   PUT /api/v1/doctors/appointments/:id/notes
// @access  Private
exports.addAppointmentNotes = async (req, res, next) => {
  try {
    const { notes } = req.body;

    const appointment = await Appointment.findOneAndUpdate(
      {
        _id: req.params.id,
        doctor: req.user._id,
      },
      { notes },
      { new: true, runValidators: true }
    ).populate('patient', 'name phone');

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
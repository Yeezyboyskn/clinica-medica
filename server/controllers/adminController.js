const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Register new admin
// @route   POST /api/v1/admin/register
// @access  Private/Admin
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Register new doctor
// @route   POST /api/v1/admin/doctors
// @access  Private/Admin
exports.registerDoctor = async (req, res, next) => {
  try {
    const { name, email, password, specialty, licenseNumber, phone } = req.body;

    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialty,
      licenseNumber,
      phone,
    });

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all doctors
// @route   GET /api/v1/admin/doctors
// @access  Private/Admin
exports.getDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().select('-password');

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all patients
// @route   GET /api/v1/admin/patients
// @access  Private/Admin
exports.getPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().select('-password');

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all appointments
// @route   GET /api/v1/admin/appointments
// @access  Private/Admin
exports.getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate('patient', 'name')
      .populate('doctor', 'name specialty')
      .sort({ date: -1, time: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const { role } = req.query;

    let user;
    switch (role) {
      case 'admin':
        user = await Admin.findByIdAndDelete(req.params.id);
        break;
      case 'doctor':
        user = await Doctor.findByIdAndDelete(req.params.id);
        break;
      case 'patient':
        user = await Patient.findByIdAndDelete(req.params.id);
        break;
      default:
        return next(new ErrorResponse('Invalid role', 400));
    }

    if (!user) {
      return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
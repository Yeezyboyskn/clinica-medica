const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const ErrorResponse = require('../utils/errorResponse');
const { generateToken } = require('../config/auth');

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorResponse('Please provide an email, password and role', 400));
  }

  try {
    let user;
    switch (role) {
      case 'admin':
        user = await Admin.findOne({ email }).select('+password');
        break;
      case 'doctor':
        user = await Doctor.findOne({ email }).select('+password');
        break;
      case 'patient':
        user = await Patient.findOne({ email }).select('+password');
        break;
      default:
        return next(new ErrorResponse('Invalid role', 400));
    }

    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    const token = generateToken(user._id, role);

    res.status(200).json({
      success: true,
      token,
      role,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    let user;
    switch (req.role) {
      case 'admin':
        user = await Admin.findById(req.user._id);
        break;
      case 'doctor':
        user = await Doctor.findById(req.user._id);
        break;
      case 'patient':
        user = await Patient.findById(req.user._id);
        break;
      default:
        return next(new ErrorResponse('Invalid user role', 400));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};
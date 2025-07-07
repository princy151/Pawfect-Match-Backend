const nodemailer = require('nodemailer');
const crypto = require('crypto');
const asyncHandler = require('../middleware/async');
const ShelterUser = require('../models/shelter');

// @desc    Register Shelter User
// @route   POST /api/v1/shelter/register
exports.register = asyncHandler(async (req, res) => {
  const { sheltername, location, ed, phone, image, email, password } = req.body;

  const existingUser = await ShelterUser.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await ShelterUser.create({
    sheltername,
    location,
    ed,
    phone,
    image,
    email,
    password,
  });

  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    message: 'Shelter user registered successfully',
    token,
    data: {
      _id: user._id,
      email: user.email,
      sheltername: user.sheltername,
      location: user.location,
    },
  });
});

// @desc    Login Shelter User
// @route   POST /api/v1/shelter/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await ShelterUser.findOne({ email }).select('+password'); // ensure password is included

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    token,
    data: {
      _id: user._id,
      email: user.email,
      sheltername: user.sheltername,
      location: user.location,
    },
  });
});

// @desc    Get Shelter User Profile
// @route   GET /api/v1/shelter/:id
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await ShelterUser.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});


// @desc    Initiate password reset via email
// @route   POST /api/v1/shelter/forgotpassword
exports.forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Email entered:', email);

    const user = await ShelterUser.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user with that email' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:5173/resetpassword/${resetToken}`;
    console.log('Reset URL:', resetUrl);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('Email user:', process.env.EMAIL_USER);
    console.log('Email pass exists:', !!process.env.EMAIL_PASS);

    const mailOptions = {
      from: '"PawPal Support" <no-reply@pawpal.com>',
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click to reset password: <a href="${resetUrl}">${resetUrl}</a></p>`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email.',
    });
  } catch (err) {
    console.error('Error in forgotPassword:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// @desc    Reset password using reset token
// @route   GET /api/v1/shelter/resetpassword/:resetToken
exports.resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // Find user by token and check if token is not expired
  const user = await ShelterUser.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  // You can respond with a page to let user enter new password or
  // just confirm token is valid here.
  res.status(200).json({
    success: true,
    message: 'Reset token is valid. You can now reset your password.',
    data: { email: user.email },
  });
});

// @desc    Verify reset token
// @route   GET /api/v1/shelter/resetpassword/:token
exports.verifyResetToken = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await ShelterUser.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  res.status(200).json({
    success: true,
    message: "Reset token is valid. You can now reset your password.",
    data: { email: user.email },
  });
});

// @desc    Reset password
// @route   POST /api/v1/shelter/resetpassword/:token
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await ShelterUser.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }

  if (!req.body.password) {
    return res.status(400).json({ success: false, message: "Password is required" });
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ success: true, message: "Password updated successfully" });
});
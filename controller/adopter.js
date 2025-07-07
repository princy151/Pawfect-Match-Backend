const asyncHandler = require('../middleware/async');
const Adopter = require('../models/adopter');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// @desc    Register Adopter
// @route   POST /api/v1/adopters/register
exports.register = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const existingAdopter = await Adopter.findOne({ email });
  if (existingAdopter) {
    return res.status(400).json({ message: "Adopter already exists" });
  }

  const adopter = await Adopter.create(req.body);

  res.status(201).json({
    success: true,
    message: "Adopter registered successfully",
    data: adopter,
  });
});

// @desc    Login Adopter
// @route   POST /api/v1/adopters/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const adopter = await Adopter.findOne({ email });
  if (!adopter) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, adopter.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({
    success: true,
    message: 'Logged in successfully',
    data: {
      _id: adopter._id,
      email: adopter.email,
      name: adopter.name,
    },
  });
});

// @desc    Get Adopter Profile
// @route   GET /api/v1/adopters/:id
exports.getProfile = asyncHandler(async (req, res) => {
  const adopter = await Adopter.findById(req.params.id).select('-password');

  if (!adopter) {
    return res.status(404).json({ message: 'Adopter not found' });
  }

  res.status(200).json({
    success: true,
    data: adopter,
  });
});

// @desc    Initiate password reset via email
// @route   POST /api/v1/adopter/forgotpassword
exports.forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Email entered:', email);

    const user = await Adopter.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user with that email' });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `http://localhost:5173/aresetpassword/${resetToken}`;
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
// @route   GET /api/v1/adopter/resetpassword/:resetToken
exports.resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');

  // Find user by token and check if token is not expired
  const user = await Adopter.findOne({
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
// @route   GET /api/v1/adopter/resetpassword/:token
exports.verifyResetToken = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await Adopter.findOne({
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
// @route   POST /api/v1/adopter/resetpassword/:token
exports.resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await Adopter.findOne({
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
const express = require('express');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const router = express.Router();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'villagecounty2025@gmail.com',
    pass: 'Startup@12345'
  }
});

// Get all pending users
router.get('/pending-users', async (req, res) => {
  try {
    const pendingUsers = await User.find({ isApproved: false })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ message: 'Failed to fetch pending users', error: error.message });
  }
});

// Approve user
router.post('/approve/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        isApproved: true, 
        approvalDate: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send approval email to user
    const mailOptions = {
      from: 'villagecounty2025@gmail.com',
      to: user.email,
      subject: 'Account Approved - Welcome to Startup Village County!',
      html: `
        <h2>Congratulations ${user.name}!</h2>
        <p>Your account has been approved by our admin team.</p>
        <p>You can now access all features including:</p>
        <ul>
          <li>Host Properties</li>
          <li>Launch Events</li>
          <li>Manage your dashboard</li>
        </ul>
        <p>Please log in to your account to get started.</p>
        <p>Welcome to Startup Village County!</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'User approved successfully', user });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Failed to approve user', error: error.message });
  }
});

// Reject user
router.post('/reject/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send rejection email to user
    const mailOptions = {
      from: 'villagecounty2025@gmail.com',
      to: user.email,
      subject: 'Account Registration - Additional Information Required',
      html: `
        <h2>Dear ${user.name},</h2>
        <p>Thank you for your interest in Startup Village County.</p>
        <p>We need additional information to complete your registration:</p>
        <p><strong>Reason:</strong> ${reason || 'Please provide valid government proof document'}</p>
        <p>Please contact our support team or resubmit your registration with the required documents.</p>
        <p>Thank you for your understanding.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Optionally delete the user or mark as rejected
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User rejected and notified via email' });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ message: 'Failed to reject user', error: error.message });
  }
});

// Get all users (for admin dashboard)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('properties')
      .populate('events')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const approvedUsers = await User.countDocuments({ isApproved: true });
    const pendingUsers = await User.countDocuments({ isApproved: false });
    
    const totalProperties = await require('../models/Property').countDocuments();
    const totalEvents = await require('../models/Event').countDocuments();

    res.json({
      totalUsers,
      approvedUsers,
      pendingUsers,
      totalProperties,
      totalEvents
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
  }
});

module.exports = router;

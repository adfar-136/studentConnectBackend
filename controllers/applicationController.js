import Application from '../models/Application.js';
import User from '../models/User.js';

// Get all applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .sort({ createdAt: -1 })
      .populate('student', 'name email studentId department year')
      .populate('reviewedBy', 'name');
    
    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
      error: error.message
    });
  }
};

// Get application by student
export const getApplicationByStudent = async (req, res) => {
  try {
    const application = await Application.findOne({ student: req.user._id })
      .populate('reviewedBy', 'name');
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application found for this student'
      });
    }
    
    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch application',
      error: error.message
    });
  }
};

// Create application
export const createApplication = async (req, res) => {
  try {
    const { motivation, experience, skills, position, interests } = req.body;
    
    // Check if application already exists
    const applicationExists = await Application.findOne({ student: req.user._id });
    if (applicationExists) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application'
      });
    }
    
    // Create new application
    const application = await Application.create({
      student: req.user._id,
      motivation,
      experience,
      skills,
      position,
      interests
    });
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: error.message
    });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewComments } = req.body;
    
    // Find application
    const application = await Application.findById(id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }
    
    // Update application
    application.status = status;
    application.reviewedBy = req.user._id;
    if (reviewComments) application.reviewComments = reviewComments;
    await application.save();
    
    // If approved, update user to council member
    if (status === 'approved') {
      await User.findByIdAndUpdate(
        application.student,
        { isCouncilMember: true },
        { new: true }
      );
    }
    
    const updatedApplication = await Application.findById(id)
      .populate('student', 'name email studentId department year')
      .populate('reviewedBy', 'name');
    
    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update application status',
      error: error.message
    });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    // Find and delete user's application
    const application = await Application.findOneAndDelete({ student: req.user._id });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application found for this student'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete application',
      error: error.message
    });
  }
};
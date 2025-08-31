import Participation from '../models/Participation.js';
import Duty from '../models/Duty.js';
import Event from '../models/Event.js';
import User from '../models/User.js';

// Get participation records for a council member
export const getMyParticipation = async (req, res) => {
  try {
    if (!req.user.isCouncilMember) {
      return res.status(403).json({
        success: false,
        message: 'Only council members can view participation records'
      });
    }

    const participation = await Participation.find({ councilMember: req.user._id })
      .populate('event', 'title date location startTime endTime')
      .populate('duty', 'role')
      .sort({ 'event.date': -1 });

    res.status(200).json({
      success: true,
      data: participation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching participation records',
      error: error.message
    });
  }
};

// Get all participation records (admin only)
export const getAllParticipation = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const participation = await Participation.find()
      .populate('councilMember', 'name email studentId department')
      .populate('event', 'title date location startTime endTime')
      .populate('duty', 'role')
      .sort({ 'event.date': -1 });

    res.status(200).json({
      success: true,
      data: participation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching participation records',
      error: error.message
    });
  }
};

// Check in for an event (council member)
export const checkIn = async (req, res) => {
  try {
    const { participationId } = req.params;
    
    if (!req.user.isCouncilMember) {
      return res.status(403).json({
        success: false,
        message: 'Only council members can check in'
      });
    }

    const participation = await Participation.findById(participationId);
    if (!participation) {
      return res.status(404).json({
        success: false,
        message: 'Participation record not found'
      });
    }

    // Check if the participation belongs to the user
    if (participation.councilMember.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only check in for your own duties'
      });
    }

    // Check if already checked in
    if (participation.checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'Already checked in for this event'
      });
    }

    participation.checkInTime = new Date();
    participation.status = 'confirmed';
    await participation.save();

    res.status(200).json({
      success: true,
      message: 'Check-in successful',
      data: participation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during check-in',
      error: error.message
    });
  }
};

// Check out from an event (council member)
export const checkOut = async (req, res) => {
  try {
    const { participationId } = req.params;
    
    if (!req.user.isCouncilMember) {
      return res.status(403).json({
        success: false,
        message: 'Only council members can check out'
      });
    }

    const participation = await Participation.findById(participationId);
    if (!participation) {
      return res.status(404).json({
        success: false,
        message: 'Participation record not found'
      });
    }

    // Check if the participation belongs to the user
    if (participation.councilMember.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only check out from your own duties'
      });
    }

    // Check if already checked out
    if (participation.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'Already checked out from this event'
      });
    }

    // Check if checked in first
    if (!participation.checkInTime) {
      return res.status(400).json({
        success: false,
        message: 'Must check in before checking out'
      });
    }

    participation.checkOutTime = new Date();
    participation.status = 'completed';
    await participation.save();

    res.status(200).json({
      success: true,
      message: 'Check-out successful',
      data: participation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during check-out',
      error: error.message
    });
  }
};

// Admin update participation status and add notes
export const updateParticipation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, performanceRating, adminNotes } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const participation = await Participation.findById(id);
    if (!participation) {
      return res.status(404).json({
        success: false,
        message: 'Participation record not found'
      });
    }

    // Update fields
    if (status) participation.status = status;
    if (performanceRating !== undefined) participation.performanceRating = performanceRating;
    if (adminNotes !== undefined) participation.adminNotes = adminNotes;

    await participation.save();

    res.status(200).json({
      success: true,
      message: 'Participation updated successfully',
      data: participation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating participation',
      error: error.message
    });
  }
};

// Mark participation as no-show (admin only)
export const markNoShow = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const participation = await Participation.findById(id);
    if (!participation) {
      return res.status(404).json({
        success: false,
        message: 'Participation record not found'
      });
    }

    participation.status = 'no_show';
    await participation.save();

    res.status(200).json({
      success: true,
      message: 'Participation marked as no-show',
      data: participation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking participation as no-show',
      error: error.message
    });
  }
};

// Get participation statistics (admin only)
export const getParticipationStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const stats = await Participation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalParticipation = await Participation.countDocuments();
    const completedParticipation = await Participation.countDocuments({ status: 'completed' });
    const noShowParticipation = await Participation.countDocuments({ status: 'no_show' });

    const completionRate = totalParticipation > 0 ? (completedParticipation / totalParticipation) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        statusBreakdown: stats,
        totalParticipation,
        completedParticipation,
        noShowParticipation,
        completionRate: Math.round(completionRate * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching participation statistics',
      error: error.message
    });
  }
};

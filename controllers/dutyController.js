import Duty from '../models/Duty.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

// Get all duties
export const getAllDuties = async (req, res) => {
  try {
    const duties = await Duty.find({})
      .sort({ createdAt: -1 })
      .populate('event', 'title date location')
      .populate('student', 'name email studentId')
      .populate('assignedBy', 'name');
    
    // Filter out duties with missing references and add safety checks
    const validDuties = duties.filter(duty => 
      duty.event && duty.student && duty.assignedBy
    );
    
    res.status(200).json({
      success: true,
      count: validDuties.length,
      duties: validDuties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch duties',
      error: error.message
    });
  }
};

// Get duties by student
export const getDutiesByStudent = async (req, res) => {
  try {
    const duties = await Duty.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .populate('event', 'title date location startTime endTime status')
      .populate('assignedBy', 'name');
    
    // Filter out duties with missing references
    const validDuties = duties.filter(duty => 
      duty.event && duty.assignedBy
    );
    
    res.status(200).json({
      success: true,
      count: validDuties.length,
      duties: validDuties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch duties',
      error: error.message
    });
  }
};

// Get duties by event
export const getDutiesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const duties = await Duty.find({ event: eventId })
      .populate('student', 'name email studentId department year')
      .populate('assignedBy', 'name');
    
    res.status(200).json({
      success: true,
      count: duties.length,
      duties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch duties by event',
      error: error.message
    });
  }
};

// Assign duty
export const assignDuty = async (req, res) => {
  try {
    const { eventId, studentId, role } = req.body;
    
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if student exists
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Check if duty already assigned
    const dutyExists = await Duty.findOne({ event: eventId, student: studentId });
    if (dutyExists) {
      return res.status(400).json({
        success: false,
        message: 'Duty already assigned to this student for this event'
      });
    }
    
    // Create new duty
    const duty = await Duty.create({
      event: eventId,
      student: studentId,
      role,
      assignedBy: req.user._id
    });
    
    const populatedDuty = await Duty.findById(duty._id)
      .populate('event', 'title date location')
      .populate('student', 'name email studentId')
      .populate('assignedBy', 'name');
    
    res.status(201).json({
      success: true,
      message: 'Duty assigned successfully',
      duty: populatedDuty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to assign duty',
      error: error.message
    });
  }
};

// Update duty status
export const updateDutyStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;
    
    // Find duty
    const duty = await Duty.findById(id);
    
    if (!duty) {
      return res.status(404).json({
        success: false,
        message: 'Duty not found'
      });
    }
    
    // Check if user is authorized to update status
    if (duty.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this duty'
      });
    }
    
    // Update duty
    duty.status = status;
    if (feedback) duty.feedback = feedback;
    await duty.save();
    
    const updatedDuty = await Duty.findById(id)
      .populate('event', 'title date location')
      .populate('student', 'name email studentId')
      .populate('assignedBy', 'name');
    
    res.status(200).json({
      success: true,
      message: 'Duty status updated successfully',
      duty: updatedDuty
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update duty status',
      error: error.message
    });
  }
};

// Delete duty
export const deleteDuty = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete duty
    const duty = await Duty.findByIdAndDelete(id);
    
    if (!duty) {
      return res.status(404).json({
        success: false,
        message: 'Duty not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Duty deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete duty',
      error: error.message
    });
  }
};

// Clean up orphaned duties (remove duties with missing references)
export const cleanupOrphanedDuties = async (req, res) => {
  try {
    // Find duties with missing event, student, or assignedBy references
    const orphanedDuties = await Duty.find({
      $or: [
        { event: { $exists: false } },
        { student: { $exists: false } },
        { assignedBy: { $exists: false } }
      ]
    });
    
    if (orphanedDuties.length > 0) {
      await Duty.deleteMany({
        _id: { $in: orphanedDuties.map(d => d._id) }
      });
      
      res.status(200).json({
        success: true,
        message: `Cleaned up ${orphanedDuties.length} orphaned duties`,
        cleanedCount: orphanedDuties.length
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'No orphaned duties found',
        cleanedCount: 0
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cleanup orphaned duties',
      error: error.message
    });
  }
};
import EventProposal from '../models/EventProposal.js';
import User from '../models/User.js';
import Event from '../models/Event.js';

// Create a new event proposal (council members only)
export const createEventProposal = async (req, res) => {
  try {
    const { title, description, location, proposedDate, startTime, endTime, expectedAttendees, budget, resources } = req.body;
    
    // Check if user is a council member
    if (!req.user.isCouncilMember) {
      return res.status(403).json({ 
        success: false, 
        message: 'Only council members can propose events' 
      });
    }

    const eventProposal = new EventProposal({
      title,
      description,
      location,
      proposedDate,
      startTime,
      endTime,
      expectedAttendees,
      budget,
      resources,
      proposer: req.user._id
    });

    await eventProposal.save();

    res.status(201).json({
      success: true,
      message: 'Event proposal submitted successfully',
      data: eventProposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating event proposal',
      error: error.message
    });
  }
};

// Get all event proposals (admin only)
export const getAllEventProposals = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const proposals = await EventProposal.find()
      .populate('proposer', 'name email studentId department')
      .populate('adminResponder', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: proposals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event proposals',
      error: error.message
    });
  }
};

// Get event proposals by council member
export const getMyEventProposals = async (req, res) => {
  try {
    if (!req.user.isCouncilMember) {
      return res.status(403).json({
        success: false,
        message: 'Only council members can view their proposals'
      });
    }

    const proposals = await EventProposal.find({ proposer: req.user._id })
      .populate('adminResponder', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: proposals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching your event proposals',
      error: error.message
    });
  }
};

// Get single event proposal
export const getEventProposal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const proposal = await EventProposal.findById(id)
      .populate('proposer', 'name email studentId department')
      .populate('adminResponder', 'name email');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Event proposal not found'
      });
    }

    // Check if user can view this proposal
    if (req.user.role !== 'admin' && proposal.proposer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event proposal',
      error: error.message
    });
  }
};

// Admin review and feedback for event proposal
export const reviewEventProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminFeedback, rejectionReason } = req.body;

    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const proposal = await EventProposal.findById(id);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Event proposal not found'
      });
    }

    // Update proposal with admin feedback
    proposal.status = status;
    proposal.adminFeedback = adminFeedback || '';
    proposal.adminResponseDate = new Date();
    proposal.adminResponder = req.user._id;

    if (status === 'rejected' && rejectionReason) {
      proposal.rejectionReason = rejectionReason;
    }

    // If approved, create an actual event
    if (status === 'approved') {
      const newEvent = new Event({
        title: proposal.title,
        description: proposal.description,
        location: proposal.location,
        date: proposal.proposedDate,
        startTime: proposal.startTime,
        endTime: proposal.endTime,
        organizer: proposal.proposer,
        status: 'upcoming'
      });

      await newEvent.save();
    }

    await proposal.save();

    res.status(200).json({
      success: true,
      message: `Event proposal ${status} successfully`,
      data: proposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reviewing event proposal',
      error: error.message
    });
  }
};

// Update event proposal (council member can edit pending proposals)
export const updateEventProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const proposal = await EventProposal.findById(id);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Event proposal not found'
      });
    }

    // Check if user can edit this proposal
    if (proposal.proposer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own proposals'
      });
    }

    // Only allow editing if status is pending
    if (proposal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit proposals that are not pending'
      });
    }

    const updatedProposal = await EventProposal.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Event proposal updated successfully',
      data: updatedProposal
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating event proposal',
      error: error.message
    });
  }
};

// Delete event proposal (council member can delete pending proposals)
export const deleteEventProposal = async (req, res) => {
  try {
    const { id } = req.params;

    const proposal = await EventProposal.findById(id);
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Event proposal not found'
      });
    }

    // Check if user can delete this proposal
    if (proposal.proposer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own proposals'
      });
    }

    // Only allow deletion if status is pending
    if (proposal.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete proposals that are not pending'
      });
    }

    await EventProposal.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Event proposal deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting event proposal',
      error: error.message
    });
  }
};

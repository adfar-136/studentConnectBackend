import DutyRequest from '../models/DutyRequest.js';
import Duty from '../models/Duty.js';
import User from '../models/User.js';

// Create a new duty request
export const createDutyRequest = async (req, res) => {
  try {
    const { dutyId, requestType, currentRole, requestedRole, reason } = req.body;

    // Validate that the duty exists and belongs to the user
    const duty = await Duty.findById(dutyId).populate('student');
    if (!duty) {
      return res.status(404).json({ message: 'Duty not found' });
    }

    if (duty.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only request changes for your own duties' });
    }

    // Validate request type specific requirements
    if (requestType === 'role_change' && !requestedRole) {
      return res.status(400).json({ message: 'Requested role is required for role change requests' });
    }

    if (requestType === 'role_change' && currentRole === requestedRole) {
      return res.status(400).json({ message: 'Current role and requested role cannot be the same' });
    }

    // Check if there's already a pending request for this duty
    const existingRequest = await DutyRequest.findOne({
      duty: dutyId,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this duty' });
    }

    const dutyRequest = await DutyRequest.create({
      duty: dutyId,
      requestType,
      currentRole,
      requestedRole,
      reason,
      status: 'pending'
    });

    const populatedRequest = await DutyRequest.findById(dutyRequest._id)
      .populate('duty')
      .populate('adminResponder', 'name email');

    res.status(201).json({
      message: 'Duty request created successfully',
      data: populatedRequest
    });
  } catch (error) {
    console.error('Error creating duty request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all duty requests (admin only)
export const getAllDutyRequests = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const dutyRequests = await DutyRequest.find()
      .populate({
        path: 'duty',
        populate: {
          path: 'student',
          select: 'name email'
        }
      })
      .populate('adminResponder', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Duty requests retrieved successfully',
      data: dutyRequests
    });
  } catch (error) {
    console.error('Error fetching duty requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's own duty requests
export const getMyDutyRequests = async (req, res) => {
  try {
    // First get all duty requests for the user
    const dutyRequests = await DutyRequest.find()
      .populate({
        path: 'duty',
        populate: {
          path: 'student',
          select: 'name email'
        }
      })
      .populate('adminResponder', 'name email')
      .sort({ createdAt: -1 });

    // Filter to only show requests where the duty belongs to the current user
    const userDutyRequests = dutyRequests.filter(request => 
      request.duty.student._id.toString() === req.user._id.toString()
    );

    res.json({
      message: 'Duty requests retrieved successfully',
      data: userDutyRequests
    });
  } catch (error) {
    console.error('Error fetching duty requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific duty request
export const getDutyRequest = async (req, res) => {
  try {
    const dutyRequest = await DutyRequest.findById(req.params.id)
      .populate('duty')
      .populate('adminResponder', 'name email');

    if (!dutyRequest) {
      return res.status(404).json({ message: 'Duty request not found' });
    }

    // Check if user has access to this request
    if (req.user.role !== 'admin' && dutyRequest.duty.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({
      message: 'Duty request retrieved successfully',
      data: dutyRequest
    });
  } catch (error) {
    console.error('Error fetching duty request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Review duty request (admin only)
export const reviewDutyRequest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { status, adminResponse } = req.body;
    const { id } = req.params;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be approved or rejected.' });
    }

    const dutyRequest = await DutyRequest.findById(id);
    if (!dutyRequest) {
      return res.status(404).json({ message: 'Duty request not found' });
    }

    if (dutyRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Can only review pending requests' });
    }

    // Update the duty request
    dutyRequest.status = status;
    dutyRequest.adminResponse = adminResponse || '';
    dutyRequest.adminResponder = req.user._id;
    dutyRequest.responseDate = new Date();

    await dutyRequest.save();

    // If approved and it's a role change, update the duty
    if (status === 'approved' && dutyRequest.requestType === 'role_change') {
      const duty = await Duty.findById(dutyRequest.duty);
      if (duty) {
        duty.role = dutyRequest.requestedRole;
        await duty.save();
      }
    }

    // If approved and it's a cancellation, update the duty status
    if (status === 'approved' && dutyRequest.requestType === 'cancellation') {
      const duty = await Duty.findById(dutyRequest.duty);
      if (duty) {
        duty.status = 'cancelled';
        await duty.save();
      }
    }

    const populatedRequest = await DutyRequest.findById(id)
      .populate('duty')
      .populate('adminResponder', 'name email');

    res.json({
      message: 'Duty request reviewed successfully',
      data: populatedRequest
    });
  } catch (error) {
    console.error('Error reviewing duty request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update duty request (user can only update pending requests)
export const updateDutyRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const { id } = req.params;

    const dutyRequest = await DutyRequest.findById(id);
    if (!dutyRequest) {
      return res.status(404).json({ message: 'Duty request not found' });
    }

    // Check if user owns this request
    const duty = await Duty.findById(dutyRequest.duty);
    if (duty.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only update pending requests
    if (dutyRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Can only update pending requests' });
    }

    dutyRequest.reason = reason;
    await dutyRequest.save();

    const populatedRequest = await DutyRequest.findById(id)
      .populate('duty')
      .populate('adminResponder', 'name email');

    res.json({
      message: 'Duty request updated successfully',
      data: populatedRequest
    });
  } catch (error) {
    console.error('Error updating duty request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Cancel duty request
export const cancelDutyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const dutyRequest = await DutyRequest.findById(id);
    if (!dutyRequest) {
      return res.status(404).json({ message: 'Duty request not found' });
    }

    // Check if user owns this request
    const duty = await Duty.findById(dutyRequest.duty);
    if (duty.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Can only cancel pending requests
    if (dutyRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending requests' });
    }

    dutyRequest.status = 'cancelled';
    await dutyRequest.save();

    res.json({
      message: 'Duty request cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling duty request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete duty request
export const deleteDutyRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const dutyRequest = await DutyRequest.findById(id);
    if (!dutyRequest) {
      return res.status(404).json({ message: 'Duty request not found' });
    }

    // Check if user owns this request or is admin
    const duty = await Duty.findById(dutyRequest.duty);
    if (req.user.role !== 'admin' && duty.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await DutyRequest.findByIdAndDelete(id);

    res.json({
      message: 'Duty request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting duty request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

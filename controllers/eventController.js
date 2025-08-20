import Event from '../models/Event.js';
import Duty from '../models/Duty.js';
import User from '../models/User.js';

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({})
      .sort({ date: 1 })
      .populate('organizer', 'name email');
    
    res.status(200).json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const event = await Event.findById(id)
      .populate('organizer', 'name email');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      location, 
      date, 
      startTime, 
      endTime,
      image 
    } = req.body;
    
    // Create new event
    const event = await Event.create({
      title,
      description,
      location,
      date,
      startTime,
      endTime,
      image,
      organizer: req.user._id
    });
    
    // Auto-assign duties to council members
    const councilMembers = await User.find({ isCouncilMember: true });
    
    // Create duties for each council member
    const duties = [];
    const roles = ['coordinator', 'volunteer', 'registration', 'technical', 'publicity', 'decoration'];
    
    for (let i = 0; i < councilMembers.length; i++) {
      const role = roles[i % roles.length];
      
      const duty = await Duty.create({
        event: event._id,
        student: councilMembers[i]._id,
        role,
        assignedBy: req.user._id
      });
      
      duties.push(duty);
    }
    
    res.status(201).json({
      success: true,
      message: 'Event created and duties assigned successfully',
      event,
      dutiesAssigned: duties.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

// Update an event
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      location, 
      date, 
      startTime, 
      endTime,
      status,
      image 
    } = req.body;
    
    // Find and update event
    const event = await Event.findByIdAndUpdate(
      id,
      { 
        title, 
        description, 
        location, 
        date, 
        startTime, 
        endTime,
        status,
        image 
      },
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// Delete an event
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete event
    const event = await Event.findByIdAndDelete(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Delete all related duties
    await Duty.deleteMany({ event: id });
    
    res.status(200).json({
      success: true,
      message: 'Event and related duties deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};
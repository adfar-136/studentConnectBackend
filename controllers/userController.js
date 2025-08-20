import User from '../models/User.js';
import ValidStudentId from '../models/ValidStudentId.js';
import Query from '../models/Query.js';

// Get all council members
export const getAllCouncilMembers = async (req, res) => {
  try {
    const councilMembers = await User.find({ isCouncilMember: true })
      .select('name email department year profileImage')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: councilMembers.length,
      councilMembers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch council members',
      error: error.message
    });
  }
};

// Create a new valid student ID
export const createValidStudentId = async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ success: false, message: 'Student ID is required' });
    }
    const exists = await ValidStudentId.findOne({ studentId });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Student ID already exists' });
    }
    const newId = await ValidStudentId.create({ studentId });
    res.status(201).json({ success: true, validStudentId: newId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create student ID', error: error.message });
  }
};

// List valid student IDs with pagination and search
export const listValidStudentIds = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { studentId: { $regex: search, $options: 'i' } } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [studentIds, total] = await Promise.all([
      ValidStudentId.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ValidStudentId.countDocuments(query)
    ]);
    res.status(200).json({
      success: true,
      studentIds,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student IDs', error: error.message });
  }
};

// Student raises a query
export const raiseQuery = async (req, res) => {
  try {
    const { subject, description } = req.body;
    const student = req.user._id;
    const query = await Query.create({ student, subject, description });
    res.status(201).json({ success: true, query });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to raise query', error: error.message });
  }
};

// Admin lists all queries or student lists their own
export const listQueries = async (req, res) => {
  try {
    let queries;
    if (req.user.role === 'admin') {
      queries = await Query.find().populate('student', 'name email studentId').sort({ createdAt: -1 });
    } else {
      queries = await Query.find({ student: req.user._id }).populate('student', 'name email studentId').sort({ createdAt: -1 });
    }
    res.status(200).json({ success: true, queries });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch queries', error: error.message });
  }
};

// Admin replies/updates status
export const replyQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply, status } = req.body;
    const query = await Query.findByIdAndUpdate(id, { adminReply, status }, { new: true });
    res.status(200).json({ success: true, query });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update query', error: error.message });
  }
};

// Admin forwards query (mail logic placeholder, no nodemailer)
export const forwardQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { forwardedTo } = req.body;
    const query = await Query.findById(id).populate('student', 'name email studentId');
    if (!query) return res.status(404).json({ success: false, message: 'Query not found' });
    // No email logic, just update status and forwardedTo
    const updatedQuery = await Query.findByIdAndUpdate(id, { status: 'forwarded', forwardedTo, mailForwarded: false }, { new: true });
    res.status(200).json({ success: true, query: updatedQuery });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to forward query', error: error.message });
  }
};
import Faq from '../models/Faq.js';

// Get all FAQs
export const getAllFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({}).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message
    });
  }
};

// Get FAQs by category
export const getFaqsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const faqs = await Faq.find({ category }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: faqs.length,
      faqs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs by category',
      error: error.message
    });
  }
};

// Create a new FAQ
export const createFaq = async (req, res) => {
  try {
    const { question, answer, category, tags } = req.body;
    
    // Check if FAQ already exists
    const faqExists = await Faq.findOne({ question });
    if (faqExists) {
      return res.status(400).json({
        success: false,
        message: 'FAQ already exists with this question'
      });
    }
    
    // Create new FAQ
    const faq = await Faq.create({
      question,
      answer,
      category,
      tags: tags || [],
      createdBy: req.user._id
    });
    
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create FAQ',
      error: error.message
    });
  }
};

// Update a FAQ
export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, tags } = req.body;
    
    // Find and update FAQ
    const faq = await Faq.findByIdAndUpdate(
      id,
      { question, answer, category, tags: tags || [] },
      { new: true, runValidators: true }
    );
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQ',
      error: error.message
    });
  }
};

// Delete a FAQ
export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete FAQ
    const faq = await Faq.findByIdAndDelete(id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete FAQ',
      error: error.message
    });
  }
};
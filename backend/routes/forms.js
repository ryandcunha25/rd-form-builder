// routes/forms.js
const express = require('express');
const router = express.Router();
const Form = require('../models/forms');
const Response = require('../models/response');

// Get all forms
router.get('/forms', async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new form
router.post('/createForm', async (req, res) => {
  const { title, description, headerImage, questions, userId } = req.body;
  
  try {
    const newForm = new Form({
      title,
      description,
      headerImage,
      questions,
      createdBy: userId
    });

    const savedForm = await newForm.save();
    
    res.status(201).json({
      success: true,
      message: 'Form created successfully',
      form: savedForm
    });
  } catch (err) {
    res.status(400).json({ 
      success: false,
      message: 'Failed to create form',
      error: err.message 
    });
  }
});

// Get single form
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    res.json(form);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update form
router.put('/:id', async (req, res) => {
  try {
    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedForm) return res.status(404).json({ message: 'Form not found' });
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete form
router.delete('/:id', async (req, res) => {
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);
    if (!deletedForm) return res.status(404).json({ message: 'Form not found' });
    res.json({ message: 'Form deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// And the corresponding simplified route:
router.post('/forms/:id/submission', async (req, res) => {
  
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const newResponse = new Response({
      formId: req.params.id,
      responses: req.body.responses,
    });

    const savedResponse = await newResponse.save();
    console.log("Saved response:", savedResponse);
    res.status(201).json(savedResponse);
    
  } catch (err) {
    console.error("Error saving response:", err);
    res.status(400).json({ message: err.message });
  }
});

// Get all responses for a specific form
router.get('/:id/responses', async (req, res) => {
  try {
    const formId = req.params.id;

    // // Validate form ID
    // if (!mongoose.Types.ObjectId.isValid(formId)) {
    //   return res.status(400).json({ success: false, message: 'Invalid form ID' });
    // }

    // Check if form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    // Get all responses for this form
    const responses = await Response.find({ formId })
      .populate('submittedBy', 'name email') // Assuming you have user data
      .sort({ submittedAt: -1 });

    // Calculate statistics
    const totalSubmissions = responses.length;
    let averageScore = 0;
    
    // If you implement scoring later, you can calculate it here
    // const averageScore = responses.length > 0 
    //   ? responses.reduce((sum, res) => sum + (res.score || 0), 0) / responses.length 
    //   : 0;

    // Prepare response data
    const responseData = {
      success: true,
      form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        createdBy: form.createdBy
      },
      responses: responses.map(r => ({
        _id: r._id,
        submittedAt: r.submittedAt,
        submittedBy: r.submittedBy,
        responses: r.responses // This contains all the answer data
      })),
      statistics: {
        totalSubmissions,
        averageScore,
        uniqueRespondents: new Set(responses.map(r => r.submittedBy?.toString() || 'anonymous')).size
      }
    };

    res.json(responseData);
  } catch (err) {
    console.error('Error fetching form responses:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching responses',
      error: err.message 
    });
  }
});
module.exports = router;


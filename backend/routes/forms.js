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

// Submit form response
router.post('/:id/responses', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    const newResponse = new Response({
      formId: req.params.id,
      responses: req.body.responses,
    });
    const savedResponse = await newResponse.save();
    res.status(201).json(savedResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
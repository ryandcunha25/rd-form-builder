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
router.put('/:id/edit', async (req, res) => {
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

// submission of form
router.post('/forms/:id/submission', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Create new response with score data
    const newResponse = new Response({
      formId: req.params.id,
      responses: req.body.responses,
      score: req.body.score || 0, // Default to 0 if not provided
      maxScore: req.body.maxScore || 0, // Default to 0 if not provided
      completed: true,
      submittedAt: new Date()
    });

    const savedResponse = await newResponse.save();
    
    // Update form statistics (optional)
    await Form.findByIdAndUpdate(req.params.id, {
      $inc: { 
        submissionCount: 1,
        totalScore: req.body.score || 0 
      },
      $set: {
        lastSubmissionAt: new Date()
      }
    });

    console.log("Saved response with score:", {
      id: savedResponse._id,
      score: savedResponse.score,
      maxScore: savedResponse.maxScore,
      percentage: savedResponse.score / savedResponse.maxScore * 100
    });

    res.status(201).json({
      success: true,
      response: {
        _id: savedResponse._id,
        formId: savedResponse.formId,
        score: savedResponse.score,
        maxScore: savedResponse.maxScore,
        percentage: Math.round((savedResponse.score / savedResponse.maxScore) * 100),
        submittedAt: savedResponse.submittedAt
      }
    });
    
  } catch (err) {
    console.error("Error saving response:", err);
    res.status(400).json({ 
      success: false,
      message: 'Failed to submit form response',
      error: err.message 
    });
  }
});

// Get all responses for a specific form
router.get('/:id/responses', async (req, res) => {
  try {
    const formId = req.params.id;

    // Check if form exists
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    // Get all responses for this form
    const responses = await Response.find({ formId })
      .populate('submittedBy', 'name email')
      .sort({ submittedAt: -1 });

    // Calculate max possible score from form questions
    const maxPossibleScore = form.questions.reduce((sum, question) => {
      return sum + (question.points || 1); // Default to 1 point if not specified
    }, 0);

    // Calculate statistics
    const totalSubmissions = responses.length;
    let averageScore = 0;
    let highestScore = 0;
    
    if (totalSubmissions > 0) {
      const totalScore = responses.reduce((sum, res) => sum + (res.score || 0), 0);
      averageScore = totalScore / totalSubmissions;
      highestScore = Math.max(...responses.map(res => res.score || 0));
    }

    // Prepare response data
    const responseData = {
      success: true,
      form: {
        _id: form._id,
        title: form.title,
        description: form.description,
        createdAt: form.createdAt,
        updatedAt: form.updatedAt,
        createdBy: form.createdBy,
        questions: form.questions.map(q => ({
          _id: q._id,
          type: q.type,
          text: q.text,
          points: q.points || 1 // Include points for each question
        }))
      },
      responses: responses.map(r => ({
        _id: r._id,
        submittedAt: r.submittedAt,
        submittedBy: r.submittedBy,
        responses: r.responses,
        score: r.score || 0,
        maxScore: maxPossibleScore,
        percentage: maxPossibleScore > 0 ? Math.round(((r.score || 0) / maxPossibleScore) * 100) : 0
      })),
      statistics: {
        totalSubmissions,
        averageScore: parseFloat(averageScore.toFixed(2)), // Round to 2 decimal places
        maxPossibleScore,
        highestScore,
        averagePercentage: maxPossibleScore > 0 ? parseFloat(((averageScore / maxPossibleScore) * 100).toFixed(2)) : 0,
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


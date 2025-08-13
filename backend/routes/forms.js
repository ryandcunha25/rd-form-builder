// routes/forms.js
const express = require('express');
const router = express.Router();
const Form = require('../models/forms');
const Response = require('../models/response');
const authenticate = require('../middleware/auth');

// Get all forms
router.get('/forms', async (req, res) => {
  console.log("Fetching all forms");
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new form
router.post('/createForm', async (req, res) => {
  const {
    title,
    description,
    headerImage,
    questions,
    userId,
    collectRespondentInfo 
  } = req.body;

  console.log("Received form data:", req.body);

  try {
    const newForm = new Form({
      title,
      description,
      headerImage,
      questions,
      createdBy: userId,
      collectRespondentInfo: collectRespondentInfo || false 
    });

    console.log("New form data:", newForm);

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

// Delete form and all its responses
router.delete('/:id', async (req, res) => {
  try {
    // First delete all responses for this form
    await Response.deleteMany({ formId: req.params.id });

    // Then delete the form itself
    const deletedForm = await Form.findByIdAndDelete(req.params.id);

    if (!deletedForm) {
      return res.status(404).json({
        success: false,
        message: 'Form not found'
      });
    }

    res.json({
      success: true,
      message: 'Form and all its responses deleted successfully',
      deletedFormId: deletedForm._id
    });

  } catch (err) {
    console.error('Error deleting form:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting form',
      error: err.message
    });
  }
});

// PUT request to toggle acceptingResponses
router.put('/:id/toggle-accepting', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    console.log("toggle:", form)
    // // Verify the user owns this form
    // if (form.createdBy.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: 'Not authorized to modify this form' });
    // }

    form.acceptingResponses = !form.acceptingResponses;
    await form.save();

    res.status(200).json({ success: true, acceptingResponses: form.acceptingResponses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle accepting responses' });
  }
});

// submission of form
router.post('/forms/:id/submission', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: 'Form not found' });

    // Validate responses exist
    if (!req.body.responses) {
      return res.status(400).json({ message: 'Responses are required' });
    }

    if (!form.acceptingResponses) {
      return res.status(403).json({
        success: false,
        message: 'This form is no longer accepting responses'
      });
    }

    // If form requires respondent info but it's not provided
    if (form.collectRespondentInfo && !req.user) {
      if (!req.body.respondentName || !req.body.respondentEmail) {
        return res.status(400).json({
          message: 'Name and email are required for this form submission'
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.respondentEmail)) {
        return res.status(400).json({
          message: 'Please provide a valid email address'
        });
      }
    }

    // Base payload for response
    const responseData = {
      formId: req.params.id,
      responses: req.body.responses,
      score: req.body.score || 0,
      maxScore: req.body.maxScore || 0,
      completed: true,
      submittedAt: new Date()
    };

    // If user is logged in
    if (req.user) {
      responseData.submittedBy = req.user._id;
      // Still store respondent info if provided (optional)
      if (req.body.respondentName) {
        responseData.respondentName = req.body.respondentName;
      }
      if (req.body.respondentEmail) {
        responseData.respondentEmail = req.body.respondentEmail;
      }
    }
    // If anonymous user and form requires respondent info
    else if (form.collectRespondentInfo) {
      responseData.respondentName = req.body.respondentName;
      responseData.respondentEmail = req.body.respondentEmail;
    }

    const newResponse = new Response(responseData);
    console.log("Saving response:", newResponse);
    const savedResponse = await newResponse.save();

    // Update form statistics
    const updateData = {
      $inc: { submissionCount: 1 },
      $set: { lastSubmissionAt: new Date() }
    };

    // Only update totalScore if scoring is enabled
    if (typeof req.body.score === 'number') {
      updateData.$inc.totalScore = req.body.score;
    }

    await Form.findByIdAndUpdate(req.params.id, updateData);

    // Calculate percentage if maxScore is provided
    const percentage = req.body.maxScore && req.body.score
      ? Math.round((req.body.score / req.body.maxScore) * 100)
      : null;

    res.status(201).json({
      success: true,
      response: {
        _id: savedResponse._id,
        formId: savedResponse.formId,
        score: savedResponse.score,
        maxScore: savedResponse.maxScore,
        percentage: percentage,
        submittedAt: savedResponse.submittedAt,
        ...(savedResponse.respondentName && { respondentName: savedResponse.respondentName }),
        ...(savedResponse.respondentEmail && { respondentEmail: savedResponse.respondentEmail })
      }
    });

  } catch (err) {
    console.error("Error saving response:", err);
    res.status(500).json({
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
    console.log("Form found:", form);
    if (!form) {
      return res.status(404).json({ success: false, message: 'Form not found' });
    }

    const questions = form.questions.map(q => ({
      _id: q._id,
      type: q.type,
      questionText: q.questionText || '',
      image: q.image || '',
      categories: q.categories || [],
      items: q.items || [],
      clozeText: q.clozeText || '',
      blanks: q.blanks || [],
      mcqs: q.mcqs || [],
      points: q.points || 1 // Default to 1 point if not specified
    }));

    // console.log("\nEACH QUESTION:\n ", questions)

    // Get all responses for this form
    const responses = await Response.find({ formId })
      .populate('submittedBy', 'name email')
      .sort({ submittedAt: -1 });

    console.log("Responses found:", responses);

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
        questions: questions,

      },
      responses: responses.map(r => ({
        _id: r._id,
        submittedAt: r.submittedAt,
        submittedBy: r.submittedBy,
        responses: r.responses,
        score: r.score || 0,
        respondentName: r.respondentName,  // Add this
        respondentEmail: r.respondentEmail,
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


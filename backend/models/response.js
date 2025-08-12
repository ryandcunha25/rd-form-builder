// models/Response.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: String, 

  categorizedItems: [{
    itemId: String,
    category: String
  }],

  clozeAnswers: [{
    blankId: String,
    answer: String
  }],

  comprehensionAnswers: [{
    mcqId: String,
    selectedOptionIndex: Number
  }],

  textAnswer: String
});

const responseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },

  // If the person filling the form is logged in
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // For anonymous / non-logged in respondents (from form fields)
  respondentName: {
    type: String,
    trim: true
  },
  respondentEmail: {
    type: String,
    trim: true
  },

  // Actual answers: Map<questionId, answerData>
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },

  submittedAt: { 
    type: Date, 
    default: Date.now 
  },

  score: {
    type: Number,
    default: 0
  },
  
  completed: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

// Optional scoring logic
responseSchema.methods.calculateScore = function(form) {
  let score = 0;
  const formQuestions = form.questions;
  
  formQuestions.forEach(question => {
    const response = this.responses.get(question._id.toString());
    if (response && question.correctAnswer) {
      if (JSON.stringify(response) === JSON.stringify(question.correctAnswer)) {
        score += question.points || 1;
      }
    }
  });
  
  this.score = score;
  return score;
};

module.exports = mongoose.model('Response', responseSchema);

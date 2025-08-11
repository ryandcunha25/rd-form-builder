// models/Response.js
const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: String, // Matches the id in Form.questions

  // For 'categorize' questions
  categorizedItems: [{
    itemId: String, // Matches 'id' in Form.questions.items
    category: String // Category chosen by the user
  }],

  // For 'cloze' questions
  clozeAnswers: [{
    blankId: String, // Matches 'id' in Form.questions.blanks
    answer: String   // User's selected or typed answer
  }],

  // For 'comprehension' questions
  comprehensionAnswers: [{
    mcqId: String,  // Matches 'id' in Form.questions.mcqs
    selectedOptionIndex: Number // index of chosen option
  }],

  // Optional free-text responses
  textAnswer: String
});


const responseSchema = new mongoose.Schema({
  formId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Form', 
    required: true 
  },
  // Store responses as a flexible object matching frontend structure
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

// Optional: Add methods for calculating score if needed
responseSchema.methods.calculateScore = function(form) {
  // Implement your scoring logic here based on form questions
  // This is just a placeholder example
  let score = 0;
  const formQuestions = form.questions;
  
  formQuestions.forEach(question => {
    const response = this.responses.get(question._id.toString());
    if (response && question.correctAnswer) {
      // Compare response with correctAnswer and add points
      // This would need to be customized per question type
      if (JSON.stringify(response) === JSON.stringify(question.correctAnswer)) {
        score += question.points || 1;
      }
    }
  });
  
  this.score = score;
  return score;
};

module.exports = mongoose.model('Response', responseSchema);

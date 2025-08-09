// models/Response.js
const mongoose = require('mongoose');

// Response Schema
const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    // Different answer types for different questions
    categorizedItems: [{
      itemId: mongoose.Schema.Types.ObjectId,
      category: String
    }],
    clozeAnswers: [String],
    comprehensionAnswers: [String],
    textAnswer: String,
    selectedOptions: [String]
  }],
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', responseSchema);
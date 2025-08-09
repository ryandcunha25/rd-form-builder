// models/Form.js
const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  id: String,
  type: String,
  label: String,
  required: Boolean,
  placeholder: String,
  options: [String],
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  headerImage: { type: String }, // URL to uploaded image
  questions: [{
    type: { 
      type: String, 
      enum: ['categorize', 'cloze', 'comprehension', 'text', 'dropdown', 'checkbox'], 
      required: true 
    },
    questionText: { type: String, required: true },
    questionImage: { type: String }, // URL to uploaded image
    // Categorize-specific fields
    categories: [String],
    items: [{
      text: String,
      belongsTo: String // category name
    }],
    // Cloze-specific fields
    clozeText: String,
    blanks: [{
      answer: String,
      hint: String
    }],
    // Comprehension-specific fields
    passage: String,
    mcqs: [{
      question: String,
      options: [String],
      correctAnswer: String
    }],
    // Common fields
    required: { type: Boolean, default: false },
    points: { type: Number, default: 1 }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Form', formSchema);
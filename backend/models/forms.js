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
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  headerImage: {
    type: String, // URL or base64 encoded image
    default: ''
  },
  questions: [{
    type: {
      type: String,
      enum: ['categorize', 'cloze', 'comprehension'],
      required: true
    },
    questionText: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    points: {
      type: Number,
      default: 1
    },
    // Fields specific to categorize questions
    categories: [{
      type: String
    }],
    items: [{
      text: String,
      category: String
    }],
    // Fields specific to cloze questions
    clozeText: String,
    blanks: [{
      word: String,
      options: [String]
    }],
    // Fields specific to comprehension questions
    passage: String,
    mcqs: [{
      question: String,
      options: [String],
      correctAnswer: Number // index of correct option
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to user who created the form
  }
});


module.exports = mongoose.model('Form', formSchema);
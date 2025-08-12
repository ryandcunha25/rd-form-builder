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
    image: {
      type: String, // URL or base64 encoded image for the question
      default: ''
    },
    // Fields specific to categorize questions
    categories: [{
      type: String
    }],
    items: [{
      id: String,
      text: String,
      category: String
    }],
    // Fields specific to cloze questions
    clozeText: String,
    blanks: [{
      id: String,
      word: String,
      options: [String]
    }],
    // Fields specific to comprehension questions
    passage: String,
    mcqs: [{
      id: String,
      question: String,
      options: [String],
      correctAnswer: Number
    }]
  }],

  acceptingResponses: {
    type: Boolean,
    default: true,
  },

  collectRespondentInfo: {
    type: Boolean,
    default: false
  },

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


// Update the updatedAt field before saving
formSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


module.exports = mongoose.model('Form', formSchema);
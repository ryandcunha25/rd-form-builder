// services/getFormWithResponses.js
const mongoose = require('mongoose');
const Form = require('../models/forms');
const Response = require('../models/response');

/**
 * Fetches a form with all its questions and the corresponding answers
 * from all responses to that form.
 * 
 * @param {string} formId - The ID of the form
 * @returns {Promise<Object>} Form object with attached responses per question
 */
async function getFormWithResponses(formId) {
  if (!mongoose.Types.ObjectId.isValid(formId)) {
    throw new Error('Invalid formId');
  }

  // Fetch the form
  const form = await Form.findById(formId).lean();
  if (!form) {
    throw new Error('Form not found');
  }

  // Fetch all responses for this form
  const responses = await Response.find({ formId })
    .populate('submittedBy', 'name email') // optional, if you want user info
    .lean();

  // Map questionId => all answers for that question
  const questionAnswersMap = {};
  responses.forEach((response) => {
    // Loop through each question's answer in the Map (saved as 'responses')
    for (let [questionId, answerData] of response.responses.entries()) {
      if (!questionAnswersMap[questionId]) {
        questionAnswersMap[questionId] = [];
      }
      questionAnswersMap[questionId].push({
        user: response.submittedBy || null,
        answer: answerData,
        submittedAt: response.submittedAt
      });
    }
  });

  // Attach answers to each question in the form
  const questionsWithAnswers = form.questions.map((question) => {
    const qId = question._id.toString();
    return {
      ...question,
      answers: questionAnswersMap[qId] || []
    };
  });

  return {
    ...form,
    questions: questionsWithAnswers,
    totalResponses: responses.length
  };
}

module.exports = getFormWithResponses;

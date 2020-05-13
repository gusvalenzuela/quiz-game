const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  category: {
    type: Number,
    required: true,
    unique: true
  },
  hi_score: {
    type: Number,
    unique: true
  },
  scores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Score"
    }
  ]
});

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;

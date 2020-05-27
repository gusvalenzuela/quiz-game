const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  difficulty: {
    type: String,
  },
  category: {
    type: Number,
    required: true,
  },
  hi_score: {
    type: Number,
  },
  scores: [
    {
      type: Schema.Types.ObjectId,
      ref: "Score",
    },
  ],
});

const Quiz = mongoose.model("Quiz", QuizSchema);

module.exports = Quiz;

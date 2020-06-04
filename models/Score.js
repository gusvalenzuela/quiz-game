const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  initials: {
    type: String,
    trim: true,
    required: "Initials are required",
    validate: [
      ({ length }) => length > 1 && length < 4,
      "Initials need to be between 1 and 3 characters long.",
    ],
  },
  score: {
    type: Number,
  },
  category: {
    name: {
      type: String,
    },
    id: {
      type: Number,
    },
    difficulty: {
      type: String,
    },
  },
  questions: {
    data: [],
    incorrect: {
      type: Number,
    },
    correct: {
      type: Number,
    },
    total: {
      type: Number,
    },
  },
  dateEntered: {
    type: Date,
  },
});

const Score = mongoose.model("Score", ScoreSchema);

module.exports = Score;

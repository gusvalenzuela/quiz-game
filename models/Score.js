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
  difficulty: {
    type: String,
  },
  category: {
    type: Number,
  },
  category_name: {
    type: String,
  },
  dateEntered: {
    type: Date,
  },
});

const Score = mongoose.model("Score", ScoreSchema);

module.exports = Score;

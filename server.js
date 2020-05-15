const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");

const PORT = process.env.PORT || 3700;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/quizdowndb", {
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index-node.html"));
});
app.get("/test", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index-test.html"));
});

app.get("/api/scores", (req, res) => {
  db.Score.find({})
    .then((dbScores) => {
      res.json(dbScores);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/user", (req, res) => {
  db.User.find({})
    .then((dbUser) => {
      res.json(dbUser);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/submit/", ({ body }, res) => {
  console.log(body)
  db.Score.create(body)
    .then(({ _id }) =>
      db.Quiz.create({category: body.category}, { $push: { scores: _id } })
    )
    .then((dbScores) => {
      res.json(dbScores);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

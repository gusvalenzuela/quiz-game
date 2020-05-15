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
app.get("/api/quizzes", (req, res) => {
  db.Quiz.find({})
    .populate("scores")
    .then((dbUser) => {
      res.json(dbUser);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.post("/submit/", ({ body }, res) => {
  var quizType = `${body.category_name.slice(0, 7).toLowerCase()}-${
    body.category
  }-${body.difficulty}`;

  db.Score.create(body, (scores) => {
    console.log(scores)
    db.Quiz.updateOne(
      // Syntax: { $and: [ { <expression1> }, { <expression2> } , ... , { <expressionN> } ] }
      { name: quizType },
      {
        category: body.category,
        difficulty: body.difficulty,
        category_name: body.category_name,
        $push: { scores: scores._id },
      },
      { upsert: true }
    )
      .then((dbScores) => {
        console.log(`\r\nLINE 86: DBSCORES\r\n`, dbScores);
        res.json(dbScores);
      })
      .catch((err) => {
        res.json(err);
      });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

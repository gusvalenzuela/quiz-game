const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const db = require("./models");
const app = express();
const exphbs = require("express-handlebars");
const PORT = process.env.PORT || 3700;

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

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
app.get("/test", ({ params }, res) => {
  res.sendFile(path.join(__dirname + "/public/index-test.html"));
});

app.get("/hiscores/:difficulty/:category", ({ params }, res) => {
  db.Score.where(`category`, Number(params.category))
    .where(`difficulty`, params.difficulty)
    .sort({ score: -1 })
    .then((dbScores) => {
      res.render(`hiscores`, { scores: [dbScores] });
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/allscores/", ({ params }, res) => {
  // const difficulty = params.difficulty
  db.Score.find({})
    .sort({ score: -1 })
    .then((dbScores) => {
      res.json(dbScores);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.get("/api/hiscores/:difficulty/:category", ({ params }, res) => {
  db.Score.where(`category`, Number(params.category))
    .where(`difficulty`, params.difficulty)
    .sort({ score: -1 })
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

app.delete("/api/deletescore/:id", ({ params }, res) => {
  console.log(`\r\n\n\n\n\n\ngoing to delete this record: ${params.id}`);
  db.Score.deleteOne({ _id: mongoose.Types.ObjectId(params.id) }).then(
    (result) => {
      res.json(result);
    }
  );
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
  // creating a "unique" identifier for each pool of scores
  // each category will have 3 pools corresponding to difficulties
  var quizType = `${body.category_name.slice(0, 7).toLowerCase()}-${
    body.category
  }-${body.difficulty}`;

  // create a new document in Score collection
  db.Score.create(body)
    // then update the corresponding "quiz" pool, pushing the new score
    .then((scores) =>
      db.Quiz.update(
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
    )
    // finally respond with a successs
    .then((dbScores) => {
      // console.log(`\r\nLINE 86: DBSCORES\r\n`, dbScores);
      res.send(dbScores);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `${"*".repeat(16)}\r\n>> App running on port ${PORT}!\r\n${"*".repeat(16)}`
  );
});

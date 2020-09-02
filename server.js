const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
// const path = require("path");
const scoreRoutes = require("./routes/scores.js");
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

mongoose.connect(process.env.MONGODB_URX || "mongodb://localhost/quizdowndb", {
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname + "/public/index-node.html"));
  res.render(`index`);
});


scoreRoutes(app);

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

// redirect anything else to homepage
app.get("*", (req, res) => {
  res.redirect("/");
});

// Start the server
app.listen(PORT, () => {
  console.log(
    `${"*".repeat(16)}\r\n>> App running on port ${PORT}!\r\n${"*".repeat(16)}`
  );
});

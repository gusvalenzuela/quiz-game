const { Score, Quiz } = require(`../models`);

module.exports = function (app) {
  app.get("/api/scores/:difficulty/:category", ({ params }, res) => {

    // console.log(`\n\n`,Number(params.category))

    Score.where("category.id")
      .equals(Number(params.category))
      .where("category.difficulty")
      .equals(params.difficulty)
      .sort({ score: -1 })
      .then((dbScores) => {
        res.json(dbScores);
        // res.render(`hiscores`, { scores: [dbScores] });
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.get("/api/scores/all", ({ params }, res) => {
    // const difficulty = params.difficulty
    Score.find({})
      .sort({ score: -1 })
      .then((dbScores) => {
        res.json(dbScores);
      })
      .catch((err) => {
        res.json(err);
      });
  });

  app.get("/scores", ({ params }, res) => {
    res.render(`hiscores`, { scores: [params.scores] });
  });

  app.delete("/api/scores/:id", ({ params }, res) => {
    console.log(`\r\n\n\n\n\n\ngoing to delete this record: ${params.id}`);
    Score.deleteOne({ _id: mongoose.Types.ObjectId(params.id) }).then(
      (result) => {
        res.json(result);
      }
    );
  });

  app.post("/submit/", ({ body }, res) => {
    // creating a "unique" identifier for each pool of scores
    // each category will have 3 pools corresponding to difficulties
    var quizType = `${body.category.name.slice(0, 7).toLowerCase()}-${
      body.category.num
    }-${body.category.difficulty}`;

    // create a new document in Score collection
    Score.create(body)
      // then update the corresponding "quiz" pool, pushing the new score
      .then((scores) =>
        Quiz.update(
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
};

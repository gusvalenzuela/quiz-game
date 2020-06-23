const db = require("../models");

// Defining methods for the postsController
module.exports = {
  findAll: function (req, res) {
    db.Score.find({})
      .sort({ score: -1 })
      // .sort({ date: -1 })
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  create: function (req, res) {
    console.log(req.body.category.id);
    db.Score.create(req.body)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  update: function (req, res) {
    db.Score.findOneAndUpdate({ _id: req.params.id }, req.body)
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },
  remove: function (req, res) {
    // find and delete?
    db.Score.findById({ _id: req.params.id })
      .then((dbModel) => dbModel.remove())
      .then((dbModel) => res.json(dbModel))
      .catch((err) => res.status(422).json(err));
  },

  getScoreByDiffCat: function ({ category, difficulty }, res) {
    db.Score.where(`category`, Number(category))
      .where(`difficulty`, difficulty)
      .sort({ score: -1 })
      .then((dbScores) => {
        res.json(dbScores);
      })
      .catch((err) => {
        res.json(err);
      });
  },
};

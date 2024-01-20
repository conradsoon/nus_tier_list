var express = require("express");
var router = express.Router();
var { addComparison, getRandomComparison } = require("../db/db");
/* POST comparison */
// router.get("/", function (req, res,next) {
//   res.render("index", { title: "Express" });
// });

router.post("/", function (req, res, next) {
  //post the comparison of two ids
  console.log(req.params);
  const id1 = req.query.id1;
  const id2 = req.query.id2;
  const better_id = req.query.better_id;
  //make a comparison object
  const comparison = {
    tid1: id1,
    tid2: id2,
    tidBetter: better_id,
    timeEvaluated: new Date(),
  };
  console.log(comparison);
  //add the comparison to the database
  addComparison(comparison)
    .then(() => {
      //send a response
      res.status(200).send("Comparison added");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error adding comparison");
    });
});

router.get("/", function (req, res, next) {
  //get a random comparison
  getRandomComparison()
    .then((comparison) => {
      //send a response
      res.status(200).send(comparison);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error getting comparison");
    });
});

module.exports = router;

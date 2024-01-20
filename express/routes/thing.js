var express = require("express");
var router = express.Router();
var { processComparisons } = require("../ranking/ranking");
var { getTopKThings } = require("../db/db");

/* POST comparison */
// router.get("/", function (req, res,next) {
//   res.render("index", { title: "Express" });
// });
//

// router.get("/", function (req, res, next) {
//   //force the ranking system
//   processComparisons()
//     .then(() => {
//       res.status(200).send("Rankings processed");
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send("Error processing rankings");
//     });
// });

router.get("/", function (req, res, next) {
  getTopKThings(50)
    .then((things) => {
      res.status(200).send(things);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Error getting top things");
    });
});

module.exports = router;

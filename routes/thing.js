var express = require("express");
var router = express.Router();
var { processComparisons } = require("../ranking/ranking");

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
  //get things
  
}
module.exports = router;

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors"); // Import the cors middleware
const cron = require("node-cron");
var { processComparisons } = require("./ranking/ranking");

//rerank every 1 minute
cron.schedule("*/1 * * * *", () => {
  processComparisons();
});

// var indexRouter = require("./routes/index");
// var usersRouter = require("./routes/users");
var comparisonRouter = require("./routes/comparison");
var thingRouter = require("./routes/thing");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Enable CORS for a specific origin (replace 'http://localhost:3000' with your Svelte app's origin)
app.use(
  cors({
    origin: "*", // Allow all origins
    // origin: "http://nustierlistv1.conradsoon.me", // Replace with your Svelte app's origin
    credentials: true, // Enable sending cookies and other credentials
  })
);

// app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/comparison", comparisonRouter);
// TO-DO, GET RID OF THIS
app.use("/thing", thingRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

//db nonsense
var db = require("./db/db"); // Import the database connection

//bot nonsense
var bot = require("./bot/bot"); // Import the bot

const express = require("express");
const router = new express.Router();
const app = express();
const AppError = require("./src/utils/appError");
const globalErrorHandler = require("./src/controllers/errorController");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoute = require("./src/routes/authRoute");
const userRoute = require("./src/routes/userRoute");
const cors = require("cors");
// const passport = require('./src/auth/passport');
// const reviewRouter = require("./src/routes/reviewRouter")

require("dotenv").config({ path: ".env" });

mongoose
  .connect(process.env.DB, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);
// app.use(passport.initialize());

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.get("/", async (req, res) => {
  return res
    .status(200)
    .json({ status: true, message: "Connection established" });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

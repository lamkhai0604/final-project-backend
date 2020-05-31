const Review = require("../models/review");
const { deleteOne, updateOne } = require("./factories");


exports.createReview = async function (req, res) {
  try {
    // create review or update existing review
    const review = await Review.create( // will call .save()
      // { user: req.user._id, tour: req.params.tid },
      { ...req.body, tour: req.params.tid, user: req.user._id })
    // { upsert: true, new: true, setDefaultsOnInsert: true });

    res.status(201).json({ status: "success", data: review })
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.readReviews = async function (req, res) {
  try {
    const reviews = await Review.find({ tour: req.params.tid });
    res.json({ status: "success", data: reviews });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  };
};

exports.readReview = async function (req, res) {
  try {
    const review = await Review.findById(req.params.id).exec();
    res.status(400).json({ status: "fail", message: error.message });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  };
};

exports.updateReview = updateOne(Review);


exports.deleteReview = deleteOne(Review)


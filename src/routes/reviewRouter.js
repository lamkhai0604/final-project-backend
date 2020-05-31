const router = require("express").Router({mergeParams: true});
const { auth } = require("../controllers/authController");

const {
  readReviews,
  readReview,
  updateReview,
  deleteReview,
  createReview } = require("../controllers/reviewController");

const checkTour = require("../middlewares/checkTour");

// subsequent routers, they dont understand :tid
router
  .route("/")
  .get(checkTour, readReviews)
  .post(auth, checkTour, createReview)

router
  .route("/:id")
  .get(readReview)
  .patch(auth, updateReview)
  .delete(auth, deleteReview)


module.exports = router;


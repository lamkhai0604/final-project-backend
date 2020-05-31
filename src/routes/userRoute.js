const router = require("express").Router();
const { auth } = require("../controllers/authController");
const {
  allUser,
  createUser,
  setUserInactive,
  updateProfile,
  updatePasswords,
  getUser,
  readUser,
  readUsers,
  changeRolesAdmin,
  forgotPassword,
  resetPassword,
  verifyAccount,
  readProfile,
  updateUser
} = require("../controllers/userController");

router.route("/profile").get(auth, getUser).put(auth, updateProfile);

// router.put("/inactiveuser/:id", auth, setUserInactive);

// router.put("/adminconfig/:id", auth, changeRolesAdmin);

router.route("/").get(allUser).post(createUser);

router.route("/:id")
.get(getUser)
.put(auth, updatePasswords);

// reset password
// router.route("/forget-password/:email").get(resetPassword);
// router.route("/:id").get(readUser);

// users
// router
// .route("/me")
// .get(auth, readProfile)
// .patch(auth, updateUser)

// router.route("/:id").get(readUser)
// router
// .route("/")
// .get(readUsers)
// .post(createUser)

module.exports = router;

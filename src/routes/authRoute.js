const router = require("express").Router();
const {
  login,
  auth,
  logoutAll,
  logout,
  signUp
} = require("../controllers/authController");
const { loginFacebook, facebookAuth } = require("../auth/fbHandler");
const { loginGG, ggAuth } = require("../auth/ggHandler");
const { loginGithub, githubAuth } = require("../auth/githubHandler");

router.get("/facebook", loginFacebook);
router.get("/facebook/authorized", facebookAuth);

router.get("/google", loginGG);
router.get("/google/authorized", ggAuth);

router.get("/github", loginGithub);
router.get("/github/authorized", githubAuth);

router.get("/logout", auth, logout);
router.get("/logoutall", auth, logoutAll);

router.post("/login", login);

router.post("/signup", signUp);

module.exports = router;

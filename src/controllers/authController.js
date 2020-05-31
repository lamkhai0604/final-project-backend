const User = require("../models/user");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    user = new User({
      email,
      password
    });
    // const salt = await bcrypt.genSalt(10);

    // user.password = await bcrypt.hash(password, salt);

    await user.save();
    return res.json({ user });
  } catch (error) {
    console.log(error);
  }
};

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = password === user.password;

    if (!isMatch) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Invalid Credentials Password" }] });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.jwtsecret,
      { expiresIn: "5 days" },
      (err, token) => {
        if (err) throw err;
        res.json({ user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
// exports.login = catchAsync(async function(req, res, next) {
//   const { email, password } = req.body;
//   if (!password || !email) {
//     return next(new AppError("Email and either password are required", 400));
//   }
//   const user = await User.loginWithCredentials(email, password); //thieu trong model
//   const token = await User.generateToken(user); //
//   user.tokens.push(token);
//   await user.save();
//   await User.findByIdAndUpdate(user._id, { token: user.token });

//   res.status(200).json({ status: true, user, token });
// });

// exports.logout = catchAsync(async function (req, res) {
//   const { email } = req.user;
//   const token = req.headers.authorization.replace("Bearer ", "");
//   const user = await User.findOne({ email });
//   user.token = user.token.filter((id) => id !== token);
//   await User.findByIdAndUpdate(user._id, { token: user.token });
//   res.status(204).json({ status: true, message: "Logout successful" });
// });

// exports.logoutall = catchAsync(async function (req, res) {
//   const { email } = req.user;
//   const user = await User.findOne({ email });
//   await User.findByIdAndUpdate(user._id, { token: [] });
//   res.status(204).json({ status: true, message: "Logout successful" });
// });

exports.logout = async function(req, res) {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    req.user.tokens = req.user.tokens.filter(el => el !== token);
    await req.user.save();
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};

exports.logoutAll = async function(req, res) {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(401).json({ status: "fail", message: err.message });
  }
};

exports.auth = catchAsync(async function(req, res, next) {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  )
    return res.status(403).json({
      status: false,
      message: "You're not logged in, please login first!"
    });
  const token = req.headers.authorization.replace("Bearer ", "");
  if (token) {
    const tokenJson = jwt.verify(token, process.env.secret);
    const user = await User.findById(tokenJson.id);
    if (user) {
      req.user = user;
      next();
    } else {
      return next(new AppError("User not found!", 404));
    }
  } else {
    return next(new AppError("You're not logged in, please login first", 401));
  }
});

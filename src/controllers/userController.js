const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { updateOne, createOne } = require("../utils/operateHandler");
const jwt = require("jsonwebtoken");




exports.createUser = async function (req, res) {
  const { name, email, password } = req.body;
  if (!name && !email && !password) {
    return res.status(400).json({
      status: "fail",
      message: "Name, email and password are required!",
    });
  }
  try {
    const user = await User.create({ name, password, email });
    
    res.status(201).json({ status: "ok", data: user });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

//front: form => enter email;
// front: send get request 5000/users/forget-password/khai@gmail.com

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.params;
  if (!email) return next(new AppError(400, "need to provide email"));

  const user = await User.findOne({ email: email });
  if (!user) return res.status(200).json({ status: "fail", data: null });

  const token = jwt.sign({ email: user.email }, process.env.secret);

  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID);
  const msg = {
    to: "user.email",
    from: "lamkhai0604@gmail.com",
    subject: "Reset password request",
    html:`Click <a href="https://localhost:3000/email/${token}">the link</a> to reset your password`
  };
  sgMail.send(msg);
  return res.status(200).json({ status:"success", data: null})
});

//   try {
//     const user = await User.create({ name, email, password });
//     return res.status(201).json({ status: "ok", data: user });
//   } catch (err) {
//     return res
//     .status(400)
//     .json({
//       status: "fail",
//       error: "You need to  provide email, name and password",
//     });
//   }
// };
exports.createUser = createOne(User);

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new AppError("No User with that such ID!", 404));
  }
  res.status(200).json({ status: true, data: user });
});

exports.allUser = catchAsync(async function (req, res, next) {
  const users = await User.find();
  res.status(200).json({ status: true, data: users });
});

exports.updatePasswords = catchAsync(async function (req, res, next) {
  const user = await User.findById(req.params.id).select("+password");
  if (!user) {
    return next(new AppError("No User with that such ID!", 404));
  }
  if (req.body) {
    const verifiedPassword = await bcrypt.compare(
      req.body.currentPassword.toString(),
      user.password
    );
    if (!verifiedPassword) {
      return next(new AppError("Invalid current password", 400));
    }
    user.token = [];
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    const verified = await user.save();
    if (!verified) {
      return next(
        new AppError("Something went wrong! Check again please!", 500)
      );
    }
    res.status(200).json({
      ok: true,
      message: "User updated successfully. Please login again.",
    });
  } else {
    return next(
      new AppError(
        "Please provide some information to change your account",
        400
      )
    );
  }
});

exports.updateProfile = updateOne(User);

exports.changeRolesAdmin = catchAsync(async function (req, res, next) {
  if (req.user.roles === "admin") {
    const user = await User.findByIdAndUpdate(req.params.id, {
      roles: "admin",
    });
    if (!user) {
      return next(new AppError("No User with that such ID!", 404));
    }
    res
      .status(200)
      .json({ ok: true, message: "User's roles updated successfully." });
  } else {
    return next(new AppError("Unauthorized to perform this action", 403));
  }
});

// exports.readProfile = async function (req, res) => {
//   res.status(200).json({status: "ok", data: req.user})
// }

exports.setUserInactive = catchAsync(async function (req, res, next) {
  if (req.user.id === req.params.id || req.user.roles === "admin") {
    await User.findByIdAndUpdate(req.params.id, { active: false });
    res.status(204).end();
  } else {
    return next(
      new AppError("You not have permissions to perform this action.", 403)
    );
  }
});

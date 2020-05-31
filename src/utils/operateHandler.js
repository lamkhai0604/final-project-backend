const catchAsync = require('./catchAsync');
const AppError = require('./appError');
const User = require('../models/user');


const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


const ownerCheck = async function (user, Model, id) {
  try {
    const item = await Model.findById(id);
    if (!item) {
      throw new AppError('That ID not exists in our db', 404);
    }
    if (
      item.organizer.toString() === user._id.toString() ||
      user.roles === 'admin' ||
      user.roles === 'editor'
    ) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err.message);
  }
};

exports.createOne = (Model) =>
  catchAsync(async function (req, res, next) {
    const bodyData = { ...req.body };
    switch (Model.modelName) {
      case 'User':
      if (await User.findOne({email: req.body.email}))
      {
        return next(new AppError('Bad request', 400))
      }
        break;
      default:
        bodyData = { ...req.body };
    }
    const doc = await Model.create(bodyData);
    res.status(201).json({ status: true, data: doc });

  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let filteredBody = {};
    let id;
    switch (Model.modelName) {
      case 'User':
        id = req.user.id;
        if (await ownerCheck(req.user.id, Model, id)) {
          filteredBody = filterObj(req.body, 'name', 'email', 'dob');
        } else {
          return next(
            new AppError(
              "You don't have permission to perform this action",
              403
            )
          );
        }
        break;
      default:
        filteredBody = {};
    }
    const item = await Model.findOneAndUpdate({_id: id}, filteredBody, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: true, data: item });
  });
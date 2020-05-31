const mongoose = require("mongoose");
const validator = require("validator");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    require: [true, "email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function(value) {
        return validator.isEmail(value);
      }
    }
  },
  name: {
    type: String,
    require: [true, "email is required"],
    trim: true
  },
  password: {
    type: String,
    require: [true, "password is required"]
  },
  tokens: []
});

// schema.pre("save", async function (next) {
//   // this here = doc
//   if (!this.isModified("password")) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// schema.statics.generateToken = async function (user) {
//   const token = jwt.sign({ id: user._id }, process.env.secret, {
//     expiresIn: "7d",
//   });
//   return token;
// };

// schema.statics.loginWithCredentials = async (email, password) => {
//   const user = await User.findOne({ email: email });
//   if (!user) throw new Error("Unable to login");
//   const match = await bcrypt.compare(password, user.password);
//   if (!match) throw new Error("Unable to login");
//   return user;
// };

// schema.statics.findOneOrCreate = async ({name, email}) => {
// 	let user = await User.findOne ({ email });
// 	if(!user){
// 		user= await User.create({ email, name });
// 	}
// 	user.token = await user.generateToken()
// 	return user;
// };

// const User = mongoose.model("User", schema);

// module.exports = User;

module.exports = User = mongoose.model("user", UserSchema);

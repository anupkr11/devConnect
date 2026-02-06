const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 30,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(val){
        if(!validator.isEmail(val)){
          throw new Error("Invalid email");
        }
      }
    },
    password: {
      type: String,
      required: true,
      validate(val){
        if(!validator.isStrongPassword(val)){
          throw new Error("Enter a strong password");
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      validate(val) {
        if (!["male", "female", "other"].includes(val)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    skills: [String],
    photoURL: {
      type: String,
      validate(val){
        if(!validator.isURL(val)){
          throw new Error("Invalid photo URL");
        }
      }
    },
    about: {
      type: String,
      default: "This is the about section.",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWTToken = async function(){
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "secretkey", { expiresIn: "1h" });
  return token;
}

userSchema.methods.passwordMatches = async function(passwordByUser){
  const user = this;
  const isMatchPass = await bcrypt.compare(passwordByUser, user.password)
  return isMatchPass;
}

module.exports = mongoose.model('User', userSchema);

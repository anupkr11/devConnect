const mongoose = require('mongoose');

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
      required: true,
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

module.exports = mongoose.model('User', userSchema);

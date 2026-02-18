const express = require('express');
const authRouter = express.Router();
const User = require("../models/user");
// const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateData } = require("../utils/validate");


authRouter.post("/signup", async (req, res) => {
  try {
    validateData(req);
    const { firstName, lastName, email, password, about, photoURL } = req.body;
    const passHash = await bcrypt.hash(password, 10);
    const user = new User(
      { firstName, lastName, email, password: passHash, about, photoURL },
      // firstName: "John",
      // lastName: "Doe",
      // email: "john.doe@example.com",
      // age: 28,
      // password: "securepassword",
    );

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // validateData(req);
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User not found");
    }
    const isPasswordValid = await user.passwordMatches(password);
    if (isPasswordValid) {
      //create jwt token
      const token = await user.getJWTToken();
      //add the token to cookie and send response back to client
      res.cookie("token", token, {expires: new Date(Date.now() + 3600000)});

      res.send(user);
    } else {
      throw new Error("Invalid password");
    }
  } catch (err) {
    res.status(400).send("Login failed: " + err.message);
  }
});

authRouter.post("/logout", async(req, res) => {
    try{
        res.cookie("token", null, {expires: new Date(Date.now())});
        res.send("Logout successful");
    }
    catch(err){
        res.status(400).send("Logout failed: " + err.message);
    }
})

module.exports = authRouter;
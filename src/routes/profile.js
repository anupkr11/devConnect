const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validate");
const { passwordCheck } = require("../utils/validate");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (err) {
    res.status(400).send("Error fetching profile: " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid fields for profile edit");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });
    await loggedInUser.save();
    res.send("Profile updated successfully");
  } catch (err) {
    res.status(400).send("Error editing profile: " + err.message);
  }
});

profileRouter.patch("/profile/forgotPassword", userAuth, async (req, res) => {
  try {
    if (!passwordCheck(req)) {
      throw new Error("Invalid fields for password change");
    }
    const loggedInUser = req.user;
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    loggedInUser.password = hashedPassword;
    await loggedInUser.save();
    res.send("Password changed successfully");
  } catch (err) {
    res.status(400).send("Error changing password: " + err.message);
  }
});

module.exports = profileRouter;

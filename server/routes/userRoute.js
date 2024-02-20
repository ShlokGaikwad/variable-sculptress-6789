const express = require("express");
const UserModel = require("../models/userModel");
const BlacklistModel = require("../models/blacklistModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

userRouter.post("/signup", async (req, res) => {
  const { username, email, password, image, role, totalScore } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res
        .status(409)
        .json({ message: "User already exists! please use different email" });
    } else {
      const pass =
        /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
      if (!pass.test(password)) {
        res.status(409).json({
          message:
            "password should be 8 characters,one uppercase,one special character,one number",
        });
      } else {
        const hashPass = await bcrypt.hash(password, 5);
        const user = new UserModel({ ...req.body, password: hashPass });
        await user.save();
        res.status(200).send({ msg: "new user signup successfully", user });
      }
    }
  } catch (error) {
    // console.log(error.message);
    res.status(400).json({ message: error });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        const token = jwt.sign({ id: user._id }, process.env.tokenCode, {
          expiresIn: "7d",
        });
        res.cookie("token", token);
        res.status(200).json({ msg: "Login Successfully", token });
      } else {
        res.status(409).json({
          message: "Password incorrect! please enter correct password",
        });
      }
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

userRouter.get("/logout", async (req, res) => {
  const token = req.cookies.token;
  try {
    const logout = new BlacklistModel({ token });
    await logout.save();
    res.status(200).json({ msg: "Logout Successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

module.exports = userRouter;

const express = require("express");
const UserModel = require("../models/userModel");
const BlacklistModel = require("../models/blacklistModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

const uploadImageMiddleware = require('../middleware/uploadImage');

userRouter.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, image } = user; 
    res.status(200).json({ username, image });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/signup", uploadImageMiddleware('image'), async (req, res) => {
  const { username, email, password, role, totalScore } = req.body;
  const imagePath = req.imagePath;

  try {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists! Please use a different email" });
    }

    const passwordRegex = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    if (!passwordRegex.test(password)) {
      return res.status(409).json({ success: false, message: "Password should be 8 characters, one uppercase, one special character, one number" });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new UserModel({ username, email, password: hashedPassword, role, totalScore, image: imagePath });

    await newUser.save();
    
    res.status(200).json({ success: true, message: "New user signed up successfully", user: newUser });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
        const userId = user._id;
        res.cookie("userId", userId);

        res.status(200).json({ msg: "Login Successfully", token, userId});
      } else {
        res.status(409).json({
          message: "Password incorrect! please enter correct password",
        });
      }
    });
  } catch (error) {
    res.status(400).json({error });
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

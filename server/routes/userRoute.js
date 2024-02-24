const express = require("express");
const UserModel = require("../models/userModel");
const BlacklistModel = require("../models/blacklistModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

const uploadMiddleware = require("../middleware/uploadImage");

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

userRouter.get("/user", async (req, res) => {
  try {
    const sortOpt = req.query.sort || "totalScore";
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const limit = parseInt(req.query.limit) || 5;
    const users = await UserModel.find()
      .sort({ [sortOpt]: sortOrder })
      .limit(limit);
    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post(
  "/signup",
  async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
      const existingUser = await UserModel.findOne({ email });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User already exists! Please use a different email",
        });
      }

      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

      console.log("Password:", password);
      console.log("Regex Test Result:", passwordRegex.test(password));

      if (!passwordRegex.test(password)) {
        return res.status(409).json({
          success: false,
          message:
            "Password should be 8 characters, one uppercase, one special character, one number",
        });
      }

      // User signup success
      next();
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },
  async (req, res) => {
    const { username, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 5);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
      });
      console.log(newUser);
      await newUser.save();

      res.status(200).json({
        success: true,
        message: "New user signed up successfully",
        user: newUser,
      });
    } catch (error) {
      console.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

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

        res.status(200).json({ msg: "Login Successfully", token, userId });
      } else {
        res.status(409).json({
          message: "Password incorrect! please enter correct password",
        });
      }
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

userRouter.get("/sort");

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

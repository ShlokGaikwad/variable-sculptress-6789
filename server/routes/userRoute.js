const express = require("express");
const UserModel = require("../models/userModel");
const BlacklistModel = require("../models/blacklistModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();

const uploadMiddleware = require("../middleware/uploadImage");
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API operations related to users
 */

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to get
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               username: "JohnDoe"
 *               image: "profile.jpg"
 *               totalScore: 100
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.get("/user/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, image, totalScore } = user;
    res.status(200).json({ username, image, totalScore });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * @swagger
 * /user:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               - username: "JohnDoe"
 *                 image: "profile.jpg"
 *                 totalScore: 100
 *               - username: "JaneDoe"
 *                 image: "avatar.jpg"
 *                 totalScore: 150
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
userRouter.get("/user", async (req, res) => {
  try {
    const sortOpt = req.query.sort || "totalScore";
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const limit = parseInt(req.query.limit);
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
/**
 * @swagger
 * /signup:
 *   post:
 *     tags: [Users]
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             username: "JohnDoe"
 *             email: "john@example.com"
 *             password: "Password123@"
 *     responses:
 *       '200':
 *         description: User signed up successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "New user signed up successfully"
 *               user:
 *                 username: "JohnDoe"
 *                 email: "john@example.com"
 *                 password: "$2b$05$..."
 *                 image: ""
 *                 totalScore: 0
 *       '409':
 *         description: User already exists or invalid password format
 *         content:
 *           application/json:
 *             examples:
 *               conflict:
 *                 value:
 *                   success: false
 *                   message: "User already exists! Please use a different email"
 *               passwordError:
 *                 value:
 *                   success: false
 *                   message: "Password should be 8 characters, one uppercase, one special character, one number"
 *       '500':
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               message: "Internal Server Error"
 */
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

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Users]
 *     summary: Log in as a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: "john@example.com"
 *             password: "Password123@"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               msg: "Login Successfully"
 *               token: "eyJhbGciOiJIUzI1NiIsIn..."
 *               userId: "607d2e17f40a3e4f98bd1414"
 *       400:
 *         description: Invalid credentials or server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Error details"
 */
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
        const { totalScore } = user;
        res.status(200).json({ msg: "Login Successfully", token, userId , totalScore });
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

userRouter.patch("/:id", uploadMiddleware("image"), async (req, res) => {
  const { id } = req.params;
  const  {image , totalScore}  = req.body;
  console.log(`Image path is : ${req.imagePath} , id is : ${id} and the image is ${image}`)
  try {
    const user = await UserModel.findByIdAndUpdate(id, { image: req.imagePath , totalScore });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ error });
  }
});

userRouter.get("/sort");
/**
 * @swagger
 * /logout:
 *   get:
 *     tags: [Users]
 *     summary: Log out the current user
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               msg: "Logout Successfully"
 *       400:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: "Error details"
 */
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

const jwt = require("jsonwebtoken");
const BlacklistModel = require("../models/blacklistModel");
const UserModel = require("../models/userModel");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.tokenCode, async (err, decoded) => {
    const blacklistToken = await BlacklistModel.findOne({ token });
    if (blacklistToken) {
      res
        .status(409)
        .send({ message: "Token is expired! Please login again." });
    } else {
      try {
        if (decoded) {
          const user = await UserModel.findOne({ _id: decoded.id });
          req.role = user.role;
          req.id = decoded.id;
          next();
        } else {
          res.status(409).send(err);
        }
      } catch (error) {
        console.log(error.message);
        res.status(404).send(error);
      }
    }
  });
};

module.exports = auth;

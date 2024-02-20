const express = require("express");
const cookieParser = require("cookie-parser");
const connection = require("./config/db");
const userRouter = require("./routes/userRoute");
require("dotenv").config();

const app = express();
app.use(express.json(), cookieParser());
app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({ msg: "Home page" });
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log(
      `Server is running on port ${process.env.port} and DB is Connected`
    );
  } catch (error) {
    console.log(error);
  }
});

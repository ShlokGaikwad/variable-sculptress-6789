const express = require("express");
const cookieParser = require("cookie-parser");
const connection = require("./config/db");
const userRouter = require("./routes/userRoute");
const resultRoutes = require('./routes/resultRoute');
const historyRoutes = require('./routes/historyRoute');
const questionRouter = require("./routes/questionRoute");
const roomRouter = require("./routes/roomRoute");
require("dotenv").config();

const app = express();
app.use(express.json(), cookieParser());
app.use("/users", userRouter);
app.use("/questions",questionRouter)
app.use('/results', resultRoutes);
app.use('/history', historyRoutes);
app.use('/rooms',roomRouter)
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

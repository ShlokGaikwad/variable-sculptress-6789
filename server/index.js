const express = require("express");
const cors = require('cors');
const cookieParser = require("cookie-parser");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); 
const connection = require("./config/db");
const userRouter = require("./routes/userRoute");
const resultRoutes = require('./routes/resultRoute');
const historyRoutes = require('./routes/historyRoute');
const questionRouter = require("./routes/questionRoute");
const languageRoutes = require('./routes/languageRoute');
const roomRouter = require("./routes/roomRoute");
const getImage = require('./routes/getImageRoute');
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json(), cookieParser());
app.use("/users", userRouter);
app.use("/questions",questionRouter)
app.use('/results', resultRoutes);
app.use('/history', historyRoutes);
app.use('/languages', languageRoutes);
app.use('/rooms',roomRouter)
app.use('/uploads' , getImage )
app.use('/api-docs', swaggerUi.serve);

app.get('/api-docs', swaggerUi.setup(swaggerSpec));
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

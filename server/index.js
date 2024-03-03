const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const cookieParser = require("cookie-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const connection = require("./config/db");
const userRouter = require("./routes/userRoute");
const resultRoutes = require("./routes/resultRoute");
const questionRouter = require("./routes/questionRoute");
const languageRoutes = require("./routes/languageRoute");
const getImage = require("./routes/getImageRoute");
const uploadRoute = require("./routes/upload");
const recordingRoutes = require("./routes/recordingRoutes");
const { getQuizQuestions } = require("./quizUtils");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json(), cookieParser());

const rooms = {};
const users = {};
const quizQuestions = [];
let currentQuestionIndex = 0;

async function initializeQuizQuestions() {
  try {
    const questions = await getQuizQuestions();
    quizQuestions.push(...questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
  }
}

initializeQuizQuestions();

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", ({ username, roomName }) => {
    socket.join(roomName);
    users[socket.id] = { username, roomName, score: 0 };
    updateRoomUserCount(roomName);

    if (getUsersInRoom(roomName).length === 2) {
      startQuiz(roomName);
    }
  });

  socket.on("createRoom", ({ username, roomName }) => {
    socket.join(roomName);
    users[socket.id] = { username, roomName, score: 0 };
    updateRoomUserCount(roomName);
  });

  socket.on("submitAnswer", ({ roomName, answer }) => {
    const user = users[socket.id];
  
    if (user) {
      handleAnswer(socket, user, roomName, answer);
    } else {
      console.error("User not found:", socket.id);
    }
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket.id);
  });
});

function startQuiz(roomName) {
  const firstQuestion = quizQuestions[0];
  io.to(roomName).emit("startQuiz", firstQuestion);
}

function handleAnswer(socket, user, roomName, answer) {
  const currentQuestion = quizQuestions[currentQuestionIndex];

  if (answer === currentQuestion.answerIndex) {
    user.score += 1;
  }

  socket.emit("answerResult", {
    correct: answer === currentQuestion.answerIndex,
    userScore: user.score,
  });

  if (currentQuestionIndex + 1 < quizQuestions.length) {
    currentQuestionIndex += 1;
    const nextQuestion = quizQuestions[currentQuestionIndex];

    socket.emit("question", nextQuestion); // Emit only to the socket that submitted the answer

    if (currentQuestionIndex === quizQuestions.length - 1) {
      endQuiz(io, roomName);
    }
  } else {
    endQuiz(io, roomName);
  }
}

function endQuiz(io, roomName) {
  const finalScores = calculateFinalScores(roomName);
  io.to(roomName).emit("gameOver", { finalScores });

  // Notify users individually about the game result
  finalScores.forEach((user) => {
    const message = user.isWinner ? "Congratulations! You won!" : "Oops! You lost!";
    io.to(user.socketId).emit("gameResult", { message, score: user.score });
  });

  // Reset the quiz state
  currentQuestionIndex = 0;
}

function handleDisconnect(socketId) {
  const user = users[socketId];

  if (user) {
    const roomName = user.roomName;
    delete users[socketId];
    updateRoomUserCount(roomName);
  }

  console.log("A user disconnected");
}

function updateRoomUserCount(roomName) {
  io.to(roomName).emit("updateUserCount", getUsersInRoom(roomName).length);
}

function getUsersInRoom(roomName) {
  return Object.values(users).filter((user) => user.roomName === roomName);
}

function calculateFinalScores(roomName) {
  const usersInRoom = getUsersInRoom(roomName);
  const sortedUsers = usersInRoom.sort((a, b) => b.score - a.score);

  const finalScores = sortedUsers.map((user, index) => ({
    username: user.username,
    score: user.score,
    isWinner: index === 0,
    socketId: user.socketId, // Include the socketId in the finalScores
  }));

  return finalScores;
}

app.use("/api", recordingRoutes);
app.use("/users", userRouter);
app.use("/questions", questionRouter);
app.use("/results", resultRoutes);
app.use("/languages", languageRoutes);
app.use("/uploads", getImage);
app.use("/api-docs", swaggerUi.serve);
app.use("/api", uploadRoute);

app.get("/api-docs", swaggerUi.setup(swaggerSpec));
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Home page" });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Server is running on port ${PORT} and DB is Connected`);
  } catch (error) {
    console.log(error);
  }
});

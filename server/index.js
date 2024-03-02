const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const connection = require('./config/db');
const userRouter = require('./routes/userRoute');
const resultRoutes = require('./routes/resultRoute');
const questionRouter = require('./routes/questionRoute');
const languageRoutes = require('./routes/languageRoute');
const getImage = require('./routes/getImageRoute');
const uploadRoute = require('./routes/upload');
const { getQuizQuestions } = require('./quizUtils');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5550",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json(), cookieParser());

const rooms = {};
const users = {};

const quizQuestions = [];

async function initializeQuizQuestions() {
  try {
    const questions = await getQuizQuestions();
    quizQuestions.push(...questions);
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
  }
}

initializeQuizQuestions();

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', ({ username, roomName }) => {
    socket.join(roomName);
  
    // Add the user to the users object
    users[socket.id] = { username, roomName, score: 0 };
  
    // Emit the user count
    updateRoomUserCount(roomName);
    console.log("log" , getUsersInRoom(roomName).length);
    // Check if this is the first user in the room to start the quiz
    if (getUsersInRoom(roomName).length === 2) {
      const firstQuestion = quizQuestions[0];
      console.log('Emitting startQuiz event:', firstQuestion);

      io.to(roomName).emit('startQuiz', firstQuestion);
    }
  });

  socket.on('createRoom', ({ username, roomName }) => {
    socket.join(roomName);
    
    // Add the user to the users object
    users[socket.id] = { username, roomName, score: 0 };

    // Emit the user count
    updateRoomUserCount(roomName);
  });

  socket.on('submitAnswer', ({ roomName, answer }) => {
    const user = users[socket.id];

    if (user) {
      const currentQuestion = quizQuestions[user.score];

      // Check if the answer is correct and update the user's score
      if (answer === currentQuestion.correctOption) {
        user.score += 1;
      }

      io.to(roomName).emit('answerResult', { correct: answer === currentQuestion.correctOption, userScore: user.score });

      // Increment the user's score
      user.score += 1;

      // Display the next question if available
      if (user.score < quizQuestions.length) {
        const nextQuestion = quizQuestions[user.score];
        io.to(roomName).emit('question', nextQuestion);
      } else {
        // All questions answered, end the game
        io.to(roomName).emit('gameOver');
      }
    } else {
      console.error('User not found:', socket.id);
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    
    if (user) {
      const roomName = user.roomName;
      delete users[socket.id];
      updateRoomUserCount(roomName);
    }

    console.log('A user disconnected');
  });
});

function updateRoomUserCount(roomName) {
  io.to(roomName).emit("updateUserCount", getUsersInRoom(roomName).length);
}

function getUsersInRoom(roomName) {
  console.log("no of people in room", Object.values(users).filter((user) => user.roomName === roomName));
  return Object.values(users).filter((user) => user.roomName === roomName);
}

app.use('/users', userRouter);
app.use('/questions', questionRouter);
app.use('/results', resultRoutes);
app.use('/languages', languageRoutes);
app.use('/uploads', getImage);
app.use('/api-docs', swaggerUi.serve);
app.use('/api', uploadRoute);

app.get('/api-docs', swaggerUi.setup(swaggerSpec));
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Home page' });
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

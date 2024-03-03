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
  const recordingRoutes = require('./routes/recordingRoutes');

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
  let currentQuestionIndex = 0; // Initialize the index to the first question

  initializeQuizQuestions();

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', ({ username, roomName }) => {
      console.log("line 58",roomName);
      socket.join(roomName);
    
      users[socket.id] = { username, roomName, score: 0 };
    
      updateRoomUserCount(roomName);
      console.log("log" , getUsersInRoom(roomName).length);
      if (getUsersInRoom(roomName).length === 2) {
        const firstQuestion = quizQuestions[0];
        console.log('Emitting startQuiz event:', firstQuestion);

        io.to(roomName).emit('startQuiz', firstQuestion);
      }
    });

    socket.on('createRoom', ({ username, roomName }) => {
      socket.join(roomName);
      
      users[socket.id] = { username, roomName, score: 0 };

      updateRoomUserCount(roomName);
    });


    socket.on('submitAnswer', ({ roomName, answer }) => {
      const user = users[socket.id];
      console.log("lione 84",roomName)
  
      if (user) {
          const currentQuestion = quizQuestions[currentQuestionIndex];
  
          console.log('User:', user);   
          if (answer === currentQuestion.answerIndex) {
              user.score += 1;
          }
  
          console.log('User Score:', user.score);
  
          io.to(roomName).emit('answerResult', { correct: answer === currentQuestion.answerIndex, userScore: user.score });
  
          if (currentQuestionIndex + 1 < quizQuestions.length) {
              currentQuestionIndex += 1;
              console.log('Moving to Next Question. Index:', currentQuestionIndex);
  
              const nextQuestion = quizQuestions[currentQuestionIndex];
  
                socket.emit('question', nextQuestion);
                console.log("Next question emitted to:", socket.id);
              // socket.emit("question",nextQuestion);
              console.log("event triggered",roomName);
          } else {
              console.log('Game Over');
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
  
  app.use('/api', recordingRoutes);
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

document.addEventListener("DOMContentLoaded", () => {
  const socket = io("http://localhost:3000", {
    transports: ["websocket"],
  });

  // https://variable-sculptress-6789-e41a.onrender.com

  const roomSetupSection = document.getElementById("room-setup-section");
  const quizSection = document.getElementById("quiz-section");
  const usernameInput = document.getElementById("username");
  const roomNameInput = document.getElementById("roomName");
  const joinRoomButton = document.getElementById("joinRoomButton");
  const createRoomButton = document.getElementById("createRoomButton");
  const userCountElement = document.getElementById("user-count");
  const scoreElement = document.getElementById("score");
  const questionCountElement = document.getElementById("question-count");
  const questionTextElement = document.getElementById("question-text");
  const codeContainer = document.getElementById("codeContainer");
  const optionsContainers = [
    document.getElementById("options-container1"),
    document.getElementById("options-container2"),
    document.getElementById("options-container3"),
    document.getElementById("options-container4"),
  ];
  const submitButton = document.getElementById("submit-button");
  const nextButton = document.getElementById("next-button");
  const otherUsersScores = document.getElementById("other-users-scores");

  let currentUser = {};
  let quizQuestions = [];
  let roomName;
  let count = 1;

  joinRoomButton.addEventListener("click", () => {
    const username = usernameInput.value;
    roomName = roomNameInput.value;
    if (username && roomName) {
      socket.emit("joinRoom", { username, roomName });
      hideRoomSetup();
    }
  });

  // Client-side code to create a room
  createRoomButton.addEventListener("click", () => {
    const username = usernameInput.value;
    roomName = roomNameInput.value; // Get the room name from the input field
    console.log(username, roomName, "line 41");
    if (username && roomName) {
      socket.emit("createRoom", { username, roomName });
      hideRoomSetup();
    }
  });

  submitButton.addEventListener("click", () => {
    const selectedOption = getSelectedOption();
    if (selectedOption !== null) {
      console.log(selectedOption, "selected option", roomName);
      socket.emit("submitAnswer", {
        roomName: roomName,
        answer: selectedOption,
      });
      clearOptions();
    }
  });

  socket.on("updateUserCount", (userCount) => {
    userCountElement.textContent = userCount;
  });

  socket.on("startQuiz", (firstQuestion) => {
    console.log("Quiz started:", firstQuestion);
    startQuiz(firstQuestion);
  });

  socket.on("question", (question) => {
    console.log("Current question : ", question);
    displayQuestion(question);
    console.log("Called display function");
    enableButton(submitButton);
    disableButton(nextButton);
  });

  socket.on("answerResult", ({ correct, userScore }) => {
    // displayAnswerResult(correct, userScore);
  });

  socket.on("gameOver", () => {
    displayGameOver();
  });

  function hideRoomSetup() {
    roomSetupSection.style.display = "none";
    quizSection.style.display = "block";
  }

  function startQuiz(firstQuestion) {
    quizQuestions = [];
    currentUser = { score: 0, roomName: roomName };
    console.log("line 93", currentUser);
    quizQuestions.push(firstQuestion);
    displayQuestion(firstQuestion);
  }

  function displayQuestion(question) {
    questionCountElement.textContent = count++;
    questionTextElement.textContent = question.description;

    if (question.code) {
      codeContainer.textContent = question.code;
      codeContainer.classList.remove("hid");
      Prism.highlightElement(codeContainer);
    } else {
      codeContainer.classList.add("hid");
    }

    displayOptions(question.options);
  }

  function displayOptions(options) {
    optionsContainers.forEach((container, index) => {
      container.textContent = options[index];
      container.classList.remove("selected");
      container.addEventListener("click", () => {
        selectOption(index);
      });
    });

    enableOptions();
  }

  function selectOption(index) {
    optionsContainers.forEach((container, i) => {
      if (i === index) {
        container.classList.add("selected");
        enableButton(submitButton);
      } else {
        container.classList.remove("selected");
      }
    });
  }

  function getSelectedOption() {
    for (let i = 0; i < optionsContainers.length; i++) {
      if (optionsContainers[i].classList.contains("selected")) {
        enableButton(submitButton);
        return i;
      }
    }
    disableButton(submitButton); // Disable the submit button if no option is selected
  }

  function enableOptions() {
    optionsContainers.forEach((container) => {
      container.classList.remove("disabled");
    });
  }

  function disableOptions() {
    optionsContainers.forEach((container) => {
      container.classList.add("disabled");
    });
  }

  function displayAnswerResult(correct, userScore) {
    if (correct) {
      showMessage("Correct!", "green");
    } else {
      showMessage("Incorrect", "red");
    }
    currentUser.score = userScore;
    scoreElement.textContent = userScore;
    enableButton(nextButton);
  }

  function displayGameOver() {
    showMessage("Game Over", "blue");
    disableOptions();
    disableButton(submitButton);
    disableButton(nextButton);
  }

  function showMessage(message, color) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.color = color;
    otherUsersScores.appendChild(messageDiv);
  }

  function enableButton(button) {
    button.classList.remove("disabled");
  }

  function disableButton(button) {
    button.classList.add("disabled");
  }

  function clearOptions() {
    optionsContainers.forEach((container) => {
      container.classList.remove("selected");
    });
  }
});

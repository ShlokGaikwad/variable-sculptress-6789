
const BASE_URL = 'http://localhost:3000';

document.addEventListener("DOMContentLoaded", async function () {
  let model = {
    resultTitle : "quiz",
    userId : localStorage.getItem("userId"),
    questions : [],
    answers : [] ,
    correctAnswer :[],
    totalScore : 0,
    correctCount : 0,
    incorrectCount : 0
  }

  const codeContainer = document.getElementById("codeContainer");
  let question = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];
  let userAnswer = Array.from({ length: 10 }, () => "-");
  let selectedOptionIndex = null;
  let timerInterval;
  let incorrectAnswer = 0;
  let rightAnswer = [];

  const questionCountElement = document.getElementById("question-count");
  const questionTextElement = document.getElementById("question-text");
  const optionsContainers = Array.from({ length: 4 }, (_, index) =>
    document.getElementById(`options-container${index + 1}`)
  );
  const submitButton = document.getElementById("submit-button");
  const nextButton = document.getElementById("next-button");
  const scoreElement = document.getElementById("score");

  submitButton.addEventListener("click", handleOptionSubmission);

  function handleOptionSubmission() {
    lockOptions();
    const currentQuestion = questions[currentQuestionIndex];
    rightAnswer.push(currentQuestion.options[currentQuestion.answerIndex]);

    if (currentQuestion && selectedOptionIndex !== null) {
      const selectedOption = optionsContainers[selectedOptionIndex];
      updateAnswersAndScore(currentQuestion, selectedOption);
    }

    submitButton.classList.add("disabled");
    nextButton.classList.remove("disabled");
  }

  function updateAnswersAndScore(currentQuestion, selectedOption) {
    userAnswer[currentQuestionIndex] = selectedOption.textContent;
    selectedOption.classList.remove("selected", "correct", "wrong");

    if (currentQuestion.answerIndex === selectedOptionIndex) {
      handleCorrectAnswer(selectedOption);
    } else {
      handleIncorrectAnswer(selectedOption, currentQuestion);
    }
  }

  function lockOptions() {
    optionsContainers.forEach((container) => container.classList.add("locked"));
  }

  function handleCorrectAnswer(selectedOption) {
    selectedOption.classList.add("correct");
    score += 10;
    scoreElement.textContent = score;
  }

  function handleIncorrectAnswer(selectedOption, currentQuestion) {
    incorrectAnswer += 10;
    selectedOption.classList.add("wrong");
    optionsContainers[currentQuestion.answerIndex].classList.add("correct");
  }

  nextButton.addEventListener("click", handleNextButtonClick);

  function handleNextButtonClick() {
    
    clearOptionSelection();
    resetOptionsContainers();
    codeContainer.innerHTML = "";
    resetTimer();
    updateProgressBar();
    currentQuestionIndex++;

    if (currentQuestionIndex < Math.min(10, questions.length)) {
      updateQuestion();
    } else {
      saveQuizResults();
      endQuiz();
    }
  }
  function updateProgressBar() {
    let progress = (currentQuestionIndex / 8) * 100;
    document.querySelector(".progress").style.width = progress + "%";
  }
  window.handleNextButtonClick = handleNextButtonClick;

  function resetOptionsContainers() {
    optionsContainers.forEach((container) =>
      container.classList.remove("locked", "correct", "wrong")
    );
  }

  function endQuiz() {
    submitResults();
    scoreElement.textContent = score;
    setTimeout(function () {
      window.location.href = "../pages/result.html";
    }, 500);   
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timePassed = 0;
  }

  function updateQuestion() {
    resetTimer();
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion) {
      questionCountElement.textContent = currentQuestionIndex + 1;
      questionTextElement.textContent = currentQuestion.description;
      question.push(currentQuestion.description);

      const codePresent = currentQuestion.code ? true : false;
      codeContainer.classList.toggle("hid", !codePresent);

      if (codePresent) {
        displayCode(currentQuestion.code);
      }

      updateOptionsContainers(currentQuestion.options);
    } else {
      console.error("No question found at index:", currentQuestionIndex);
    }
  }

  function displayCode(code) {
    const preElement = document.createElement("pre");
    const codeElement = document.createElement("code");
    const languageClass = `language-${language.toLowerCase()}`;
    codeElement.className = languageClass;
    codeElement.textContent = code;
    preElement.appendChild(codeElement);
    codeContainer.innerHTML = "";
    codeContainer.appendChild(preElement);
    Prism.highlightElement(codeElement);
  }

  function updateOptionsContainers(options) {
    optionsContainers.forEach((container, index) => {
      const optionElement = createOptionElement(options[index], index);
      container.innerHTML = "";
      container.appendChild(optionElement);
    });
  }

  function createOptionElement(text, index) {
    const optionElement = document.createElement("div");
    optionElement.classList.add("option");
    optionElement.textContent = text;

    optionElement.addEventListener("click", () => handleOptionClick(index));

    return optionElement;
  }

  function handleOptionClick(selectedIndex) {
    if (optionsContainers[selectedIndex].classList.contains("locked")) {
      return;
    }

    clearOptionSelection();

    if (selectedIndex !== null) {
      selectedOptionIndex = selectedIndex;
      optionsContainers[selectedIndex].classList.add("selected");
      submitButton.classList.remove("disabled");
    }
  }

  function clearOptionSelection() {
    if (selectedOptionIndex !== null) {
      optionsContainers[selectedOptionIndex].classList.remove(
        "selected",
        "correct",
        "wrong"
      );
      selectedOptionIndex = null;
    }
  }

  async function fetchQuestions(language) {
    try {
      const response = await fetch(`${BASE_URL}/questions?lang=${language}`);
      console.log(language);
      const data = await response.json();
      console.log(data);

      if (data.msg && Array.isArray(data.msg)) {
        if (data.msg.length > 0) {
          questions = data.msg;
          startQuiz();
        } else {
          console.error(
            "The server responded with an empty array of questions."
          );
        }
      } else {
        console.error(
          "No questions found or invalid response from the server:",
          data
        );
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  async function startQuiz() {
    shuffleQuestions();
    questions = questions.slice(0, 10);
    updateQuestion();
  }

  function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
  }

  // Get language from localStorage
  let language = localStorage.getItem("lang") || "";
  if (language === "javaScript") {
    language = "JavaScript";
  } else if (language === "C++") {
    language = "c%2B%2B";
  } else if (language === "HTML/CSS") {
    language = "html%2Fcss";
  }

  // Fetch Questions
  await fetchQuestions(language);

  async function submitResults() {
    const resultData = {
      userId: localStorage.getItem("userId"),
      resultTitle: calculateResultTitle(score),
      questions: question,
      answers: userAnswer,
      correctAnswers: rightAnswer,
      totalScore: score,
      correctCount: localStorage.getItem("correctAnswer") / 10,
      incorrectCount: localStorage.getItem("incorrectAnswer") / 10,
      languageName : localStorage.getItem("lang"),
    };
    console.log(typeof parseInt(localStorage.getItem("correctAnswer") / 10));
    localStorage.setItem("resultData", JSON.stringify(resultData));
    const token = localStorage.getItem('token');
    console.log(resultData);
    try {
      const response = await fetch(`${BASE_URL}/results/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(resultData),
      });

      if (response.ok) {
        console.log('Results submitted successfully');
      } else {
        console.error('Failed to submit results:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting results:', error);
    }
    const userId = localStorage.getItem('userId');
    const tot = Number(localStorage.getItem("totalScoreOfUser")) + Number(score);
    console.log(tot);
    try {
      const userResponse = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ totalScore: tot }),
      });
      
      if (userResponse.ok) {
        console.log('User totalScore updated successfully');
      } else {
        console.error('Failed to update user totalScore:', userResponse.statusText);
      }
    } catch (userError) {
      console.error('Error updating user totalScore:', userError);
    }
    localStorage.setItem("totalScoreOfUser", Number(localStorage.getItem("totalScoreOfUser")) + Number(score));
  }

  function saveQuizResults() {
    localStorage.setItem("questions", JSON.stringify(question));
    localStorage.setItem("userAnswer", JSON.stringify(userAnswer));
    localStorage.setItem("rightAnswer", JSON.stringify(rightAnswer));
    localStorage.setItem("incorrectAnswer", incorrectAnswer);
    localStorage.setItem("correctAnswer", score);
  }

  function calculateResultTitle(score) {
    if (score === 100) {
      return "perfect";
    } else if (score >= 90) {
      return "excellent";
    } else if (score >= 80) {
      return "great";
    } else if (score >= 70) {
      return "good";
    } else if (score >= 60) {
      return "above average";
    } else if (score >= 50) {
      return "average";
    } else if (score >= 40) {
      return "below average";
    } else if (score >= 30) {
      return "poor";
    } else {
      return "very poor";
    }
  }

  function askForScreenShareReady() {
    console.log("Entering askForScreenShareReady");
    return new Promise(function (resolve) {
      try {
        const isReady = confirm("Are you ready to share your screen? Click OK when ready.");
  
        if (isReady || isReady === undefined) {
          console.log("Resolved with true in askForScreenShareReady");
          resolve(true);
        } else {
          console.log("Resolved with false in askForScreenShareReady");
          resolve(false);
        }
      } catch (error) {
        console.error("Error in askForScreenShareReady:", error);
        console.log("Resolved with false in askForScreenShareReady (error case)");
        resolve(false);
      }
    });
  }
  
  function accessCamera() {
    return new Promise(function (resolve, reject) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          const videoElement = document.createElement("video");
          videoElement.srcObject = stream;
          videoElement.play();
          
          // Append the video element to the video-container
          const videoContainer = document.getElementById("video-container");
          videoContainer.appendChild(videoElement);
          makeDraggable(videoContainer);

  
          resolve();
        })
        .catch(function (error) {
          console.error("Error accessing camera:", error);
          reject(error);
        });
    });
  }
  

  // Function to access screen share
  function accessScreenShare() {
    return new Promise(function (resolve, reject) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then(function (stream) {
          // ... (any relevant code)
          resolve();
        })
        .catch(function (error) {
          console.error("Error accessing screen share:", error);
          reject(error);
        });
    });
  }
  
  // Check if getUserMedia and screen sharing are supported
  if (
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    navigator.mediaDevices.getDisplayMedia
  ) {
    // Ask for screen share readiness
    askForScreenShareReady()
    .then(async function (isScreenShareReady) {
      console.log("isScreenShareReady:", isScreenShareReady);
  
      if (isScreenShareReady) {
        try {
          console.log("Accessing camera...");
          // Access camera
          await accessCamera();
          console.log("Camera access successful.");
  
          console.log("Accessing screen share...");
          // Access screen share
          await accessScreenShare();
          console.log("Screen share access successful.");
  
          console.log("Updating...");
          // Update
          await update();
          console.log("Update successful.");
        } catch (error) {
          console.error("Error accessing camera, screen share, or updating:", error);
          alert("Error accessing camera, screen share, or updating. Please allow access and reload the page to start the quiz.");
          location.reload();
        }
      } else {
        alert("Screen share canceled. Please reload the page when you are ready.");
        location.reload();
      }
    })
    .catch(function (error) {
      console.error("Error asking for screen share readiness:", error);
      alert("Error asking for screen share readiness. Please reload the page to start the quiz.");
      location.reload();
    });
  } else {
    console.error("getUserMedia or screen sharing is not supported");
    alert(
      "Camera or screen sharing not supported. Please use a browser that supports camera and screen sharing access and reload the page to start the quiz."
    );
    location.reload();
  }
  
  // Make Draggable function
  function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;
  
    element.classList.add("draggable");
  
    element.addEventListener("mousedown", function (e) {
      isDragging = true;
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
    });
  
    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        element.style.left = e.clientX - offsetX + "px";
        element.style.top = e.clientY - offsetY + "px";
      }
    });
  
    document.addEventListener("mouseup", function () {
      isDragging = false;
    });
  }
  let isCameraActive = false;
  function startQuizIfReady() {
    if (isCameraActive && isScreenShareActive) {
      startQuiz();
    }
  }
  startQuizIfReady();
  


  ////////////////////////////////   TIMER CODE ///////////////////////////

  var width = 150,
    height = 150,
    timePassed = 0,
    timeLimit = 26;

  var fields = [
    {
      value: timeLimit,
      size: timeLimit,
      update: function () {
        return (timePassed = timePassed + 1);
      },
    },
  ];

  var arc = d3.svg
    .arc()
    .innerRadius(width / 3 - 10)
    .outerRadius(width / 3 - 25)
    .startAngle(0)
    .endAngle(function (d) {
      return (d.value / d.size) * 2 * Math.PI;
    });

  var svg = d3
    .select(".container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var field = svg
    .selectAll(".field")
    .data(fields)
    .enter()
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .attr("class", "field");

  var back = field
    .append("path")
    .attr("class", "path path--background")
    .attr("d", arc);

  var path = field.append("path").attr("class", "path path--foreground");

  var label = field.append("text").attr("class", "label").attr("dy", ".35em");

  function pulseText() {
    back.classed("pulse", true);
    label.classed("pulse", true);

    if (timeLimit - timePassed >= 0) {
      label
        .style("font-size", "20px")
        .attr("transform", "translate(0," + +8 + ")")
        .text(function (d) {
          return d.size - d.value;
        });
    }

    label
      .transition()
      .ease("elastic")
      .duration(900)
      .style("font-size", "25px")
      .attr("transform", "translate(0," + -0 + ")");
  }

  function arcTween(b) {
    var i = d3.interpolate(
      {
        value: b.previous,
      },
      b
    );
    return function (t) {
      return arc(i(t));
    };
  }

  async function update() {
    field.each(function (d) {
      (d.previous = d.value), (d.value = d.update(timePassed));
    });

    path.transition().ease("elastic").duration(500).attrTween("d", arcTween);

    if (timeLimit - timePassed <= 10) {
      pulseText();
    } else {
      label.text(function (d) {
        return d.size - d.value;
      });
    }
    if (timePassed <= timeLimit) {
      setTimeout(update, 1000 - (timePassed % 1000));
    } else {
      destroyTimer();
    }
    if (timePassed == timeLimit) {
      handleNextButtonClick();
    }
  }

  ////////////////////////  TIMER CODE ENDS /////////////////
});

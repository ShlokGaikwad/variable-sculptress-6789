let question = [];
let rightAnswer = [] ;
let userAnswer = [] ;
let incorrectAnswer = 0;
let cnt = 0;
let per = 0;
red = setInterval(() => {
  let bar = document.querySelector(".progress");
  let percentage = setInterval(() => {
    per += 1;
    if (per >= cnt) clearInterval(percentage);
    // document.querySelector(".text").innerHTML = `<p>${per}%</p>`;
  }, 100);
  cnt += 1;

  if (cnt == 100) clearInterval(red);
  bar.style.width = cnt + "%";
  // console.log(cnt);
}, 1000);

// ================Timer=================

var width = 150,
  height = 150,
  timePassed = 0,
  timeLimit = 30;

var fields = [
  {
    value: timeLimit,
    size: timeLimit,
    update: function () {
      return (timePassed = timePassed + 1);
    },
  },
];

var nilArc = d3.svg
  .arc()
  .innerRadius(width / 3 - 33)
  .outerRadius(width / 3 - 33)
  .startAngle(0)
  .endAngle(2 * Math.PI);

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

function update() {
  field.each(function (d) {
    (d.previous = d.value), (d.value = d.update(timePassed));
  });

  path.transition().ease("elastic").duration(500).attrTween("d", arcTween);

  if (timeLimit - timePassed <= 10) pulseText();
  else
    label.text(function (d) {
      return d.size - d.value;
    });

  if (timePassed <= timeLimit) setTimeout(update, 1000 - (timePassed % 1000));
  else destroyTimer();
}

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
document.addEventListener("DOMContentLoaded", async function () {
  const questionCountElement = document.getElementById("question-count");
  const questionTextElement = document.getElementById("question-text");
  const optionsContainers = Array.from({ length: 4 }, (_, index) =>
    document.getElementById(`options-container${index + 1}`)
  );
  const submitButton = document.getElementById("submit-button");
  const nextButton = document.getElementById("next-button");
  const scoreElement = document.getElementById("score");
  const progressBar = document.querySelector(".progress");
  const videoContainer = document.getElementById("video-container");

  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];
  let selectedOptionIndex = null;
  let timerInterval;
  let isCameraActive = false;
  let isScreenShareActive = false;
  let question = [];
  let incorrectAnswer = 0;
  // Reset Timer function
  function resetTimer() {
    clearInterval(timerInterval);
    timePassed = 0;
    updateProgressBar();
  }

  // Update Progress Bar function
  function updateProgressBar() {
    let bar = document.querySelector(".progress");
    let percentage = parseInt(bar.style.width) || 0;
    percentage += 1;

    if (percentage <= 100) {
      bar.style.width = percentage + "%";
    } else {
      handleNextButtonClick();
      resetTimer();
    }
  }

  // Fetch Questions from Server
  async function fetchQuestions(language) {
    try {
      const response = await fetch(
        `https://variable-sculptress-6789-e41a.onrender.com/questions?lang=${language}`
      );
      const data = await response.json();

      if (data.msg && Array.isArray(data.msg) && data.msg.length > 0) {
        questions = data.msg;
        startQuiz();
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

  // Start Quiz function
  function startQuiz() {
    const totalQuestions = Math.min(10, questions.length);

    // Shuffle Questions
    function shuffleQuestions() {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    }

    shuffleQuestions();

    // Update Question function
    function updateQuestion() {
      resetTimer();
      const currentQuestion = questions[currentQuestionIndex];

      if (currentQuestion != "") {
        questionCountElement.textContent = currentQuestionIndex + 1;
        questionTextElement.textContent = currentQuestion.description;
        question.push(currentQuestion.description);
        // Check if the question has a code field
        const codeContainer = document.getElementById("codeContainer");
        codeContainer.classList.add("hid");
        if (currentQuestion.code) {
          codeContainer.classList.remove("hid");
          const preElement = document.createElement("pre");
          const codeElement = document.createElement("code");
          const languageClass = `language-${language.toLowerCase()}`;
          codeElement.className = languageClass;
          codeElement.textContent = currentQuestion.code;
          preElement.appendChild(codeElement);
          codeContainer.innerHTML = "";
          codeContainer.appendChild(preElement);
          Prism.highlightElement(codeElement);
        }

        optionsContainers.forEach((container, index) => {
          const optionElement = createOptionElement(
            currentQuestion.options[index],
            index
          );
          container.innerHTML = "";
          container.appendChild(optionElement);
        });
      } else {
        console.error("No question found at index:", currentQuestionIndex);
      }
    }

    // Create Option Element function
    function createOptionElement(text, index) {
      const optionElement = document.createElement("div");
      optionElement.classList.add("option");
      optionElement.textContent = text;

      optionElement.addEventListener("click", () => handleOptionClick(index));

      return optionElement;
    }

    // Handle Option Click function
    function handleOptionClick(selectedIndex) {
      if (optionsContainers[selectedIndex].classList.contains("locked")) {
        return;
      }

      clearOptionSelection();

      selectedOptionIndex = selectedIndex;
      optionsContainers[selectedIndex].classList.add("selected");
      submitButton.classList.remove("disabled");
    }

    // Clear Option Selection function
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

    // Handle Submit Button Click function
    submitButton.addEventListener("click", () => {
      optionsContainers.forEach((container) =>
        container.classList.add("locked")
      );

      const currentQuestion = questions[currentQuestionIndex];
      console.log("currentQuestions",currentQuestion);
      console.log("Right answer",currentQuestion.options[currentQuestion.answerIndex])
      rightAnswer.push(currentQuestion.options[currentQuestion.answerIndex]);
  
      if (currentQuestion && selectedOptionIndex !== null) {
        const selectedOption = optionsContainers[selectedOptionIndex];
        console.log("Your Answer :",selectedOption.textContent);
        userAnswer.push(selectedOption.textContent)
        selectedOption.classList.remove("selected", "correct", "wrong");

        if (currentQuestion.answerIndex === selectedOptionIndex) {
          selectedOption.classList.add("correct");
          score += 10;
          scoreElement.textContent = score;
        } else {
          incorrectAnswer += 10;
          selectedOption.classList.add("wrong");
          optionsContainers[currentQuestion.answerIndex].classList.add(
            "correct"
          );
        }
      }

      submitButton.classList.add("disabled");
      nextButton.classList.remove("disabled");
    });

    // Handle Next Button Click function
    nextButton.addEventListener("click", () => {
      clearOptionSelection();
      optionsContainers.forEach((container) =>
        container.classList.remove("locked", "correct", "wrong")
      );

      const codeContainer = document.getElementById("codeContainer");
      codeContainer.innerHTML = "";
      nextButton.className = "next-button";
      resetTimer();
      currentQuestionIndex++;

      if (currentQuestionIndex < totalQuestions) {
        updateQuestion();
      } else {
        localStorage.setItem("questions", JSON.stringify(question));
        localStorage.setItem("userAnswer",JSON.stringify(userAnswer));
        localStorage.setItem("rightAnswer",JSON.stringify(rightAnswer));
        localStorage.setItem("incorrectAnswer", incorrectAnswer);
        localStorage.setItem("correctAnswer", score);

        console.log("RightAnswer :",rightAnswer);
        console.log("UserAnswer",userAnswer)
        // ghtyjjydydty
        endQuiz();
      }
    });

    // End Quiz function
function endQuiz() {
  submitResults();
  // window.location.href = "../pages/result.html";
  scoreElement.textContent = score;
}

    updateQuestion();
  }

  // Get language from localStorage
  let language = localStorage.getItem("lang") || "";
  if (language === "javaScript") {
    language = "JavaScript";
  } else if (language === "C++") {
    language = "C%2B%2B";
  } else if (language === "HTML/CSS") {
    language = "HTML%2FCSS";
  }

  // Fetch Questions
  fetchQuestions(language);

  // Check if getUserMedia is supported
  function askForScreenShareReady() {
    return new Promise(function (resolve) {
      const isReady = confirm(
        "Are you ready to share your screen? Click OK when ready."
      );
      resolve(isReady);
    });
  }

  // Function to access camera
  function accessCamera() {
    return new Promise(function (resolve, reject) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          const videoElement = document.createElement("video");
          videoElement.srcObject = stream;
          videoElement.play();
          videoContainer.appendChild(videoElement);
          makeDraggable(videoContainer);
          isCameraActive = true;
          resolve();
        })
        .catch(function (error) {
          console.error("Error accessing camera:", error);
          alert(
            "Camera access denied. Please allow camera access and reload the page to start the quiz."
          );
          location.reload();
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
          const videoElement = document.createElement("video");
          videoElement.srcObject = stream;
          videoElement.autoplay = true;
          videoElement.controls = true;
          document
            .getElementById("screenShareContainer")
            .appendChild(videoElement);
          isScreenShareActive = true;
          resolve();
        })
        .catch(function (error) {
          console.error("Error accessing screen share:", error);
          alert(
            "Screen sharing access denied. Please allow screen sharing access and reload the page to start the quiz."
          );
          location.reload();
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
      .then(function (isScreenShareReady) {
        if (isScreenShareReady) {
          // Access camera
          accessCamera()
            .then(function () {
              // Access screen share
              return accessScreenShare();
            })
            .then(function () {
              // Update
              return update();
            })
            .catch(function (error) {
              console.error(
                "Error accessing camera, screen share, or updating:",
                error
              );
              alert(
                "Error accessing camera, screen share, or updating. Please allow access and reload the page to start the quiz."
              );
              location.reload();
            });
        } else {
          alert(
            "Screen share canceled. Please reload the page when you are ready."
          );
          location.reload();
        }
      })
      .catch(function (error) {
        console.error("Error asking for screen share readiness:", error);
        alert(
          "Error asking for screen share readiness. Please reload the page to start the quiz."
        );
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

  // Screen Share function
  const screenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      const videoElement = document.createElement("video");
      videoElement.srcObject = stream;
      videoElement.autoplay = true;
      videoElement.controls = true;
      document.getElementById("screenShareContainer").appendChild(videoElement);
      isScreenShareActive = true;
    } catch (error) {
      console.error("Error accessing screen share:", error);
      alert(
        "Screen sharing access denied. Please allow screen sharing access and reload the page to start the quiz."
      );
      location.reload();
    }
  };

  function startQuizIfReady() {
    if (isCameraActive && isScreenShareActive) {
      fetchQuestions(language);
    }
  }
  startQuizIfReady();
  
async function submitResults() {
  const resultData = {
    userId: localStorage.getItem("userId"),
    resultTitle: calculateResultTitle(score),
    questions: [],
    answers: [],
    totalScore: score,
    correctCount: "",
    incorrectCount: ""
  };
  const token = localStorage.getItem('token');
  console.log(resultData);
  try {
    const response = await fetch(`https://variable-sculptress-6789-e41a.onrender.com/results/add`, {
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
}

// Add a function to calculate result title based on the score
function calculateResultTitle(score) {
  if (score === 100) {
    return 'perfect';
  } else if (score >= 70) {
    return 'good';
  } else if (score >= 50) {
    return 'pending';
  } else if (score >= 30) {
    return 'average';
  } else {
    return 'poor';
  }
}

});

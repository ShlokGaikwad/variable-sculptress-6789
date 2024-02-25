let question = [] ;
let incorrectAnswer = 0 ;
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

(function update() {
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
})();

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

document.addEventListener("DOMContentLoaded", function () {
  const questionCountElement = document.getElementById("question-count");
  const questionTextElement = document.getElementById("question-text");
  const optionsContainers = Array.from({ length: 4 }, (_, index) =>
    document.getElementById(`options-container${index + 1}`)
  );
  const buttonsContainer = document.getElementById("buttons-container");
  const submitButton = document.getElementById("submit-button");
  const nextButton = document.getElementById("next-button");
  const scoreElement = document.getElementById("score");
  const progressBar = document.querySelector(".progress");

  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];
  let selectedOptionIndex = null;
  let timerInterval;
  let isCameraActive = false;
  let isScreenShareActive = false;

  function resetTimer() {
    clearInterval(timerInterval); // Clear the existing timer interval
    timePassed = 0; // Reset the time passed
    updateProgressBar(); // Start a new timer interval
  }

  function updateProgressBar() {
    const bar = document.querySelector(".progress");
    let percentage = parseInt(bar.style.width) || 0;
    percentage += 1;

    if (percentage <= 100) {
      bar.style.width = percentage + "%";
    } else {
      handleNextButtonClick(); // Move to the next question automatically
      resetTimer(); // Reset the timer for the next question
    }
  }

  // function startQuizIfReady() {
  //   if (isCameraActive && isScreenShareActive) {
  //     startQuiz();
  //   }
  // }

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

  function startQuiz() {
    const totalQuestions = Math.min(10, questions.length);
    function shuffleQuestions() {
      for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
      }
    }
  
    shuffleQuestions();
    function updateQuestion() {
      resetTimer();
      const currentQuestion = questions[currentQuestionIndex];
    
      if (currentQuestion) {
        questionCountElement.textContent = currentQuestionIndex + 1;
        questionTextElement.textContent = currentQuestion.description;
        question.push(currentQuestion.description);
        // Check if the question has a code field
        if (currentQuestion.code) {
          // Create a div element to hold the code
          const codeContainer = document.getElementById('codeContainer');
    
          // Create a pre element
          const preElement = document.createElement('pre');
    
          // Create a code element and set its class and inner text
          const codeElement = document.createElement('code');
          const languageClass = `language-${language.toLowerCase()}`;
          codeElement.className = languageClass;
          codeElement.textContent = currentQuestion.code;
    
          // Append the code element to the pre element
          preElement.appendChild(codeElement);
    
          // Append the pre element to the code container
          codeContainer.innerHTML = ""; // Clear existing content
          codeContainer.appendChild(preElement);
    
          // Apply Prism syntax highlighting
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
    

    function createOptionElement(text, index) {
      const optionElement = document.createElement("div");
      optionElement.classList.add("option");
      optionElement.textContent = text;

      optionElement.addEventListener("click", () => handleOptionClick(index));

      return optionElement;
    }

    function handleOptionClick(selectedIndex) {
      // Check if options are still selectable
      if (optionsContainers[selectedIndex].classList.contains("locked")) {
        return;
      }
    
      clearOptionSelection();
    
      selectedOptionIndex = selectedIndex;
      optionsContainers[selectedIndex].classList.add("selected");
      submitButton.classList.remove("disabled");
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

    submitButton.addEventListener("click", handleSubmitButtonClick);

    function handleSubmitButtonClick() {
      optionsContainers.forEach((container) =>
        container.classList.add("locked")
      );

      const currentQuestion = questions[currentQuestionIndex];
      console.log("currentQuestions",currentQuestion);
      console.log("Right answer",currentQuestion.options[currentQuestion.answerIndex])
      
      if (currentQuestion && selectedOptionIndex !== null) {
        const selectedOption = optionsContainers[selectedOptionIndex];
        console.log("Your Answer :",selectedOption.textContent);

        selectedOption.classList.remove("selected", "correct", "wrong");

        if (currentQuestion.answerIndex === selectedOptionIndex) {
          selectedOption.classList.add("correct");
          score += 10;
          scoreElement.textContent = score;
        } else {
          incorrectAnswer += 10 ;
          selectedOption.classList.add("wrong");
          optionsContainers[currentQuestion.answerIndex].classList.add(
            "correct"
          );
        }
      }

      submitButton.classList.add("disabled");
      nextButton.classList.remove("disabled"); // Enable the Next button here
    }

    nextButton.addEventListener("click", handleNextButtonClick);

    function handleNextButtonClick() {
      clearOptionSelection();
      optionsContainers.forEach((container) =>
        container.classList.remove("locked", "correct", "wrong")
      );
    
      // Clear the code container
      const codeContainer = document.getElementById('codeContainer');
      codeContainer.innerHTML = '';
    
      // Remove all classes from the next button
      nextButton.className = "next-button";
      resetTimer();
      currentQuestionIndex++;
    
      if (currentQuestionIndex < totalQuestions) {
        updateQuestion();
      } else {
        localStorage.setItem("questions", JSON.stringify(question));  
        localStorage.setItem("incorrectAnswer",incorrectAnswer);
        localStorage.setItem("correctAnswer",score);
        endQuiz();
      }
    }
    

    function endQuiz() {
      window.location.href = "../pages/result.html";
      scoreElement.textContent = score;
    }

    updateQuestion();
  }

  let language = localStorage.getItem("lang") || "";
  // console.log(language);
  if (language === "javaScript") {
    language = language.toLowerCase();
  } else if (language === "C++") {
    language = "C%2B%2B";
  } else if (language === "HTML/CSS") {
    language = "HTML%2FCSS";
  }
  fetchQuestions(language);
});

document.addEventListener("DOMContentLoaded", function () {
  // Get the video container element
  const videoContainer = document.getElementById("video-container");

  // Check if getUserMedia is supported
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        // Create a video element
        const videoElement = document.createElement("video");
        videoElement.srcObject = stream;
        videoElement.play();

        // Append the video element to the container
        videoContainer.appendChild(videoElement);

        // Make the video container draggable
        makeDraggable(videoContainer);

        isCameraActive = true;
        startQuizIfReady();
      })
      .catch(function (error) {
        console.error("Error accessing the camera:", error);
      });
  } else {
    console.error("getUserMedia is not supported");
  }

  function makeDraggable(element) {
    let isDragging = false;
    let offsetX, offsetY;

    // Add class for styling
    element.classList.add("draggable");

    // Add mousedown event listener to start dragging
    element.addEventListener("mousedown", function (e) {
      isDragging = true;
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
    });

    // Add mousemove event listener to move the element
    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        element.style.left = e.clientX - offsetX + "px";
        element.style.top = e.clientY - offsetY + "px";
      }
    });

    // Add mouseup event listener to stop dragging
    document.addEventListener("mouseup", function () {
      isDragging = false;
    });
  }
});

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
    startQuizIfReady();
  } catch (error) {
    console.error("Error accessing screen share:", error);
  }
};

screenShare();

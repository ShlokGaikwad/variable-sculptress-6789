let question = [];
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

const url = "https://variable-sculptress-6789-e41a.onrender.com";
const screenShareContainer = document.getElementById("screenShareContainer");
const videoContainer = document.getElementById("video-container");
const questionText = document.getElementById("question-text");
const codeContainer = document.getElementById("code-container");
const optionOne = document.getElementById("options-container1");
const optionTwo = document.getElementById("options-container2");
const optionThree = document.getElementById("options-container3");
const optionFour = document.getElementById("options-container4");
const lang = getLangFromLocal();
let questionBank;

function getLangFromLocal() {
  let language = localStorage.getItem("lang") || "";
  if (language === "javaScript") {
    language = "JavaScript";
  } else if (language === "C++") {
    language = "C%2B%2B";
  } else if (language === "HTML/CSS") {
    language = "HTML%2FCSS";
  }
  return language;
}

async function fetchQuestions(lang) {
  try {
    console.log(lang);
    const res = await fetch(`${url}/questions?lang=${lang}`);
    const data = await res.json();
    console.log(data);
    questionBank=data.msg;
    appendToDom(questionBank);
  } catch (error) {
    console.log(error);
  }
}

fetchQuestions(lang);

function generateUniqueRandomNumbers(limit) {
  // Array to store already generated numbers
  let generatedNumbers = [];

  // Function to generate a random number within the specified range
  function generateRandomNumber() {
    return Math.floor(Math.random() * limit) + 1;
  }

  // Function to check if a number is already generated
  function isNumberGenerated(number) {
    return generatedNumbers.includes(number);
  }

  // Generate unique random numbers until the limit is reached
  while (generatedNumbers.length < 10) {
    let randomNumber = generateRandomNumber();
    if (!isNumberGenerated(randomNumber)) {
      generatedNumbers.push(randomNumber);
      // console.log(randomNumber);
    }
  }
  return generatedNumbers;
}

function appendToDom(q) {
  const random = generateUniqueRandomNumbers(q.length-1);
  console.log(random)
  let count=0;
  domCreation(random[count]);
  
  let interval=setInterval(()=>{
    count++;
    if(count>=9){
      clearInterval(interval);
    }
    
    domCreation(random[count]);
  },1000)
  
}


function domCreation(ele) {
  const question = questionBank[ele];
  console.log(question)
  questionText.innerText=question.description;
  optionOne.innerText=question.options[0];
  optionTwo.innerText=question.options[1];
  optionThree.innerText=question.options[2];
  optionFour.innerText=question.options[3];
}

// Check if getUserMedia is supported
// function askForScreenShareReady() {
//   return new Promise(function (resolve) {
//     const isReady = confirm(
//       "Are you ready to share your screen? Click OK when ready."
//     );
//     resolve(isReady);
//   });
// }

// // Function to access camera
// function accessCamera() {
//   return new Promise(function (resolve, reject) {
//     navigator.mediaDevices
//       .getUserMedia({ video: true })
//       .then(function (stream) {
//         const videoElement = document.createElement("video");
//         videoElement.srcObject = stream;
//         videoElement.play();
//         videoContainer.appendChild(videoElement);
//         makeDraggable(videoContainer);
//         isCameraActive = true;
//         resolve();
//       })
//       .catch(function (error) {
//         console.error("Error accessing camera:", error);
//         alert(
//           "Camera access denied. Please allow camera access and reload the page to start the quiz."
//         );
//         location.reload();
//         reject(error);
//       });
//   });
// }

// // Function to access screen share
// function accessScreenShare() {
//   return new Promise(function (resolve, reject) {
//     navigator.mediaDevices
//       .getDisplayMedia({ video: true })
//       .then(function (stream) {
//         const videoElement = document.createElement("video");
//         videoElement.srcObject = stream;
//         videoElement.autoplay = true;
//         videoElement.controls = true;
//         document
//           .getElementById("screenShareContainer")
//           .appendChild(videoElement);
//         isScreenShareActive = true;
//         resolve();
//       })
//       .catch(function (error) {
//         console.error("Error accessing screen share:", error);
//         alert(
//           "Screen sharing access denied. Please allow screen sharing access and reload the page to start the quiz."
//         );
//         location.reload();
//         reject(error);
//       });
//   });
// }

// // Check if getUserMedia and screen sharing are supported
// if (
//   navigator.mediaDevices &&
//   navigator.mediaDevices.getUserMedia &&
//   navigator.mediaDevices.getDisplayMedia
// ) {
//   // Ask for screen share readiness
//   askForScreenShareReady()
//     .then(function (isScreenShareReady) {
//       if (isScreenShareReady) {
//         // Access camera
//         accessCamera()
//           .then(function () {
//             // Access screen share
//             return accessScreenShare();
//           })
//           .then(function () {
//             // Update
//             return update();
//           })
//           .catch(function (error) {
//             console.error(
//               "Error accessing camera, screen share, or updating:",
//               error
//             );
//             alert(
//               "Error accessing camera, screen share, or updating. Please allow access and reload the page to start the quiz."
//             );
//             location.reload();
//           });
//       } else {
//         alert(
//           "Screen share canceled. Please reload the page when you are ready."
//         );
//         location.reload();
//       }
//     })
//     .catch(function (error) {
//       console.error("Error asking for screen share readiness:", error);
//       alert(
//         "Error asking for screen share readiness. Please reload the page to start the quiz."
//       );
//       location.reload();
//     });
// } else {
//   console.error("getUserMedia or screen sharing is not supported");
//   alert(
//     "Camera or screen sharing not supported. Please use a browser that supports camera and screen sharing access and reload the page to start the quiz."
//   );
//   location.reload();
// }

// // Make Draggable function
// function makeDraggable(element) {
//   let isDragging = false;
//   let offsetX, offsetY;

//   element.classList.add("draggable");

//   element.addEventListener("mousedown", function (e) {
//     isDragging = true;
//     offsetX = e.clientX - element.getBoundingClientRect().left;
//     offsetY = e.clientY - element.getBoundingClientRect().top;
//   });

//   document.addEventListener("mousemove", function (e) {
//     if (isDragging) {
//       element.style.left = e.clientX - offsetX + "px";
//       element.style.top = e.clientY - offsetY + "px";
//     }
//   });

//   document.addEventListener("mouseup", function () {
//     isDragging = false;
//   });
// }

// // Screen Share function
// const screenShare = async () => {
//   try {
//     const stream = await navigator.mediaDevices.getDisplayMedia({
//       video: true,
//     });
//     const videoElement = document.createElement("video");
//     videoElement.srcObject = stream;
//     videoElement.autoplay = true;
//     videoElement.controls = true;
//     document.getElementById("screenShareContainer").appendChild(videoElement);
//     isScreenShareActive = true;
//   } catch (error) {
//     console.error("Error accessing screen share:", error);
//     alert(
//       "Screen sharing access denied. Please allow screen sharing access and reload the page to start the quiz."
//     );
//     location.reload();
//   }
// };

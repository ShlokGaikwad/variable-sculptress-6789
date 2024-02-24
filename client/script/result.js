const url = "https://variable-sculptress-6789-e41a.onrender.com";
const correctAnswer = document.getElementById("correct-answer");
const unanswered = document.getElementById("unanswered");
const incorrectAnswer = document.getElementById("incorrect-answer");

const correctAns = localStorage.getItem("correctAnswer");
const incorrectAns = localStorage.getItem("incorrectAnswer");

correctAnswer.innerHTML = correctAns / 10;
incorrectAnswer.innerHTML = incorrectAns / 10;
unanswered.innerHTML = Math.abs(correctAns - incorrectAns)/10;

const url = "https://variable-sculptress-6789-e41a.onrender.com";
const correctAnswer = document.getElementById("correct-answer");
const unanswered = document.getElementById("unanswered");
const incorrectAnswer = document.getElementById("incorrect-answer");
const score = document.getElementById("score");
const msg = document.getElementById("message");

const correctAns = localStorage.getItem("correctAnswer") / 10;
const incorrectAns = localStorage.getItem("incorrectAnswer") / 10;

score.innerHTML = correctAns * 10;
// console.log(score);
correctAnswer.innerHTML = correctAns;
incorrectAnswer.innerHTML = incorrectAns;

let totalAttemptedQuestion = correctAns + incorrectAns;
unanswered.innerHTML = Math.abs(10 - totalAttemptedQuestion);

checkAnswer.addEventListener("click", () => {
  window.location.href = "../pages/review.html";
});

const newScore = score.innerHTML;
msg.innerHTML = calculateResultTitle(newScore);

function calculateResultTitle(score) {
  if (score === 100) {
    return "Perfect! Well Done";
  } else if (score >= 70) {
    return "Good Job!";
  } else if (score >= 50) {
    return "Nice Try!";
  } else if (score <= 30) {
    return "Poor, Try Again!";
  }
}

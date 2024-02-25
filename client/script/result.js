const url = "https://variable-sculptress-6789-e41a.onrender.com";
const correctAnswer = document.getElementById("correct-answer");
const unanswered = document.getElementById("unanswered");
const incorrectAnswer = document.getElementById("incorrect-answer");
const points = document.getElementById("score");

const correctAns = localStorage.getItem("correctAnswer") / 10;
const incorrectAns = localStorage.getItem("incorrectAnswer") / 10;

points.textContent = correctAns * 10 ;
correctAnswer.innerHTML = correctAns ;
incorrectAnswer.innerHTML = incorrectAns ;

let totalAttemptedQuestion = (correctAns + incorrectAns ) ;
unanswered.innerHTML = Math.abs(10 - totalAttemptedQuestion ) ;

checkAnswer.addEventListener("click",()=>{
    window.location.href="../pages/review.html"
})


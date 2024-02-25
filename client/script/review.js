let count  = 1 ;
const correctAnswerCount = document.getElementById("correct-answer-count");
const correctAnswerCount2 =document.getElementById("correct-answer-count-2");
const quizName = document.getElementById("quiz-name");
const questionsDiv = document.getElementById("questions-div");

const correctAns = localStorage.getItem("correctAnswer") ;
correctAnswerCount.textContent = correctAns / 10 ;

correctAnswerCount2.textContent = correctAns / 10 ;

const questions = JSON.parse(localStorage.getItem("questions")) ;
 quizName.textContent = localStorage.getItem("lang");

questions.forEach((question,index)=>{
     let card = createQuestion(question,index);
     questionsDiv.append(card);
});

function createQuestion(question,index){
    // console.log(question,index);
    let questionSet = document.createElement("div");
    questionSet.classList.add("question-set");

    let questionName = document.createElement("p");
    let questionCount = document.createElement("span");
    questionCount.classList.add("question-count");
    questionCount.textContent = count++ ;
    let questionTitle = document.createElement("span");
    questionTitle.textContent = question ;
    questionName.append(questionCount,questionTitle);

    let yourAnswer = document.createElement("p");
    yourAnswer.textContent = "Your Answer : "
    let span = document.createElement("span");
    span.textContent = "Adding interactivity to web pages";
    yourAnswer.append(span);

    let correctAnswer = document.createElement("p");
    correctAnswer.textContent = "Correct Answer : " ;
    let span2 = document.createElement("span");
    span2.textContent = "Adding interactivity to web pages"
    span2.classList.add("correct-answer");
    correctAnswer.append(span2);

    questionSet.append(questionName,yourAnswer,correctAnswer);

    return questionSet ;
    
}


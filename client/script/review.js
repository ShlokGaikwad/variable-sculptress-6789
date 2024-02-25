let count  = 1 ;
const correctAnswerCount = document.getElementById("correct-answer-count");
const correctAnswerCount2 =document.getElementById("correct-answer-count-2");
const quizName = document.getElementById("quiz-name");
const questionsDiv = document.getElementById("questions-div");

//RESULT//

const userId = localStorage.getItem("userId") ;
const Total_Score_Obtained =  localStorage.getItem("correctAnswer");
const Wrong_Answer =  localStorage.getItem("incorrectAnswer");
const Language =  localStorage.getItem("lang");
const Total_No_of_Questions = parseInt(localStorage.getItem("Total_NO_Questions:"), 10);
const Total_Marks = Total_No_of_Questions * 10 ;

console.log(
    `userId: ${userId}\n` +
    `Language: ${Language}\n` +
    `Total_Score_Obtained: ${Total_Score_Obtained}\n` +
    `Wrong_Answer: ${Wrong_Answer}\n` +
    `Total_No_of_Questions: ${Total_No_of_Questions}\n` +
    `Total_Marks: ${Total_Marks}`
);

if(Total_Score_Obtained >= 30 && Total_Score_Obtained < 50){
    console.log(`Badges : Silver`);
}else if(Total_Score_Obtained >= 50 && Total_Score_Obtained < 70){
    console.log(`Badges : Gold`);
}else if(Total_Score_Obtained >= 70 && Total_Score_Obtained < 90){
    console.log(`Badges : Platinum`);
}else if(Total_Score_Obtained >= 90){
    console.log(`Badges : Diamond`);
}else{
    console.log(`Badges : Broonze`);
}

/*
Result :

userId : localStorage.getItem("userId") ;
Total_Score_Obtained :  localStorage.getItem("correctAnswer");
Wrong_Answer :  localStorage.getItem("incorrectAnswer");
Language :  localStorage.getItem("lang");
Total_No_of_Questions : localstorage.getItem("Total_NO_Questions :");
Total_Marks : Total_No_of_Questions * 10 ;
Badges : 
          if(Total_Score_Obtained >= 30 && Total_Score_Obtained < 50){
               "Silver" 
          }else if(Total_Score_Obtained >= 50 && Total_Score_Obtained < 70){
                "Gold"
          }else if(Total_Score_Obtained >= 70 && Total_Score_Obtained < 90){
                "Platinum"
          }else if(Total_Score_Obtained >= 90){
                "Diamond"
          }else{
            "Broonze"
          }
 */

const correctAns = localStorage.getItem("correctAnswer") ;
correctAnswerCount.textContent = correctAns / 10 ;

correctAnswerCount2.textContent = correctAns / 10 ;

const questions = JSON.parse(localStorage.getItem("questions")) ;
localStorage.setItem("Total_NO_Questions:",questions.length);
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


const newButton = document.createElement("button");
newButton.textContent = "Download Result"; 
newButton.id = "new-button"; 

document.body.appendChild(newButton);


const correctAnswer = document.getElementById("correct-answer");
const unanswered = document.getElementById("unanswered");
const incorrectAnswer = document.getElementById("incorrect-answer");

const fetchResult = async()=>{
    try{
        const token = localStorage.getItem("token",token) ;
        const res = await fetch(`http://localhost:3000/results/:`)      
    }catch(error){
        console.log(error.message) ;
    }
}
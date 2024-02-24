const url = "https://variable-sculptress-6789-e41a.onrender.com"; 
const correctAnswer = document.getElementById("correct-answer");
const unanswered = document.getElementById("unanswered");
const incorrectAnswer = document.getElementById("incorrect-answer");

const fetchResult = async()=>{
    try{
        const token = localStorage.getItem("token",token);
        const userId = localStorage.getItem("userId",userId) ;
        const res = await fetch(`${url}/results/userId`,{
            method : "GET" ,
            headers : {
                "Content-type" : "application/json",
                "Authorization" : `Bearer ${token}`
            }
        }) ;   
        const data = await res.json() ;
        console.log(data) ;  
    }catch(error){
        console.log(error.message) ;
    }
}

fetchResult() ;
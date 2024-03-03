const apiUrl = 'https://variable-sculptress-6789-e41a.onrender.com';
const userId = localStorage.getItem("userId");
const historyContainer = document.querySelector('.history-container');
const token = localStorage.getItem('token');
const dashCont = document.getElementById('dash-cont')
let users;

async function fetchUsers(){
    try{
        const res = await fetch(`${apiUrl}/users/user`);
        const data= await res.json();
        users=data;
        users.forEach((obj)=>{
            // console.log(obj._id);
            dashCont.innerHTML=""
            fetchResults(obj._id,obj.username);
        })
        console.log(data);
    }
    catch(err){
        console.log(err);
    }
}

fetchUsers();


async function fetchResults(id,username){
    try{
        const res = await fetch(`${apiUrl}/results/${id}`,{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        });
        const data= await res.json();
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        appendToDom(data,username)
        console.log(data);
    }
    catch(err){
        console.log(err);
    }
}

function appendToDom(data,username){
    const userCont = document.createElement("div")
    userCont.className="user-cont"
    const userName = document.createElement("h1");
    userName.innerText=`${username}'s video`
    const historyContainer = document.createElement("div");
    historyContainer.className="history-container"
    data.forEach((item)=>{
        historyContainer.append(createCard(item))
    })
    userCont.append(userName,historyContainer)
    dashCont.append(userCont)
}

function createCard(data){
    const historyItem = document.createElement("div");
    historyItem.className="history-item"
   
    const quizCont = document.createElement("div")
    quizCont.className="quiz-cont"

    // const quizContImg = document.createElement("img")
    // quizContImg.src=`${apiUrl}`

    const quizContName = document.createElement("p")
    quizContName.innerText=data.languageName

    const totalScore = document.createElement("div")
    totalScore.innerText="Total Score : "

    const totalScoreSpan = document.createElement("span")
    totalScoreSpan.innerText=data.totalScore
    totalScoreSpan.className="total-score"

    const correctScore = document.createElement("div")
    correctScore.innerText="Correct Answer : "

    const correctScoreSpan = document.createElement("span")
    correctScoreSpan.innerText=data.correctCount
    correctScoreSpan.className="correct-answer"

    const incorrectScore = document.createElement("div")
    incorrectScore.innerText="Incorrect Answer : "

    const incorrectScoreSpan = document.createElement("span")
    incorrectScoreSpan.innerText=data.incorrectCount
    incorrectScoreSpan.className="incorrect-answer"

    const procVideo = document.createElement("video")
    procVideo.className="hid"
    procVideo.src=`../../../server${data.recordingPath}`
    procVideo.controls=true

    historyItem.addEventListener("click",()=>{
      procVideo.classList.toggle("hid")  
    })

    historyItem.append(quizCont,totalScore,correctScore,incorrectScore,procVideo)
    quizCont.append(quizContName)
    totalScore.append(totalScoreSpan);
    correctScore.append(correctScoreSpan)
    incorrectScore.append(incorrectScoreSpan)
    return historyItem
}

// document.addEventListener('DOMContentLoaded', async function () {
//     try {
//         const response = await fetch(`${apiUrl}/results/`, {
//             headers: {
//                 "Authorization": `Bearer ${token}`,
//             }
//         });

//         const data = await response.json();
//         console.log(data);
//         if (Array.isArray(data)) {
//             await Promise.all(data.map(async (result) => {
//                 try {
          
//                     const languageResponse = await fetch(`${apiUrl}/languages/filter/${encodeURIComponent(result.languageName)}`);
//                     const languageData = await languageResponse.json();

//                     console.log('Language Data:', languageData);

//                     const historyItem = document.createElement('div');
//                     historyItem.classList.add('history-item');

//                     const quizContainer = document.createElement('div');
//                     quizContainer.classList.add('quiz-cont');

//                     const img = document.createElement('img');
//                     img.src = `${apiUrl}/${languageData[0].languageImage}`;
//                     img.alt = languageData[0].languageTitle;

//                     quizContainer.appendChild(img);

//                     const p = document.createElement('p');
//                     p.id = 'quiz-name';
//                     p.textContent = result.languageName || '';
//                     quizContainer.appendChild(p);

//                     historyItem.appendChild(quizContainer);

//                     const totalScore = document.createElement('div');
//                     totalScore.textContent = `Total Score : ${result.totalScore || 0}`;
//                     totalScore.classList.add('total-score');
//                     historyItem.appendChild(totalScore);

//                     const correctAnswer = document.createElement('div');
//                     correctAnswer.textContent = `Correct Answer : ${result.correctCount || 0}`;
//                     correctAnswer.classList.add('correct-answer');
//                     historyItem.appendChild(correctAnswer);

//                     const incorrectAnswer = document.createElement('div');
//                     incorrectAnswer.textContent = `Incorrect Answer : ${result.incorrectCount || 0}`;
//                     incorrectAnswer.classList.add('incorrect-answer');
//                     historyItem.appendChild(incorrectAnswer);

//                     // Add date div
//                     const dateDiv = document.createElement('div');
//                     dateDiv.textContent = `Date : ${new Date(result.date).toLocaleString()}`;
//                     dateDiv.classList.add('date');
//                     historyItem.appendChild(dateDiv);

//                     historyContainer.appendChild(historyItem);
//                 } catch (error) {
//                     console.error('Error processing result:', error);
//                 }
//             }));
//         } else {
//             console.error('Invalid data structure - expected an array.');
//         }
//     } catch (error) {
//         console.error('Error fetching history data:', error);
//     }
// });

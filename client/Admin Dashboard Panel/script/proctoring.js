const apiUrl = 'https://variable-sculptress-6789-e41a.onrender.com';
const userId = localStorage.getItem("userId");
const historyContainer = document.querySelector('.history-container');
const token = localStorage.getItem('token');
let users;

async function fetchUsers(){
    try{
        const res = await fetch(`${apiUrl}/users/user`);
        const data= await res.json();
        users=data;
        users.forEach((obj)=>{
            console.log(obj._id);
            fetchResults(obj._id);
        })
        // console.log(data);
    }
    catch(err){
        console.log(err);
    }
}

fetchUsers();


async function fetchResults(id){
    try{
        const res = await fetch(`${apiUrl}/results/${id}`,{
            headers:{
                "Authorization":`Bearer ${token}`
            }
        });
        const data= await res.json();
        console.log(id);
        console.log(data);
    }
    catch(err){
        console.log(err);
    }
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

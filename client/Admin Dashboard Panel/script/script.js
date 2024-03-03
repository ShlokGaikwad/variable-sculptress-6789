const apiUrl = 'https://variable-sculptress-6789-e41a.onrender.com';
const userId = localStorage.getItem("userId");
const token = localStorage.getItem('token');


const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");
      sidebar = body.querySelector("nav");
      sidebarToggle = body.querySelector(".sidebar-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
})

const historyContainer = document.querySelector('.history-container');

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch(`https://variable-sculptress-6789-e41a.onrender.com/results`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        const data = await response.json();
        console.log(data);
        if (Array.isArray(data)) {
            data.sort((a, b) => new Date(b.date) - new Date(a.date));

            const latestResults = data.slice(0, 10);
            await Promise.all(latestResults.map(async (result) => {
                try {
          
                    const languageResponse = await fetch(`${apiUrl}/languages/filter/${encodeURIComponent(result.languageName)}`);
                    const languageData = await languageResponse.json();

                    console.log('Language Data:', languageData);

                    const historyItem = document.createElement('div');
                    historyItem.classList.add('history-item');

                    const quizContainer = document.createElement('div');
                    quizContainer.classList.add('quiz-cont');

                    const img = document.createElement('img');
                    img.src = `${apiUrl}/${languageData[0].languageImage}`;
                    img.alt = languageData[0].languageTitle;

                    quizContainer.appendChild(img);

                    const p = document.createElement('p');
                    p.id = 'quiz-name';
                    p.textContent = result.languageName || '';
                    quizContainer.appendChild(p);

                    historyItem.appendChild(quizContainer);

                    const totalScore = document.createElement('div');
                    totalScore.textContent = `Total Score : ${result.totalScore || 0}`;
                    totalScore.classList.add('total-score');
                    historyItem.appendChild(totalScore);

                    const correctAnswer = document.createElement('div');
                    correctAnswer.textContent = `Correct Answer : ${result.correctCount || 0}`;
                    correctAnswer.classList.add('correct-answer');
                    historyItem.appendChild(correctAnswer);

                    const incorrectAnswer = document.createElement('div');
                    incorrectAnswer.textContent = `Incorrect Answer : ${result.incorrectCount || 0}`;
                    incorrectAnswer.classList.add('incorrect-answer');
                    historyItem.appendChild(incorrectAnswer);

                    // Add date div
                    const dateDiv = document.createElement('div');
                    dateDiv.textContent = `Date : ${new Date(result.date).toLocaleString()}`;
                    dateDiv.classList.add('date');
                    historyItem.appendChild(dateDiv); 

                    historyContainer.appendChild(historyItem);
                } catch (error) {
                    console.error('Error processing result:', error);
                }
            }));
        } else {
            console.error('Invalid data structure - expected an array.');
        }
    } catch (error) {
        console.error('Error fetching history data:', error);
    }
});


const fetchData = async () => {
    try {
        const [questions, users, quizPlayed] = await Promise.all([
            fetch(`${apiUrl}/questions`).then(response => response.json()),
            fetch(`${apiUrl}/user/users`).then(response => response.json()),
            fetch(`${apiUrl}/results`).then(response => response.json())
        ]);

        document.getElementById('total-question').textContent = questions.length;
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-quiz-played').textContent = quizPlayed.length;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

document.addEventListener('DOMContentLoaded', fetchData);
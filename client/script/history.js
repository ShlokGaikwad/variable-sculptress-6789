const apiUrl = 'https://variable-sculptress-6789-e41a.onrender.com/results';
const userId = localStorage.getItem("userId");
const historyContainer = document.querySelector('.history-container');
const token = localStorage.getItem('token');
const backButton =  document.getElementById("back-button");

backButton.addEventListener("click",()=>{
    window.history.back();
})

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        const data = await response.json();

        if (Array.isArray(data)) {
            await Promise.all(data.map(async (result) => {
                try {
          
                    const languageResponse = await fetch(`http://localhost:3000/languages/filter/${encodeURIComponent(result.languageName)}`);
                    const languageData = await languageResponse.json();

                    console.log('Language Data:', languageData);

                    const historyItem = document.createElement('div');
                    historyItem.classList.add('history-item');

                    const quizContainer = document.createElement('div');
                    quizContainer.classList.add('quiz-cont');

                    const img = document.createElement('img');
                    img.src = `http://localhost:3000/${languageData[0].languageImage}`;
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

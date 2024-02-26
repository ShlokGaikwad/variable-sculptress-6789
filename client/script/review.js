document.addEventListener("DOMContentLoaded", function () {
    const storedResultsData = localStorage.getItem("resultData");
  
    if (storedResultsData) {
      try {
        const resultData = JSON.parse(storedResultsData);
  
        // Assuming correctCount is the count of correct answers
        const correctCount = resultData.correctCount;
  
        // Update the correct-answer-count element
        const correctAnswerCountElement = document.getElementById("correct-answer-count");
        correctAnswerCountElement.textContent = correctCount;
  
        // Update the correct-answer-count-2 element
        const correctAnswerCount2Element = document.getElementById("correct-answer-count-2");
        correctAnswerCount2Element.textContent = correctCount;
  
        const questionsDiv = document.getElementById("questions-div");
  
        for (let i = 0; i < resultData.questions.length; i++) {
          const cardContainer = document.createElement("div");
          cardContainer.classList.add("question-set");
  
          const questionCount = document.createElement("p");
          questionCount.innerHTML = `<span class="question-count">${i + 1}</span>${resultData.questions[i]}`;
  
          const userAnswer = resultData.answers[i] || ""; // Ensure userAnswer is defined
          const userAnswerElement = document.createElement("p");
          userAnswerElement.innerHTML = `Your Answer: <span class="${userAnswer.trim() === (resultData.correctAnswers[i] || "").trim() ? 'correct' : 'incorrect'}">${userAnswer}</span>`;
  
          const correctAnswer = document.createElement("p");
          correctAnswer.innerHTML = `Correct Answer: <span class="correct">${resultData.correctAnswers[i]}</span>`;
  
          cardContainer.appendChild(questionCount);
          cardContainer.appendChild(userAnswerElement);
          cardContainer.appendChild(correctAnswer);
  
          if (userAnswer === resultData.correctAnswers[i]) {
            cardContainer.classList.add("green-color");
          }
  
          questionsDiv.appendChild(cardContainer);
        }
      } catch (error) {
        console.error("Error processing data:", error);
      }
    } else {
      console.error("No data found in localStorage");
    }
  });
  
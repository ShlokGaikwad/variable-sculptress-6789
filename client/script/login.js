const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});



document.addEventListener('DOMContentLoaded', function () {
  const signInForm = document.getElementById('signInForm');
  const signUpForm = document.getElementById('signUpForm');
  const messageWrapper = document.getElementById("messageWrapper");

  signInForm.addEventListener('submit', function (event) {
    event.preventDefault();
  
    const email = signInForm.querySelector('input[type="text"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;
  
    const formData = {
      email: email,
      password: password,
    };
  
    fetch('http://localhost:3000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.token) {

          localStorage.setItem('token', data.token);
          
          showMessage('Login Successful', 'green');
  
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 2000); 
        } else {
          showMessage('Login Failed. Please check your credentials.', 'red');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again later.', 'red');
      });
  });
  
  function showMessage(message, color) {
    const messageContainer = document.createElement('p');
    messageContainer.textContent = message;
    messageContainer.style.color = color;
  
    const messageWrapper = document.getElementById('messageWrapper');
    
    messageWrapper.innerHTML = '';
  
    messageWrapper.appendChild(messageContainer);
  }
  

  signUpForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = signUpForm.querySelector('input[type="text"]').value;
    const email = signUpForm.querySelector('input[type="email"]').value;
    const password = signUpForm.querySelector('input[type="password"]').value;
    const imageFile = signUpForm.querySelector('#imageUpload').files[0];

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", "user"); // Assuming you have a default role
    formData.append("totalScore", "0"); // Assuming you have a default score

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const response = await fetch("http://localhost:3000/users/signup", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Display the response in messageWrapper
      messageWrapper.innerHTML = `<p>${data.message}</p>`;
    } catch (error) {
      console.error("Error:", error);
      // Handle error, display an error message in messageWrapper
      messageWrapper.innerHTML = "<p>An error occurred. Please try again later.</p>";
    }
  });

  
});




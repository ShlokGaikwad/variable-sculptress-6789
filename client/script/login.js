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
  const signUpMessageWrapper = document.getElementById("signUpMessageWrapper");

  signInForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = signInForm.querySelector('input[type="text"]').value;
    const password = signInForm.querySelector('input[type="password"]').value;

    const formData = {
      email: email,
      password: password,
    };

    fetch('https://variable-sculptress-6789-e41a.onrender.com/users/login', {
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
          localStorage.setItem('userId', data.userId);
          localStorage.setItem('totalScoreOfUser', data.totalScore);
          localStorage.setItem('name', data.username);
          localStorage.setItem('userProfileImage', data.image);
          console.log(data.token)
          showMessage(messageWrapper, 'Login Successful', 'green');
          setTimeout(() => {
            window.location.href = '../pages/dashboard.html';
          }, 1000);
        } else {
          showMessage(messageWrapper, 'Login Failed. Please check your credentials.', 'red');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        showMessage(messageWrapper, 'An error occurred. Please try again later.', 'red');
      });
  });

  function showMessage(wrapper, message, color) {
    const messageContainer = document.createElement('p');
    messageContainer.textContent = message;
    messageContainer.style.color = color;

    wrapper.innerHTML = '';

    wrapper.appendChild(messageContainer);
  }

  signUpForm.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const username = signUpForm.elements.username.value;
    const email = signUpForm.elements.email.value;
    const password = signUpForm.elements.password.value;
    // const imageFile = signUpForm.elements.imageUpload?.files[0];
  
    if (!username || !email || !password) {
      showMessage(signUpMessageWrapper, 'Please fill in all required fields.', 'red');
      return;
    }
  
    const requestData = {
      username,
      email,
      password,
    };
  
    // if (imageFile) {
    //   requestData.image = imageFile;
    // }
  
    try {
      const response = await fetch('https://variable-sculptress-6789-e41a.onrender.com/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      if (response.ok) {
        const data = await response.json();
        showMessage(signUpMessageWrapper, data.message, 'green');
      } else {
        const errorData = await response.json();
        showMessage(signUpMessageWrapper, errorData.message || 'An error occurred.', 'red');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage(signUpMessageWrapper, 'An error occurred. Please try again later.', 'red');
    }
  });
});

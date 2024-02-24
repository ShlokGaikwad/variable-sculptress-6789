const open = document.querySelector(".logo-menu");
const close = document.querySelector(".logo-close");
const menu = document.querySelector(".menu");
const loginSignup = document.getElementById("resume-button-1");
let proceedButton = document.getElementById("proceed-button");
const username = document.getElementById("username")

function toggleMenu() {
    open.classList.toggle("hid");
    close.classList.toggle("hid");
    menu.classList.toggle("hid");
}

async function fetchUserData() {
  try {

      const response = await fetch(`https://variable-sculptress-6789-e41a.onrender.com/users/user/${userId}`); 
      const data = await response.json();

      const username = data.username;
      const image = data.image; 

      const usernameElement = document.getElementById('username');
      const userImageElement = document.getElementById('user-image');

      usernameElement.textContent = username;
      userImageElement.src = image;
  } catch (error) {
      console.error('Error fetching user data:', error);
  }
}
const userId = localStorage.getItem('userId');
fetchUserData();


function fetchData() {
    fetch('https://variable-sculptress-6789-e41a.onrender.com/languages')
        .then(response => response.json())
        .then(data => {
            const langContainer = document.getElementById('lang-container');
            console.log(data);
            data.forEach(language => {
                const langCard = document.createElement('div');
                langCard.className = 'lang-card';
                // console.log(language)
                langCard.dataset.id=language._id

                langCard.addEventListener("click",()=>{
                    putLangIntoLocal(language.languageTitle);
                    proceedButton.disabled=false;
                    proceedButton.classList.remove("disabled");
                    let allCards= document.querySelectorAll(".lang-card");
                    langCard.classList.add('selected');
                    allCards.forEach((otherCard)=>{
                        if(otherCard.dataset.id!=language._id){
                            otherCard.classList.remove('selected');
                        }
                    })
                })

                const img = document.createElement('img');
                img.src = `https://variable-sculptress-6789-e41a.onrender.com/${language.languageImage}`;
                langCard.appendChild(img);

                const p = document.createElement('p');
                p.textContent = language.languageTitle;
                langCard.appendChild(p);

                langContainer.appendChild(langCard);
            });

        })
        .catch(error => console.error('Error fetching data:', error));
}

function putLangIntoLocal(lang){
    localStorage.setItem("lang",lang);
}

open.addEventListener("click", () => {
    toggleMenu();
});

close.addEventListener("click", () => {
    toggleMenu();
});

proceedButton.addEventListener("click", () => {
//   toggleMenu();
    if(!proceedButton.classList.contains("disabled")){
        window.location.href="../pages/quiz.html"
    }
});

//iffe to disable the button on each refresh

fetchData();

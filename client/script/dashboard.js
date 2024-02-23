const open = document.querySelector(".logo-menu");
const close = document.querySelector(".logo-close");
const menu = document.querySelector(".menu");
const loginSignup = document.getElementById("resume-button-1");
let proceedButton = document.getElementById("proceed-button");

function toggleMenu() {
    open.classList.toggle("hid");
    close.classList.toggle("hid");
    menu.classList.toggle("hid");
}

function fetchData() {
    fetch('https://variable-sculptress-6789-e41a.onrender.com/languages')
        .then(response => response.json())
        .then(data => {
            const langContainer = document.getElementById('lang-container');
            console.log(data);
            data.forEach(language => {
                const langCard = document.createElement('div');
                langCard.className = 'lang-card';

                const img = document.createElement('img');
                img.src = `https://variable-sculptress-6789-e41a.onrender.com/${language.languageImage}`;
                langCard.appendChild(img);

                const p = document.createElement('p');
                p.textContent = language.languageTitle;
                langCard.appendChild(p);

                langContainer.appendChild(langCard);
            });

            proceedButton.disabled = false;
        })
        .catch(error => console.error('Error fetching data:', error));
}

open.addEventListener("click", () => {
    toggleMenu();
});

close.addEventListener("click", () => {
    toggleMenu();
});

proceedButton.addEventListener("click", () => {
});

fetchData();

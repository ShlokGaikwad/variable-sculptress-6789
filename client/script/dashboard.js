const baseUrl = 'https://variable-sculptress-6789-e41a.onrender.com';

const open = document.querySelector(".logo-menu");
const close = document.querySelector(".logo-close");
const menu = document.querySelector(".menu");
const loginSignup = document.getElementById("resume-button-1");
let proceedButton = document.getElementById("proceed-button");
const username = document.getElementById("username");

function toggleMenu() {
    open.classList.toggle("hid");
    close.classList.toggle("hid");
    menu.classList.toggle("hid");
}

async function fetchUserData() {
    try {
        const response = await fetch(`${baseUrl}/users/user/${userId}`);
        const data = await response.json();

        const username = data.username;
        const image = data.image;

        const usernameElement = document.getElementById('username');
        const userImageElement = document.getElementById('user-image');

        usernameElement.textContent = username;
        userImageElement.src = `${baseUrl}/${image}`;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

const userId = localStorage.getItem('userId');
fetchUserData();

function fetchData() {
    fetch(`${baseUrl}/languages`)
        .then(response => response.json())
        .then(data => {
            const langContainer = document.getElementById('lang-container');
            console.log(data);
            data.forEach(language => {
                const langCard = document.createElement('div');
                langCard.className = 'lang-card';
                langCard.dataset.id = language._id;

                langCard.addEventListener("click", () => {
                    putLangIntoLocal(language.languageTitle);
                    proceedButton.disabled = false;
                    proceedButton.classList.remove("disabled");
                    let allCards = document.querySelectorAll(".lang-card");
                    langCard.classList.add('selected');
                    allCards.forEach((otherCard) => {
                        if (otherCard.dataset.id != language._id) {
                            otherCard.classList.remove('selected');
                        }
                    });
                });

                const img = document.createElement('img');
                img.src = `${baseUrl}/${language.languageImage}`;
                langCard.appendChild(img);

                const p = document.createElement('p');
                p.textContent = language.languageTitle;
                langCard.appendChild(p);

                langContainer.appendChild(langCard);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

function putLangIntoLocal(lang) {
    localStorage.setItem("lang", lang);
}

open.addEventListener("click", () => {
    toggleMenu();
});

close.addEventListener("click", () => {
    toggleMenu();
});

proceedButton.addEventListener("click", () => {
    if (!proceedButton.classList.contains("disabled")) {
        window.location.href = `quiz.html`;
    }
});

fetchData();

document.addEventListener('DOMContentLoaded', function () {
    function timeAgo(date) {
        const currentDate = new Date();
        const previousDate = new Date(date);
        const timeDifference = currentDate - previousDate;
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
        }
    }

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const timeContainer = document.getElementById('timeContainer');
    const recentQuizElement = document.getElementById('recentquiz');
    const seeResultsButton = document.getElementById('see-results');

    if (userId && token) {
        fetch(`${baseUrl}/results/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(response => response.json())
            .then(historyData => {
                console.log('History Data:', historyData);

                if (historyData.length > 0) {
                    const latestHistory = historyData[historyData.length - 1];
                    const date = new Date(latestHistory.date);
                    const language = latestHistory.languageName;
                    const formattedDate = timeAgo(latestHistory.date);
                    timeContainer.textContent = `${language} Quiz ${formattedDate}`

                    seeResultsButton.addEventListener('click', function () {
                        console.log('See Results button clicked');
                        window.location.href = `history.html`;
                    });
                } else {
                    console.log('No history data found for the user');
                    timeContainer.textContent = "No recent data found";
                }
            })
            .catch(error => {
                console.error('Error fetching history data:', error);
            });
    } else {
        console.log('User ID or token not found in local storage');
    }
});

document.getElementById('multiplayer-mode').addEventListener('click', function() {
    window.location.href = 'multiplayer.html';
});
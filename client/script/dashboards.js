const url = "https://variable-sculptress-6789-e41a.onrender.com";
const userImageElement = document.getElementById("user-image")
const main = document.getElementById("lang-container");
const open = document.querySelector(".logo-menu");
const close = document.querySelector(".logo-close");
const menu = document.querySelector(".menu");
const loginSignup = document.getElementById("resume-button-1");
let proceedButton = document.getElementById("proceed-button");
const username = document.getElementById("username");

open.addEventListener("click", () => {
  open.classList.toggle("hid");
  menu.classList.toggle("hid");
  close.classList.toggle("hid");
});

close.addEventListener("click", () => {
  close.classList.toggle("hid");
  menu.classList.toggle("hid");
  open.classList.toggle("hid");
});

const fetchData = async () => {
  try {
    const res = await fetch(`${url}/languages`);
    const data = await res.json();
    appendCard(data);
  } catch (error) {
    console.log(error);
  }
};

fetchData();

const createCard = (item) => {
  let langCard = document.createElement("div");
  langCard.className = "lang-card";

  langCard.dataset.id = item._id;
  langCard.addEventListener("click", () => {
    putLangIntoLocal(item.languageTitle);
    proceedButton.disabled = false;
    proceedButton.classList.remove("disabled");
    let allCards = document.querySelectorAll(".lang-card");
    langCard.classList.add("selected");
    allCards.forEach((otherCard) => {
      if (otherCard.dataset.id != item._id) {
        otherCard.classList.remove("selected");
      }
    });
  });

  let langImg = document.createElement("img");
  langImg.src = `${url}/${item.languageImage}`;

  let name = document.createElement("p");
  name.innerHTML = item.languageTitle;

  langCard.append(langImg, name);
  return langCard;
};

const appendCard = (data) => {
  main.innerText = "";
  data.map((item) => main.append(createCard(item)));
};

function putLangIntoLocal(lang) {
  localStorage.setItem("lang", lang);
}

proceedButton.addEventListener("click", () => {
  //   toggleMenu();
  if (!proceedButton.classList.contains("disabled")) {
    window.location.href = "../pages/quiz.html";
  }
});

async function fetchUserData() {
  try {
    const response = await fetch(`${url}/users/user/${userId}`);
    const data = await response.json();
    const username = data.username;
    const points = data.totalScore;
    console.log(points);
    console.log(data);

    const usernameElement = document.getElementById("username");
    usernameElement.textContent = `${data.username}`;
    userImageElement.src = `http://localhost:3000/${data.image}`;
    localStorage.setItem("name", username);
    localStorage.setItem("points", data.totalScore);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}
const userId = localStorage.getItem("userId");
fetchUserData();

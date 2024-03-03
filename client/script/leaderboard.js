const url = "https://variable-sculptress-6789-e41a.onrender.com";
const main = document.getElementById("leaderboard");
const mainLeaderboard = document.getElementById("leader-container");
const fetchData = async () => {
  try {
    let res = await fetch(`${url}/users/user?sort=totalScore&order=desc`);
    let data = await res.json();
    appendLeaderboard(data);
    console.log(data);
    // appendScore(data);
  } catch (error) {
    console.log(error);
  }
};

fetchData();

const createLeaderboardCard = (item, index) => {
  const leaderCard = document.createElement("div");
  leaderCard.className = "leader-card";

  const leaderCont = document.createElement("div");
  leaderCont.className = "leader-cont";

  const leaderRank = document.createElement("span");
  leaderRank.className = "leader-rank";
  leaderRank.id = "leader-rank";
  leaderRank.innerHTML = index + 1;

  const img = document.createElement("img");
  img.src = "../assets/images/ganjaboy.png";
  img.alt = "ganja";

  const leaderDetails = document.createElement("div");
  leaderDetails.className = "leader-details";

  const username = document.createElement("p");
  username.id = "username";
  username.innerText = `${item.username}`;

  const p = document.createElement("p");
  const userScore = document.createElement("span");
  userScore.id = "user-score";

  userScore.innerHTML = `${item.totalScore} Points`;

  leaderCard.append(leaderCont, leaderDetails);
  leaderCont.append(leaderRank, img);
  leaderDetails.append(username, p);

  p.append(userScore);

  const medal = document.createElement("img");
  if (index + 1 === 1) {
    medal.src = "../assets/medals/gold-medal.png";
    leaderCard.append(medal);
  } else if (index + 1 === 2) {
    medal.src = "../assets/medals/silver-medal.png";
    leaderCard.append(medal);
  } else if (index + 1 === 3) {
    medal.src = "../assets/medals/bronze-medal.png";
    leaderCard.append(medal);
  }

  return leaderCard;
};

const appendLeaderboard = (data) => {
  mainLeaderboard.innerHTML = "";
  // a.innerHTML = "See All Rankings";
  data.forEach((item, index) => {
    // if(index<3){
    mainLeaderboard.append(createLeaderboardCard(item, index));
    // }
  });
};

// function createCard(item, index) {
//   //   const i = 0;
//   const table = document.createElement("table");
//   const tr = document.createElement("tr");
//   const tdIdx = document.createElement("td");
//   tdIdx.className = "number";
//   tdIdx.innerHTML = index + 1;

//   const name = document.createElement("td");
//   name.className = "name";
//   name.innerHTML = `${item.username}`;

//   const score = document.createElement("td");
//   score.innerHTML = `${item.totalScore}`;
//   score.className = "points";

//   const img = document.createElement("img");
//   img.className = "gold-medal";
//   img.src =
//     "https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true";
//   img.alt = "medal";

//   if (tdIdx.innerHTML === "1") {
//     score.append(img);
//   } else if (tdIdx.innerHTML === "2") {
//     // score.append("");
//   }

//   table.append(tr);
//   tr.append(tdIdx, name, score);

//   return table;
// }

// function appendScore(data) {
//   main.innerHTML = "";
//   const ribbion = document.createElement("div");
//   ribbion.className = "ribbon";
//   main.append(ribbion);
//   data.forEach((item, index) => {
//     main.append(createCard(item, index));
//   });
// }

// function putLangIntoLocal(lang){
//   localStorage.setItem("lang",lang);
// }

open.addEventListener("click", () => {
  toggleMenu();
});

close.addEventListener("click", () => {
  toggleMenu();
});

proceedButton.addEventListener("click", () => {
  //   toggleMenu();
  if (!proceedButton.classList.contains("disabled")) {
    window.location.href = "../pages/quiz.html";
  }
});

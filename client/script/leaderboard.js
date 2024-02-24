const url = "https://variable-sculptress-6789-e41a.onrender.com";
const main = document.getElementById("leaderboard");
const fetchData = async () => {
  try {
    let res = await fetch(
      `${url}/users/user?sort=totalScore&order=desc`
    );
    let data = await res.json();
    console.log(data);
    appendScore(data);
  } catch (error) {
    console.log(error);
  }
};

fetchData();

function createCard(item) {
  const i = 0;
  const table = document.createElement("table");
  const tr = document.createElement("tr");
  const tdIdx = document.createElement("td");
  tdIdx.className = "number";
//   tdIdx.innerHTML = i++;

  const name = document.createElement("td");
  name.className = "name";
  name.innerHTML = `${item.username}`;

  const score = document.createElement("td");
  score.innerHTML = `${item.totalScore}`;
  score.className = "points";

  const img = document.createElement("img");
  img.className = "gold-medal";
  img.src =
    "https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true";
  img.alt = "medal";

  if (tdIdx.innerHTML === 1) {
    score.append(img);
  }

  table.append(tr);
  tr.append(tdIdx, name, score);

  return table;
}

function appendScore(data) {
  main.innerHTML = "";
  data.map((item) => {
    main.append(createCard(item));
  });
}

const stats = document.getElementById("stats");
const badges= document.getElementById("badges");
const leaderboard = document.getElementById("leaderboard");
const statsSection = document.querySelector(".stats");
const badgesSection= document.querySelector(".badges");
const leaderboardSection = document.querySelector(".leaderboard");

stats.addEventListener("click",()=>{
    leaderboard.classList.remove("selected");
    stats.classList.add("selected");
    badges.classList.remove("selected");
    statsSection.classList.remove("hid");
    badgesSection.classList.add("hid");
    leaderboardSection.classList.add("hid");
})

badges.addEventListener("click",()=>{
    leaderboard.classList.remove("selected");
    stats.classList.remove("selected");
    badges.classList.add("selected");
    statsSection.classList.add("hid");
    badgesSection.classList.remove("hid");
    leaderboardSection.classList.add("hid");
})

leaderboard.addEventListener("click",()=>{
    leaderboard.classList.add("selected");
    stats.classList.remove("selected");
    badges.classList.remove("selected");
    statsSection.classList.add("hid");
    badgesSection.classList.add("hid");
    leaderboardSection.classList.remove("hid");
})


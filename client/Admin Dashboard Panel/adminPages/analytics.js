const totalLanguage = document.getElementById("totalLanguage");
const totalQuestion = document.getElementById("totalQuestion");

const url = "https://variable-sculptress-6789-e41a.onrender.com";
let token = localStorage.getItem("token");
console.log(token);
const fetchData = async (endpoint) => {
  try {
    const res = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

fetchData("languages")
  .then((data) => {
    totalLanguage.innerHTML = data.length;
  })
  .catch((error) => {
    console.log(error);
  });

fetchData("questions")
  .then((data) => {
    totalQuestion.innerHTML = data.length;
  })
  .catch((error) => {
    console.log(error);
  });

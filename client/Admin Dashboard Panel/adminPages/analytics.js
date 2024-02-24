const totalLanguage = document.getElementById("totalLanguage");
const totalQuestion = document.getElementById("totalQuestion");

const url = "https://variable-sculptress-6789-e41a.onrender.com";

const fetch = async () => {
  try {
    const res = await fetch(`${url}`);
  } catch (error) {
    console.log(error);
  }
};

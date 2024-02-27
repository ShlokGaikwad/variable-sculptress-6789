const totalLanguage = document.getElementById("totalLanguage");
const totalQuestion = document.getElementById("totalQuestion");
const totalUsers = document.getElementById("totalUsers");

const url = "https://variable-sculptress-6789-e41a.onrender.com";
let token = localStorage.getItem("token");
console.log(token);
const fetchData = async (endpoint) => {
  try {
    const res = await fetch(`${url}/${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
};

const handleFetch = async (endpoint, element, property = "length") => {
  try {
    const data = await fetchData(endpoint);
    element.innerHTML = property ? data[property] : data;
  } catch (error) {
    console.error(error);
  }
};

// Example usage:
handleFetch("languages", totalLanguage);
handleFetch("questions", totalQuestion);
handleFetch("users/user", totalUsers);

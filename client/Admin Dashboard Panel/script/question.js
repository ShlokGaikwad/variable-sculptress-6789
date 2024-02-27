
document.addEventListener('DOMContentLoaded', async () => {
    const languageList = document.getElementById('language-list');
    
    const response = await fetch('https://variable-sculptress-6789-e41a.onrender.com/languages');
    const languages = await response.json();
    console.log(languages)
    languages.forEach(language => {
       let card = createCard(language);
       languageList.append(card);
    });
  });
  
  function createCard(languages){
    const languageDiv = document.createElement('div');
    const languageTitle = document.createElement('h1');
    const languageImage = document.createElement('img');
    const languageUpdateButton = document.createElement('button');
    const languageDeleteButton = document.createElement('button');
    const imageURL = `https://variable-sculptress-6789-e41a.onrender.com/${languages.languageImage}`
    languageTitle.textContent = languages.languageTitle  ;
    languageImage.src = imageURL;
    languageUpdateButton.textContent = "Update" ;
    languageDeleteButton.textContent = "Delete" ;

    languageDiv.append(languageImage,languageTitle,languageUpdateButton,languageDeleteButton);
    return languageDiv ;
  }
  async function updateLanguage(languageId) {
  }
  
  async function deleteLanguage(languageId) {
  }
  
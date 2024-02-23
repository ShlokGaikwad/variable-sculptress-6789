const open = document.querySelector(".logo-menu");
const close = document.querySelector(".logo-close");
const menu = document.querySelector(".menu");
const loginSignup = document.getElementById("resume-button-1");
let proceedButton = document.getElementById("proceed-button")

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

// langCard.addEventListener("click",()=>{
//     // putLangIntoLocal(item);
//     proceedButton.disabled=false;
//     proceedButton.classList.remove("disabled");
//     let allCards= document.querySelectorAll(".lang-card");
//     langCard.classList.add('selected');
//     allCards.forEach((otherCard)=>{
//         if(otherCard.dataset.id!=item.id){
//             otherCard.classList.remove('selected');
//         }
//     })
// })
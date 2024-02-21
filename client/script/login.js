const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
  container.classList.remove("sign-up-mode");
});




// ================================== refrence=============================================

// const container = document.getElementById("container");
// const registerBtn = document.getElementById("register");
// const loginBtn = document.getElementById("login");
// let loginpasswordInput = document.getElementById("loginpassword");
// let loginemailInput = document.getElementById("logindata");
// let baseUrl = `https://mockserver-aq5n.onrender.com`;
// let userUrl = `${baseUrl}/users`;
// let siginBtn = document.getElementById("loginbtnSign");
// let userData;
// let toast = document.querySelector(".toast");
// let toastText = document.querySelector(".toast-text");
// let toastClose = document.querySelector(".toast-close");




// //Signup
// let signupFirstNameInput = document.getElementById("firstname-signup");
// let signupLastNameInput = document.getElementById("lastname-signup");
// let signupEmailInput = document.getElementById("email-signup");
// let signupPhoneInput = document.getElementById("phone-signup");
// let signupPasswordInput = document.getElementById("password-signup");
// let signupConfirmPasswordInput = document.getElementById("confirm-password");
// let signupBtn = document.getElementById("signup-btn");

// registerBtn.addEventListener("click", () => {
//   container.classList.add("active");
// });

// loginBtn.addEventListener("click", () => {
//   container.classList.remove("active");
// });

// async function fetchUsers() {
//   try {
//     let res = await fetch(`${userUrl}`);
//     let data = await res.json();
//     console.log(data);
//     userData = data;
//   } catch (error) {
//     console.log(error);
//   }
// }
// fetchUsers();

// function checkUsers(data) {
//   let obj = {
//     email: loginemailInput.value,
//     password: loginpasswordInput.value,
//   };
//   for (let i = 0; i < data.length; i++) {
//     if (
//       (data[i].email == obj.email || data[i].phone == obj.email) &&
//       data[i].password == obj.password
//     ) {
//       putUsersIntoLocal(data[i]);
//       return true;
//     }
//   }
//   return false;
// }

// function putUsersIntoLocal(data) {
//   localStorage.setItem("user", JSON.stringify(data));
// }

// siginBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log("hi");
//   if (checkUsers(userData)) {
//     toastIntoAction("Login Successful", "success");
//     setTimeout(() => {
//       window.location.href = "../rantu/index.html";
//     },1200)
   
//   } else {
//     toastIntoAction("User doesnot exist or Invalid Credentials", "alert");
//   }
// });

//SignUp

// async function addUser(){
//     try{
//         let obj = {
//             id: userData.length + 1,
//             firstName:signupFirstNameInput.value,
//             lastName:signupLastNameInput.value,
//             email:signupEmailInput.value,
//             phone:signupPhoneInput.value,
//             password:signupConfirmPasswordInput.value,
//             bankDetails:{
//                 passbookId:userData.length + 1,
//                 bankName:"",
//                 image:"",
//                 cardNumber:"",
//                 accountNumber:"",
//                 ifscCode:"",
//                 branch:""
//             }

//         }
//         let passbookData = {
//             id: userData.length + 1,
//             amount: 1000,
//             transactions: []
//         }
//         let passResponse = await fetch(`${baseUrl}/
//         passbook`,{
//             method:"POST",
//             headers:{
//                 "Content-Type":"application/json"
//             },
//             body:JSON.stringify(passbookData)
//         })
//         let passData = await passResponse.json();
//         console.log(passData);
//         let res = await fetch(`${userUrl}`,{
//             method:"POST",
//             headers:{
//                 "Content-Type":"application/json"
//             },
//             body:JSON.stringify(obj)
//         })
//         let data = await res.json();
//         console.log(data);
//     }
//     catch(error){
//         console.log(error);
//     }
// }

// function checkExistingUsers(data) {
//   let obj = {
//     email: signupEmailInput.value,
//     phone: signupPhoneInput.value,
//   };
//   for (let i = 0; i < data.length; i++) {
//     if (data[i].email == obj.email || data[i].phone == obj.phone) {
//       return true;
//     }
//   }
//   return false;
// }

// signupBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   console.log("hi");
//   if (
//     !signupFirstNameInput.value ||
//     !signupLastNameInput.value ||
//     !signupEmailInput.value ||
//     !signupPhoneInput.value ||
//     !signupPasswordInput.value ||
//     !signupConfirmPasswordInput.value
//   ) {
//     toastIntoAction("All fields are required. Please fill in all the fields.", "alert");
//     return; // Prevent further execution
//   }
//   if(signupPhoneInput.value?.length<10){
//     toastIntoAction("Phone number must be a 10 digit number!","alert");
//     return;
//   }
//   if (signupPasswordInput.value !== signupConfirmPasswordInput.value) {
//     toastIntoAction("Passwords do not match. Please try again.", "alert");
//     return;
//   }
//   if(!validatePassword(signupPasswordInput.value)){
//     toastIntoAction("Password should contain 1 special character one number and one uppercase letter and atleast 8 characters", "alert");
//     return;
//   }
//   if (checkExistingUsers(userData)) {
//     toastIntoAction(
//       "Account Already Exists with this Email or Phone Number. Please SignIn!", "alert"
//     );
//   } else {
//     let obj = {
//       id: userData.length + 1,
//       firstName: signupFirstNameInput.value,
//       lastName: signupLastNameInput.value,
//       email: signupEmailInput.value,
//       phone: signupPhoneInput.value,
//       password: signupConfirmPasswordInput.value,
//       userImage:"../assets/user/user.png",
//       bankDetails: {
//         passbookId: userData.length + 1,
//         bankName: "",
//         image: "",
//         cards:[],
//         accountNumber: "",
//         ifscCode: "",
//         branch: "",
//       },
//     };
//     putUsersIntoLocal(obj);
//     window.location.href = "../yuvraj/index.html";
//   }
// });

// function toastIntoAction(params, type){
//  toastText.innerText = params;
// //  toast.classList.remove("hidden");
// toast.className = "";
//  toast.classList.add(`${type}`, "toast");
//  toastClose.addEventListener("click", ()=>{
//      toast.classList.add("hiddentoast");
//  })
//   setTimeout(()=>{
//       toast.classList.add("hiddentoast");
//   },4000)
// }

// function validatePassword(password) {
//   // Password validation criteria
//   const hasUpperCase = /[A-Z]/.test(password);
//   const hasLowerCase = /[a-z]/.test(password);
//   const hasNumber = /\d/.test(password);
//   const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
//   const isLongEnough = password.length >= 8;

//   // Check all criteria are met
//   return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough;
// }




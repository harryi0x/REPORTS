// ==========================================
// REGISTER SYSTEM
// ==========================================


// ==========================================
// SELECT REGISTER FORM
// ==========================================

const registerForm = document.getElementById("registerForm");


// ==========================================
// SELECT INPUTS
// ==========================================

const registerName = document.getElementById("registerName");

const registerEmail = document.getElementById("registerEmail");

const registerPassword = document.getElementById("registerPassword");

const confirmPassword = document.getElementById("confirmPassword");


// ==========================================
// GET USERS FROM LOCAL STORAGE
// ==========================================

let users = JSON.parse(localStorage.getItem("users")) || [];


// ==========================================
// REGISTER FORM SUBMIT
// ==========================================

registerForm.addEventListener("submit", function (event) {

    // Stop page refresh
    event.preventDefault();


    // ======================================
    // GET FORM VALUES
    // ======================================

    const name = registerName.value.trim();

    const email = registerEmail.value.trim().toLowerCase();

    const password = registerPassword.value;

    const confirm = confirmPassword.value;


    // ======================================
    // CHECK EMPTY FIELDS
    // ======================================

    if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirm === ""
    ) {

        alert("Please fill all fields.");

        return;
    }


    // ======================================
    // CHECK PASSWORD MATCH
    // ======================================

    if (password !== confirm) {

        alert("Passwords do not match.");

        return;
    }


    // ======================================
    // CHECK EXISTING EMAIL
    // ======================================

    const existingUser = users.find(function (user) {

        return user.email === email;

    });


    if (existingUser) {

        alert("This email is already registered.");

        return;
    }


    // ======================================
    // CREATE NEW USER
    // ======================================

    const newUser = {

        name: name,

        email: email,

        password: password,

        role: "user"

    };


    // ======================================
    // ADD USER TO ARRAY
    // ======================================

    users.push(newUser);


    // ======================================
    // SAVE USERS TO LOCAL STORAGE
    // ======================================

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );


    // ======================================
    // SUCCESS MESSAGE
    // ======================================

    alert("Registration successful! Please login.");


    // ======================================
    // GO TO LOGIN PAGE
    // ======================================

    window.location.href = "login.html";

});
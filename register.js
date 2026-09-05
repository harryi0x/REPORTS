const registerForm = document.getElementById("registerForm");
const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");
const confirmPassword = document.getElementById("confirmPassword");

let users = JSON.parse(localStorage.getItem("users")) || [];

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = registerName.value.trim();
    const email = registerEmail.value.trim().toLowerCase();
    const password = registerPassword.value;
    const confirm = confirmPassword.value;

    if (
        name === "" ||
        email === "" ||
        password === "" ||
        confirm === ""
    ) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirm) {
        alert("Passwords do not match.");
        return;
    }

    const existingUser = users.find(function (user) {
        return user.email === email;
    });

    if (existingUser) {
        alert("This email is already registered.");
        return;
    }

    const newUser = {
        name: name,
        email: email,
        password: password,
        role: "user"
    };

    users.push(newUser);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Registration successful! Please login.");

    window.location.href = "login.html";
});
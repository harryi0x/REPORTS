const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
let users = JSON.parse(localStorage.getItem("users")) || [];
loginForm.addEventListener("submit", function (event) {
 event.preventDefault();
    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;
    if (email === "" || password === "") {
        alert("Please enter email and password.");
        return;
    }
    const user = users.find(function (user) {
        return (
            user.email === email &&
            user.password === password
        );
    });
    if (!user) {
        alert("Invalid email or password.");
        return;
    }
    if (
        email === "admin@gmail.com" &&
        password === "admin1234"
    ) {
        user.role = "admin";
    } else {
        user.role = "user";
    }
    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );
    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );
    if (user.role === "admin") {
        alert("Admin login successful!");
    } else {
        alert("Login successful!");
    }
    window.location.href = "index.html";
});
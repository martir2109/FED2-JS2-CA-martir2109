import { showError, clearError, togglePassword } from "../utils.js";

export async function login({ email, password }) {
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    const token = data.accessToken || data.data?.accessToken;
    const user = data || data.data;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));

    const userData = user.data || user;
    localStorage.setItem(
      "userName",
      userData.name || user.data.username || userData.email || "User"
    );

    return { token, user };
  } catch (error) {
    throw error;
  }
}

document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let hasError = false;

    if (!email.trim()) {
      showError("email", "Email cannot be empty.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showError("email", "Invalid email format.");
      hasError = true;
    } else {
      clearError("email");
    }

    if (!password.trim()) {
      showError("password", "Password cannot be empty.");
      hasError = true;
    } else {
      clearError("password");
    }

    if (hasError) return;

    try {
      const { token, user } = await login({ email, password });
      alert("Login successful!");
      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1000);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });

const inputfield = document.querySelectorAll(".inputfield");

inputfield.forEach((input) => {
  input.addEventListener("focus", () => {
    clearError(input.id);
  });

  input.addEventListener("input", () => {
    if (input.value.trim()) {
      clearError(input.id);
    }
  });

  input.addEventListener("input", () => {
    const value = input.value;

    if (value.endsWith("@")) {
      input.value = `${value}stud.noroff.no`;
    }
  });
});

const passwordCheckbox = document.getElementById("show-password");
if (passwordCheckbox) {
  passwordCheckbox.addEventListener("change", togglePassword);
}

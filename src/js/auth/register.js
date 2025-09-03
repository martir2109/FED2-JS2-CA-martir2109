import { showError, clearError, togglePassword } from "../utils.js";
import { API_BASE_URL } from "../utils.js";
import { API_ENDPOINTS } from "../utils.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    let hasError = false;

    if (!name) {
      showError("name", "Name cannot be empty.");
      hasError = true;
    } else {
      clearError("name");
    }

    if (!email) {
      showError("email", "Email cannot be empty.");
      hasError = true;
    } else if (!/^[\w\-.]+@(stud\.)?noroff\.no$/.test(email)) {
      showError("email", "Invalid Noroff email format.");
      hasError = true;
    } else {
      clearError("email");
    }

    if (!password) {
      showError("password", "Password cannot be empty.");
      hasError = true;
    } else if (password.length < 8) {
      showError("password", "Password must be at least 8 characters long.");
      hasError = true;
    } else {
      clearError("password");
    }

    if (hasError) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            venueManager: false,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.errors?.[0]?.message || `HTTP ${response.status}`;
        alert("Error: " + errorMessage);
        return;
      }

      alert("User registered successfully!");

      setTimeout(() => {
        window.location.href = "/auth/login/index.html";
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
      alert("Something went wrong while registering.");
    }
  });

  const inputs = document.querySelectorAll(".inputfield");

  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      clearError(input.id);
    });

    input.addEventListener("input", () => {
      if (input.value.trim()) {
        clearError(input.id);
      }
    });

    const emailInput = document.getElementById("email");

    emailInput.addEventListener("input", () => {
      if (
        emailInput.value.endsWith("@") &&
        !emailInput.value.includes("noroff.no")
      ) {
        emailInput.value += "stud.noroff.no";
      }
    });
  });
});

const passwordCheckbox = document.getElementById("show-password");
if (passwordCheckbox) {
  passwordCheckbox.addEventListener("change", togglePassword);
}

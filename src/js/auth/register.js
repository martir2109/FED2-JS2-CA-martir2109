import { togglePassword } from "../utils.js";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_content,
} from "../apiConfig.js";

/**
 * Registers a new user with name, email and password.
 * @param {object} credentials - An object with user's name, email and password.
 * @param {string} credentials.name - The user's name.
 * @param {string} credentials.email - The user's email (must be a stud.noroff.no email).
 * @param {string} credentials.password - The user's password (min 8 characters).
 * @returns {Promise<Object>} Returns a promise with the registration response data.
 * @throws {Error} Throws an error if registration fails
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("register-form");

  if (!form) return;

  /**
   * Runs when the register form is submitted.
   * Validates the name, email and password input fields, shows errors if needed, and register the user.
   * @param {Event} event - The form submission event.
   */
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`,
        {
          method: "POST",
          headers: API_Headers_content(),
          body: JSON.stringify({
            name,
            email,
            password,
            venueManager: false,
          }),
        },
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
});

/**
 * Toggles password visibility when checkbox is changed.
 * @param {Event} event - The change event from the checkbox
 */

const passwordCheckbox = document.getElementById("show-password");
if (passwordCheckbox) {
  passwordCheckbox.addEventListener("change", togglePassword);
}

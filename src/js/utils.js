/**
 * Show error message below an input field.
 * @param {string} inputId - The ID of the input field.
 * @param {string} message - The error message to display.
 */
export function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(`${inputId}-error`);
  input.classList.add("input-error");
  errorSpan.textContent = message;
}

/**
 * Clear the error message for a given input.
 * @param {string} inputId - The ID of the input field
 */
export function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(`${inputId}-error`);
  input.classList.remove("input-error");
  errorSpan.textContent = "";
}

/**
 * Toggle password visibility on the password input.
 */
export function togglePassword() {
  const passwordInput = document.getElementById("password");
  const checkbox = document.getElementById("show-password");

  if (checkbox.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

/**
 * API base url
 */
export const API_BASE_URL = "https://v2.api.noroff.dev";

/**
 * Endpoints for authentication and social API calls.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CREATE_API_KEY: "/auth/create-api-key",
  },
  SOCIAL: {
    PROFILES: "/social/profiles",
    POSTS: "/social/posts",
    POSTS_FOLLOWING: "/social/posts/following",
  },
};

/**
 * Class to handle live word counting in a textarea.
 */
export class Count {
  constructor() {
    this.textarea = document.getElementById("body");
    this.wordCount = document.getElementById("word-count");
    window.addEventListener("load", this.updateCount.bind(this));
    this.textarea.addEventListener("input", this.updateCount.bind(this));
  }

  /**
   * Count the number of words in the textarea.
   * @returns {number} Word count
   */
  countWords() {
    const value = this.textarea.value.trim();
    if (!value) return 0;
    return value.split(/\s+/).length;
  }

  /**
   * Update the word count display.
   */
  updateCount() {
    const numWords = this.countWords();
    this.wordCount.textContent = `Words: ${numWords}`;
  }
}

/**
 * Attach listeners to input to clear error message when typing or focusing.
 * @param {string[]} inputSelectors - Array of CSS selectors for input.
 */
export function attachInputListeners(inputSelectors) {
  const inputs = document.querySelectorAll(inputSelectors.join(", "));
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      clearError(input.id);
    });

    input.addEventListener("input", () => {
      if (input.value.trim()) {
        clearError(input.id);
      }
    });
  });
}

/**
 * Remove loader once the window has loaded.
 */
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader-container");
  if (!loader) return;

  loader.classList.add("loaderHidden");

  loader.addEventListener("transitionend", () => {
    loader.remove();
  });
});

/**
 * Headers with access token, API key, and JSOn content type.
 * @param {string} accessToken - User access token.
 * @param {string} apiKey - API key.
 * @returns {object} Headers object.
 */
export const API_Headers_accesstoken_content_apikey = (
  accessToken,
  apiKey
) => ({
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
  "X-Noroff-API-Key": apiKey,
});

/**
 * Headers with access token and API key.
 * @param {string} accessToken - User access token.
 * @param {string} apiKey - API key.
 * @returns {object} Headers object.
 */
export const API_Headers_accesstoken_apikey = (accessToken, apiKey) => ({
  Authorization: `Bearer ${accessToken}`,
  "X-Noroff-API-Key": apiKey,
});

/**
 *
 * @returns {object} Headers object.
 */
export const API_Headers_content = () => ({
  "Content-Type": "application/json",
});

/**
 * Retrive authentication credentials from localStorage
 * @returns {{accessToken: string|null, apiKey: string|null}}
 * An object containing the user's access token and API key, or null values if not found.
 */
export function getAuthenticationCredentials() {
  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");
  return { accessToken, apiKey };
}

/**
 * Retrives the stored username from localStorage.
 * If no username is stored it defaults to "User".
 * @returns {object} An object containting the username.
 */
export function getUserName() {
  const userName = localStorage.getItem("userName") || "User";
  return { userName };
}

/**
 * Retrives the stored user data from localStorage.
 * @returns {object} An object containgt the raw user data string.
 */
export function getUser() {
  const userDataString = localStorage.getItem("user");
  return { userDataString };
}

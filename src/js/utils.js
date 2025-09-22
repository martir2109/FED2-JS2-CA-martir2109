export function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(`${inputId}-error`);
  input.classList.add("input-error");
  errorSpan.textContent = message;
}

export function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(`${inputId}-error`);
  input.classList.remove("input-error");
  errorSpan.textContent = "";
}

export function togglePassword() {
  const passwordInput = document.getElementById("password");
  const checkbox = document.getElementById("show-password");

  if (checkbox.checked) {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

export const API_BASE_URL = "https://v2.api.noroff.dev";
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

export class Count {
  constructor() {
    this.textarea = document.getElementById("body");
    this.wordCount = document.getElementById("word-count");
    window.addEventListener("load", this.updateCount.bind(this));
    this.textarea.addEventListener("input", this.updateCount.bind(this));
  }

  countWords() {
    const value = this.textarea.value.trim();
    if (!value) return 0;
    return value.split(/\s+/).length;
  }

  updateCount() {
    const numWords = this.countWords();
    this.wordCount.textContent = `Words: ${numWords}`;
  }
}

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

window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (!loader) return;

  loader.classList.add("loaderHidden");

  loader.addEventListener("transitionend", () => {
    loader.remove();
  });
});

export const API_Headers_accesstoken_content_apikey = (
  accessToken,
  apiKey
) => ({
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
  "X-Noroff-API-Key": apiKey,
});

export const API_Headers_accesstoken_apikey = (accessToken, apiKey) => ({
  Authorization: `Bearer ${accessToken}`,
  "X-Noroff-API-Key": apiKey,
});

export const API_Headers_content = () => ({
  "Content-Type": "application/json",
});

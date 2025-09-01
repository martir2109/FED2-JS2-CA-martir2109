export function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(`${inputId}Error`);
  input.classList.add("input-error");
  errorSpan.textContent = message;
}

export function clearError(inputId) {
  const input = document.getElementById(inputId);
  const errorSpan = document.getElementById(`${inputId}Error`);
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
  },
  SOCIAL: {
    PROFILES: "/social/profiles",
    POSTS: "/social/posts",
  },
};

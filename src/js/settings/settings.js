import {
  showError,
  clearError,
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
  getAuthenticationCredentials,
  getUserName,
  getUser,
} from "../utils.js";

const { accessToken, apiKey } = getAuthenticationCredentials();
const { userName } = getUserName();
const { userDataString } = getUser();

document.addEventListener("DOMContentLoaded", function () {
  loadUserSettings();
  const editAvatarBtn = document.getElementById("edit-avatar-btn");

  if (editAvatarBtn) {
    editAvatarBtn.addEventListener("click", updateAvatarHandler);
  }
});

function loadUserSettings() {
  try {
    if (!accessToken || !userDataString) {
      console.error("No user data found. Redirecting to login.");
      window.location.href = "/auth/login/index.html";
      return;
    }
    const userData = JSON.parse(userDataString);
    const userProfile = userData.data || userData;

    loadUserFormValues(userProfile);
  } catch (error) {
    console.error("Error loading user settings: ", error);
    window.location.href = "/auth/login/index.html";
  }
}

function loadUserFormValues(userProfile) {
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const passwordField = document.getElementById("password");
  const avatarField = document.getElementById("avatar");

  if (avatarField && userProfile.avatar) {
    avatarField.value = userProfile.avatar.url || "";
  }

  if (nameField) {
    nameField.value = userProfile.name || userProfile.userName || "";
  }

  if (emailField) {
    emailField.value = userProfile.email || "";
  }

  if (passwordField) {
    passwordField.value = "**********";
  }
}

async function updateAvatarHandler() {
  const avatarField = document.getElementById("avatar");
  const avatar = avatarField.value.trim();
  let hasError = false;

  if (!avatar || !avatar.startsWith("http")) {
    showError(
      "avatar",
      "Please enter a valid image URL that starts with http or https."
    );
    hasError = true;
  } else {
    clearError("avatar");
  }

  if (hasError) return;

  try {
    const updateAvatar = { avatar: { url: avatar } };
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${userName}`,
      {
        method: "PUT",
        headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
        body: JSON.stringify(updateAvatar),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    alert("Avatar updated!");
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Error updating avatar: ", error);
    alert("Failed to update the avatar");
  }
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
  localStorage.removeItem("user");
  window.location.href = "./index.html";
}

window.logout = logout;

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
  const editProfileBtn = document.getElementById("edit-profile-btn");

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", updateProfileHandler);
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
  const bioField = document.getElementById("bio");

  if (avatarField && userProfile.avatar) {
    avatarField.value = userProfile.avatar.url || "";
  }

  if (bioField) {
    bioField.value = userProfile.bio || "";

    if (!userProfile.bio) bioField.placeholder = "No bio yet";
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

async function updateProfileHandler() {
  const avatarField = document.getElementById("avatar");
  const bioField = document.getElementById("bio");

  const avatar = avatarField.value.trim();
  const bio = bioField.value.trim();

  let hasError = false;

  if (avatar && !avatar.startsWith("http")) {
    showError("avatar", "Avatar URL must start with http or https.");
    hasError = true;
  } else {
    clearError("avatar");
  }

  if (bio.length > 100) {
    showError("bio", "Bio cannot be longer than 100 characters.");
    hasError = true;
  } else {
    clearError("bio");
  }

  if (hasError) return;

  const updateData = {};
  if (avatar) updateData.avatar = { url: avatar };
  if (bio) updateData.bio = bio;

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${userName}`,
      {
        method: "PUT",
        headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
        body: JSON.stringify(updateData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedProfile = {
      ...currentUser.data,
      ...updateData,
    };
    localStorage.setItem("user", JSON.stringify(updatedProfile));

    alert("Profile updated successfully!");
    window.location.href = "./index.html";
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Failed to update profile.");
  }
}

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
  localStorage.removeItem("user");
  window.location.href = "./index.html";
}

window.logout = logout;

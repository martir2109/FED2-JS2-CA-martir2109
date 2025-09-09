document.addEventListener("DOMContentLoaded", function () {
  loadUserSettings();
});

function loadUserSettings() {
  try {
    const userDataString = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("userName");

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

function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
  localStorage.removeItem("user");
  window.location.href = "/index.html";
}

window.logout = logout;

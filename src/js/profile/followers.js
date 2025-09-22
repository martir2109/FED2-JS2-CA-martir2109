import { API_BASE_URL, API_ENDPOINTS } from "../utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const followersOutputContainer = document.getElementById(
    "followers-output-container"
  );
  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");
  const loggedInUser = localStorage.getItem("userName");
  const profileName =
    new URLSearchParams(window.location.search).get("name") || loggedInUser;

  await loadUserProfile();

  async function loadUserProfile() {
    try {
      if (!accessToken || !profileName) {
        console.error("No user data found");
        window.location.href = "../../auth/login/index.html";
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${profileName}?_followers=true`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const userProfile = result.data;

      getFollowers(userProfile.followers || []);
    } catch (error) {
      console.error("Error loading user profile: ", error);
    }
  }

  function getFollowers(profiles) {
    followersOutputContainer.innerHTML = "";

    if (profiles.length > 0) {
      profiles.forEach((profile) => {
        const aHrefLink = document.createElement("a");
        aHrefLink.href = `../../profile/view-profile/index.html?name=${profile.name}`;
        aHrefLink.innerHTML = `
          <div class="followers-profile">
            <p>Username:</p>
            <p class="username">${profile.name || "Unknown user"}</p>
          </div>
        `;
        followersOutputContainer.appendChild(aHrefLink);
      });
    } else {
      followersOutputContainer.innerHTML = `<p>No followers yet.</p>`;
    }
  }
});

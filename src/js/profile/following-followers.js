import { getAuthenticationCredentials, getUserName } from "../utils.js";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.js";

document.addEventListener("DOMContentLoaded", async function () {
  const followingOutputContainer = document.getElementById(
    "following-output-container"
  );
  const followersOutputContainer = document.getElementById(
    "followers-output-container"
  );

  const { accessToken, apiKey } = getAuthenticationCredentials();
  const { userName } = getUserName();

  const profileName =
    new URLSearchParams(window.location.search).get("name") || userName;

  await loadUserProfile();

  async function loadUserProfile() {
    try {
      if (!accessToken || !profileName) {
        console.error("No user data found");
        window.location.href = "../../auth/login/index.html";
        return;
      }

      const followingResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${profileName}?_following=true`,
        { headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey) }
      );

      const followersResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${profileName}?_followers=true`,
        { headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey) }
      );

      if (!followingResponse.ok) {
        throw new Error(
          `Following fetch failed: HTTP ${followingResponse.status}`
        );
      }
      if (!followersResponse.ok) {
        throw new Error(
          `Followers fetch failed: HTTP ${followersResponse.status}`
        );
      }
      const followingData = await followingResponse.json();
      const followersData = await followersResponse.json();

      getFollowing(followingData.data.following || []);
      getFollowers(followersData.data.followers || []);
    } catch (error) {
      console.error("Error loading user profile: ", error);
    }
  }

  /* Get user following */
  function getFollowing(profiles) {
    if (!followingOutputContainer) return;
    followingOutputContainer.innerHTML = "";

    if (profiles.length > 0) {
      profiles.forEach((profile) => {
        const aHrefLink = document.createElement("a");
        aHrefLink.href = `../../profile/view-profile/index.html?name=${profile.name}`;
        aHrefLink.innerHTML = `
          <div class="following-profile">
            <p>Username:</p>
            <p class="username">${profile.name || "Unknown user"}</p>
          </div>
        `;
        followingOutputContainer.appendChild(aHrefLink);
      });
    } else {
      followingOutputContainer.innerHTML = `<p>Don't follow anyone yet.</p>`;
    }
  }

  /* Get user followers */
  function getFollowers(profiles) {
    if (!followersOutputContainer) return;
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

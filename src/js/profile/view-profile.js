import {
  displayPosts,
  loadUserProfileData,
  loadUserPostsData,
} from "../profile/profile-utils.js";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_apikey,
} from "../utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const postsContainer = document.querySelector(".posts-container");
  const nameContainer = document.querySelector(".header h1");
  const emailContainer = document.querySelector(".email-container p");
  const followersContainer = document.querySelector(".followers-container p");
  const followingContainer = document.querySelector(".following-container p");
  const followBtn = document.getElementById("follow-btn");
  const followersLink = document.querySelector(".followers-link");
  const followingLink = document.querySelector(".following-link");
  const avatar = document.getElementById("avatar");

  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");
  const loggedInUser = localStorage.getItem("userName");
  const profileName = new URLSearchParams(window.location.search).get("name");

  if (!profileName) return console.error("No profile name specified in URL");

  let isFollowing = false;

  async function loadProfile() {
    try {
      const userProfile = await loadUserProfileData(
        accessToken,
        apiKey,
        profileName
      );

      nameContainer.textContent = userProfile.name || "Unknown";
      emailContainer.textContent = userProfile.email || "-";
      followersContainer.textContent = userProfile._count?.followers || 0;
      followingContainer.textContent = userProfile._count?.following || 0;

      if (userProfile.avatar) {
        avatar.src = userProfile.avatar.url;
        avatar.alt = userProfile.avatar.alt || "User avatar";
      }

      if (followersLink)
        followersLink.href = `../../profile/followers/index.html?name=${profileName}`;
      if (followingLink)
        followingLink.href = `../../profile/following/index.html?name=${profileName}`;

      if (profileName === loggedInUser && followBtn)
        followBtn.style.display = "none";
      else if (followBtn) followBtn.style.display = "block";

      isFollowing = userProfile.followers?.some((f) => f.name === loggedInUser);
      updateFollowButton();
      setupFollowButton();
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }

  async function loadPosts() {
    try {
      const posts = await loadUserPostsData(accessToken, apiKey, profileName);
      displayPosts(postsContainer, posts);
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
  }

  function updateFollowButton() {
    if (!followBtn) return;
    followBtn.textContent = isFollowing ? "Unfollow" : "+ Follow";
    followBtn.classList.toggle("following", isFollowing);
  }

  function setupFollowButton() {
    if (!followBtn) return;
    followBtn.addEventListener("click", async () => {
      try {
        const action = isFollowing ? "unfollow" : "follow";
        const response = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${profileName}/${action}`,
          {
            method: "PUT",
            headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
          }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        isFollowing = !isFollowing;
        updateFollowButton();
        await loadProfile();
      } catch (error) {
        console.error(
          `Failed to ${isFollowing ? "unfollow" : "follow"}:`,
          error
        );
      }
    });
  }

  await loadProfile();
  await loadPosts();
});

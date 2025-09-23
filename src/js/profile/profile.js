import {
  displayPosts,
  loadUserProfileData,
  loadUserPostsData,
} from "./profile-utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const postsContainer = document.querySelector(".posts-container");
  const emailContainer = document.querySelector(".email-container p");
  const followersContainer = document.querySelector(".followers-container p");
  const followingContainer = document.querySelector(".following-container p");
  const avatar = document.getElementById("avatar");

  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");
  const userName = localStorage.getItem("userName");

  let allPosts = [];
  let displayedPosts = [];

  async function loadProfile() {
    try {
      const userProfile = await loadUserProfileData(
        accessToken,
        apiKey,
        userName
      );

      if (avatar && userProfile.avatar) {
        avatar.src = userProfile.avatar.url;
        avatar.alt = userProfile.avatar.alt || "User avatar";
      }

      if (emailContainer) emailContainer.textContent = userProfile.email || "";
      if (followersContainer)
        followersContainer.textContent = userProfile._count?.followers || 0;
      if (followingContainer)
        followingContainer.textContent = userProfile._count?.following || 0;
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  }

  async function loadPosts() {
    try {
      allPosts = await loadUserPostsData(accessToken, apiKey, userName);
      displayedPosts = [...allPosts];
      displayPosts(postsContainer, displayedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      postsContainer.innerHTML =
        "<p class='error-loading-posts'>Error loading posts. Please try again later.</p>";
    }
  }

  await loadProfile();
  await loadPosts();

  window.refreshPosts = loadPosts;
});

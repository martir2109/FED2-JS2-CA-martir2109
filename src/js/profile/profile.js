import {
  displayPosts,
  loadUserProfileData,
  loadUserPostsData,
  getUserProfileElements,
} from "./profile-utils.js";

import { getAuthenticationCredentials, getUserName } from "../utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  const {
    postsContainer,
    emailContainer,
    followersContainer,
    followingContainer,
    avatar,
  } = getUserProfileElements();

  const { accessToken, apiKey } = getAuthenticationCredentials();
  const { userName } = getUserName();

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

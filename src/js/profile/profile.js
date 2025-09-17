import { API_BASE_URL, API_ENDPOINTS } from "../utils.js";

document.addEventListener("DOMContentLoaded", async function () {
  let allPosts = [];
  let displayedPosts = [];

  const postsContainer = document.querySelector(".posts-container");
  const emailContainer = document.querySelector(".email-container p");
  const followersContainer = document.querySelector(".followers-container p");
  const followingContainer = document.querySelector(".following-container p");
  const accessToken = localStorage.getItem("accessToken");
  const apiKey = localStorage.getItem("apiKey");
  const userName = localStorage.getItem("userName");

  await loadUserProfile();
  await loadUserPosts();

  async function loadUserProfile() {
    try {
      if (!accessToken || !userName) {
        console.error("No user data found");
        window.location.href = "../../auth/login/index.html";
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${userName}?_followers=true&_following=true`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const userProfile = result.data;

      if (emailContainer && userProfile.email) {
        emailContainer.textContent = userProfile.email;
      }

      if (followersContainer) {
        const followersCount = userProfile._count?.followers || 0;
        followersContainer.textContent = followersCount;
      }

      if (followingContainer) {
        const followingCount = userProfile._count?.following || 0;
        followingContainer.textContent = followingCount;
      }
    } catch (error) {
      console.error("Error loading user profile: ", error);
    }
  }

  async function loadUserPosts() {
    try {
      if (!accessToken || !userName) {
        throw new Error("No authentication data found");
      }

      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${userName}/posts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.errors
            ? errorData.errors[0].message
            : `HTTP ${response.status}`
        );
      }

      const result = await response.json();
      allPosts = result.data || [];
      displayedPosts = [...allPosts];

      displayPosts(displayedPosts);
    } catch (error) {
      console.error("Failed to load posts: ", error);
      postsContainer.innerHTML =
        "<p class='error-loading-posts'>Error loading posts. Please try again later.</p>";
    }
  }

  function displayPosts(posts) {
    if (!postsContainer) return;

    postsContainer.innerHTML = posts.length
      ? posts
          .map(
            (post) => `
          <a href="../../post/view/index.html?id=${post.id}">
            <div class="post">
              ${
                post.media?.url
                  ? `<img src="${post.media.url}" alt="Post media" class="post-image">`
                  : `<img src="../../public/images/no image - default image.jpg" alt="Default image" class="post-media">`
              }
            </div>
          </a>
        `
          )
          .join("")
      : "<p class='no-posts-text'>No posts found. Create your first post by clicking the plus + icon!</p>";
  }

  function refreshPosts() {
    loadUserPosts();
  }
  window.refreshPosts = refreshPosts;
});

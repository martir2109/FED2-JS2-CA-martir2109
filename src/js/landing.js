import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_apikey,
  getAuthenticationCredentials,
  getUserName,
} from "./utils.js";

function isUserLoggedIn() {
  const { accessToken } = getAuthenticationCredentials();
  return accessToken !== null;
}

function createLoggedOutContent() {
  return `
     <div class="welcome-container">
     <div class="welcome-header-container typewriter">
      <h1>Welcome to Posty!</h1>
      </div>
      <div class="intro-container">
      <h2>Got something to share? Post it! 
      </br>
      Register now and connect with people just like you.</h2>
      </div>
      <div class="landing-page-btn-container">
        <a href="../../auth/login/" class="landing-page-btn">Login</a>
        <a href="../../auth/register/" class="landing-page-btn">Register</a>
      </div>
    </div>
    `;
}

function createLoggedInContent() {
  const { userName } = getUserName();
  return `
    <div class="feed-container">
    <div class="welcome-back-container">
      <h1>Welcome back, ${userName}!</h1>
      </div>
      <div class="feed-header-container">
        <h2>Feed</h2>
      </div>
      <div class="feed-posts-container">
        <div id="feed-posts" class="feed-posts"></div>
      </div>
    </div>
    `;
}

document.addEventListener("DOMContentLoaded", async () => {
  const landingSection = document.querySelector(".landing-page-section");

  if (isUserLoggedIn()) {
    landingSection.innerHTML = createLoggedInContent();
    loadRecentPosts();
  } else {
    landingSection.innerHTML = createLoggedOutContent();
  }

  async function loadRecentPosts() {
    const { accessToken, apiKey } = getAuthenticationCredentials();
    const { userName } = getUserName();
    const container = document.getElementById("feed-posts");
    const feedContainer = document.querySelector(".feed-posts-container");

    if (!accessToken || !container) return;

    try {
      const followingResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS_FOLLOWING}?_author=true&limit=20`,
        {
          headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
        }
      );

      const ownPostsResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${userName}/posts?_author=true&limit=20`,
        {
          headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
        }
      );

      let allPosts = [];

      if (followingResponse.ok) {
        const followingData = await followingResponse.json();
        allPosts = [...followingData.data];
      }

      if (ownPostsResponse.ok) {
        const ownData = await ownPostsResponse.json();
        allPosts = [...allPosts, ...ownData.data];
      }

      if (allPosts.length > 0) {
        allPosts.sort((a, b) => new Date(b.created) - new Date(a.created));

        displayRecentPosts(allPosts.slice(0, 9));
      } else {
        feedContainer.innerHTML = `
        <div class="landingpage-message-container">
        <p class="landingpage-post-message">No posts found. Create your first post!</p>
        </div>`;
        return;
      }

      if (!followingResponse.ok) {
        console.error(
          "Following posts failed:",
          followingResponse.status,
          followingResponse.statusText
        );
      }
      if (!ownPostsResponse.ok) {
        console.error(
          "Own posts failed:",
          ownPostsResponse.status,
          ownPostsResponse.statusText
        );
      }
    } catch (error) {
      feedContainer.innerHTML =
        '<p class="landingpage-post-error">Unable to load posts</p>';
      console.error("Error loading posts:", error);
    }
  }

  function displayRecentPosts(posts) {
    const container = document.getElementById("feed-posts");
    if (!container || !posts.length) return;

    container.innerHTML = posts
      .map(
        (post) => `
        <a href="../../post/view/index.html?id=${post.id}">
    <div class="post">
    <h4>${post.author?.name || "No username"}</h4>
    ${
      post.media?.url
        ? `<img src="${post.media.url}" alt="Post media" class="post-media" loading="lazy">`
        : `<img src="../../public/images/no image - default image.jpg" class="post-media loading="lazy">`
    }
    <p class="post-body">${
      post.body ? post.body.substring(0, 50) + "..." : ""
    }</p>
    </div>
    </a>
    `
      )
      .join("");
  }
});

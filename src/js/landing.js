import { getAuthenticationCredentials, getUserName } from "./utils.js";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_apikey,
} from "./apiConfig.js";

function isUserLoggedIn() {
  const { accessToken } = getAuthenticationCredentials();
  return accessToken !== null;
}

function createLoggedOutContent() {
  return `
     <div class="min-h-screen bg-gray-100 flex items-center justify-center px-6">
      <div class="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10 text-center">
        <h1 class="text-5xl font-bold text-primary mb-6">
          Welcome to Posty!
        </h1>
    
        <p class="text-lg text-gray-600 max-w-xl mx-auto mb-10">
         Got something to share? Post it!
         </br> Register now and connect with people just like you.
        </p>
    
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/register/index.html"
            class="px-8 h-14 flex items-center justify-center rounded-full bg-secondary text-primary font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Get Started
          </a>
          <a
            href="/auth/login/index.html"
            class="px-8 h-14 flex items-center justify-center rounded-full bg-primary text-white font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Login
          </a>
        </div>
      </div>
    </div>
    `;
}

function createLoggedInContent() {
  const { userName } = getUserName();
  return `
    <div class="gap-8 mb-10 w-full min-h-screen mt-[120px] flex flex-col items-center">
    <div class="w-[90%] h-fit text-center">
      <h1 class="text-huge">Welcome back, ${userName}!</h1>
      </div>
      <div class="flex w-[90%] max-w-[1200px] border-b border-gray-500">
        <h2 class="text-huge">Feed</h2>
      </div>
      <div class="feed-posts-container w-[90%] max-w-[1200px] mt-6">
        <div id="feed-posts" class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center"> </div>
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
        },
      );

      const ownPostsResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${userName}/posts?_author=true&limit=20`,
        {
          headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
        },
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

        displayRecentPosts(allPosts);
      } else {
        feedContainer.innerHTML = `
        <div class="landingpage-message-container">
        <p class="text-gray-500 text-center text-[1.5rem] md:text-[1.3rem]">No posts found. Create your first post!</p>
        </div>`;
        return;
      }

      if (!followingResponse.ok) {
        console.error(
          "Following posts failed:",
          followingResponse.status,
          followingResponse.statusText,
        );
      }
      if (!ownPostsResponse.ok) {
        console.error(
          "Own posts failed:",
          ownPostsResponse.status,
          ownPostsResponse.statusText,
        );
      }
    } catch (error) {
      feedContainer.innerHTML =
        '<p class="text-red-600 text-center">Unable to load posts</p>';
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
    <div class="bg-white w-[280px] min-h-[400px] rounded-xl border border-gray-300 p-4 flex flex-col gap-4 hover:shadow-xl/30 hover:-translate-y-5 transition transform duration-300 ease">
        <div class="flex gap-2 items-center"> 
        <div class="size-10 bg-primary p-2 rounded-md shrink-0 flex items-center justify-center text-secondary text-sm font-bold" style="border-radius: 50%;">
        ${post.author?.name?.slice(0, 2).toUpperCase() || "?"}
          </div>
       <h4 class="text-medium font-bold">${post.author?.name || "No username"}</h4>
      </div>
     <div class="w-full h-[200px] rounded-lg overflow-hidden shrink-0">
  ${
    post.media?.url
      ? `<img src="${post.media.url}" alt="Post media" class="w-full h-full object-contain block" loading="lazy">`
      : `<img src="../../public/images/no image - default image.jpg" class="w-full h-full object-cover block" loading="lazy">`
  }
</div>
    <p class="wrap-break-word w-full h-[50px] text-tiny">${
      post.body ? post.body.substring(0, 30) + "..." : ""
    }</p>
    </div>
    </a>
    `,
      )
      .join("");
  }
});

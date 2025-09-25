import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_apikey,
  API_Headers_accesstoken_content_apikey,
  getAuthenticationCredentials,
} from "../utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  let allPosts = [];
  let displayedPosts = [];

  const searchInput = document.getElementById("search-inputfield");
  const searchOutputContainer = document.getElementById(
    "search-output-container"
  );
  const { accessToken, apiKey } = getAuthenticationCredentials();
  const postsContainer = document.getElementById("explore-posts-container");

  await loadExplorePosts();

  searchOutputContainer.innerHTML = "";

  async function searchPosts(query) {
    const response = await fetch(
      `${API_BASE_URL}${
        API_ENDPOINTS.SOCIAL.POSTS
      }/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || data;
  }

  async function searchProfiles(query) {
    const response = await fetch(
      `${API_BASE_URL}${
        API_ENDPOINTS.SOCIAL.PROFILES
      }/search?q=${encodeURIComponent(query)}`,
      {
        method: "GET",
        headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.data || data;
  }

  function getResults(posts, profiles) {
    searchOutputContainer.innerHTML = "";

    if (posts.length > 0) {
      posts.forEach((post) => {
        const aHrefLink = document.createElement("a");
        aHrefLink.href = `../../post/view/index.html?id=${post.id}`;
        aHrefLink.innerHTML = `
            <div class="search-output-post" id="search-output-post">
            <p class="post-title" id="post-title">${
              post.title || "Untitled post"
            }</p>
            </div>
            `;
        searchOutputContainer.appendChild(aHrefLink);
      });
    }

    if (profiles.length > 0) {
      profiles.forEach((profile) => {
        const aHrefLink = document.createElement("a");
        aHrefLink.href = `../../profile/view-profile/index.html?name=${profile.name}`;
        aHrefLink.innerHTML = `
            <div class="search-output-profile" id="search-output-profile">
            <p>Username:</p>
            <p class="username" id="username">${
              profile.name || "Unknown user"
            }</p>
          </div>
            `;
        searchOutputContainer.appendChild(aHrefLink);
      });
    }
    if (posts.length === 0 && profiles.length === 0) {
      searchOutputContainer.innerHTML = `
          <p>No results found.</p>
        `;
    }
  }
  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    const query = searchInput.value.trim();

    if (!query) {
      searchOutputContainer.innerHTML = "";
      return;
    }

    searchTimeout = setTimeout(async () => {
      try {
        const [posts, profiles] = await Promise.all([
          searchPosts(query),
          searchProfiles(query),
        ]);
        getResults(posts, profiles);
      } catch (error) {
        console.error("Search error: ", error);
        searchOutputContainer.innerHTML = `
            <p>Failed to fetch results.</p>
            `;
      }
    }, 200);
  });

  async function loadExplorePosts() {
    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}?_author=true&limit=24`,
        {
          method: "GET",
          headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
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

      displayExplorePosts(displayedPosts);
    } catch (error) {
      console.error("Failed to load posts: ", error);
      if (postsContainer) {
        postsContainer.innerHTML =
          "<p class='error-loading-posts'>Error loading posts. Please try again later.</p>";
      }
    }
  }

  function displayExplorePosts(posts) {
    if (!postsContainer) return;
    postsContainer.innerHTML = posts
      .map(
        (post) => `
        <a href="../../post/view/index.html?id=${post.id}" class="explore-link">
          <div class="explore-post">
            <h4>${post.author?.name || "No username"}</h4>
            ${
              post.media?.url
                ? `<img src="${post.media.url}" alt="Post media" class="explore-post-media" loading="lazy">`
                : `<img src="../../public/images/no image - default image.jpg" alt="Default image" class="explore-post-media" loading="lazy">`
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

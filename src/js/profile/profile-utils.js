import { API_Headers_accesstoken_content_apikey } from "../utils.js";
import { API_BASE_URL, API_ENDPOINTS } from "../apiConfig.js";

/**
 * Display posts inside the postContainer
 * @param {HTMLElement} postsContainer - The HTML element where posts will be displayed
 * @param {Array} posts - Array of post objects
 */
export function displayPosts(postsContainer, posts) {
  if (!postsContainer) return;

  postsContainer.innerHTML = posts.length
    ? posts
        .map(
          (post) => `
        <a href="../../post/view/index.html?id=${post.id}">
          <div class="post">
            ${
              post.media?.url
                ? `<img src="${post.media.url}" alt="Post media" class="post-image" loading="lazy">`
                : `<img src="../../public/images/no image - default image.jpg" alt="Default image" class="post-media" loading="lazy">`
            }
          </div>
        </a>
      `
        )
        .join("")
    : "<p class='no-posts-text'>No posts found. Create your first post by clicking the plus + icon!</p>";
}

/**
 * Load user profile data
 * Fetch and return user profile data from the API
 * @param {string} accessToken - User's access token for API authentication
 * @param {string} apiKey - User's API key
 * @param {string} userName - User's name
 * @returns {Promise<Object>} The user profile data
 */
export async function loadUserProfileData(accessToken, apiKey, userName) {
  if (!accessToken || !userName)
    throw new Error("No authentication data found");

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${userName}?_followers=true&_following=true`,
    {
      method: "GET",
      headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors?.[0]?.message || `HTTP ${response.status}`
    );
  }

  const result = await response.json();
  return result.data;
}

/**
 * Load user posts data
 * Fetch and return user posts from the API
 * @param {string} accessToken - User's access token for API authentication
 * @param {string} apiKey - User's API key
 * @param {string} userName - User's name
 * @returns {Promise<Array>} Array of post objects
 */
export async function loadUserPostsData(accessToken, apiKey, userName) {
  if (!accessToken || !userName)
    throw new Error("No authentication data found");

  const response = await fetch(
    `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.PROFILES}/${userName}/posts`,
    {
      method: "GET",
      headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.errors?.[0]?.message || `HTTP ${response.status}`
    );
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * Returns the main elements for a user profile page.
 * For both the logged-in user's profile and other users' profiles.
 * @returns {object} An object containing:
 *   - postsContainer: The container element for user posts.
 *   - emailContainer: The paragraph element displaying the user's email.
 *   - followersContainer: The paragraph element displaying the number of followers.
 *   - followingContainer: The paragraph element displaying the number of followings.
 *   - avatar: The element for the user's avatar.
 */
export function getUserProfileElements() {
  const postsContainer = document.querySelector(".posts-container");
  const emailContainer = document.querySelector(".email-container p");
  const followersContainer = document.querySelector(".followers-container p");
  const followingContainer = document.querySelector(".following-container p");
  const avatar = document.getElementById("avatar");
  const bioContainer = document.getElementById("bio");

  return {
    postsContainer,
    emailContainer,
    followersContainer,
    followingContainer,
    avatar,
    bioContainer,
  };
}

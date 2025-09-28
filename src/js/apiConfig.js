/**
 * API base url
 */
export const API_BASE_URL = "https://v2.api.noroff.dev";

/**
 * Endpoints for authentication and social API calls.
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    CREATE_API_KEY: "/auth/create-api-key",
  },
  SOCIAL: {
    PROFILES: "/social/profiles",
    POSTS: "/social/posts",
    POSTS_FOLLOWING: "/social/posts/following",
  },
};

/**
 * Headers with access token, API key, and JSOn content type.
 * @param {string} accessToken - User access token.
 * @param {string} apiKey - API key.
 * @returns {object} Headers object.
 */
export const API_Headers_accesstoken_content_apikey = (
  accessToken,
  apiKey
) => ({
  Authorization: `Bearer ${accessToken}`,
  "Content-Type": "application/json",
  "X-Noroff-API-Key": apiKey,
});

/**
 * Headers with access token and API key.
 * @param {string} accessToken - User access token.
 * @param {string} apiKey - API key.
 * @returns {object} Headers object.
 */
export const API_Headers_accesstoken_apikey = (accessToken, apiKey) => ({
  Authorization: `Bearer ${accessToken}`,
  "X-Noroff-API-Key": apiKey,
});

/**
 *
 * @returns {object} Headers object.
 */
export const API_Headers_content = () => ({
  "Content-Type": "application/json",
});

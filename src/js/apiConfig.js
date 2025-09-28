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

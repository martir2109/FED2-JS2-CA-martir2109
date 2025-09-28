import {
  showError,
  clearError,
  Count,
  attachInputListeners,
  getAuthenticationCredentials,
} from "../utils.js";

import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_content_apikey,
} from "../apiConfig.js";

document.addEventListener("DOMContentLoaded", () => {
  new Count();
});

const createPostForm = document.getElementById("create-form");

createPostForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const { accessToken, apiKey } = getAuthenticationCredentials();

  if (!accessToken) {
    alert("You must be logged in to create a post.");
    window.location.href = "../../auth/login/index.html";
    return;
  }

  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const media = {
    url: document.getElementById("media").value,
    alt: document.getElementById("alt").value,
  };

  let hasError = false;

  if (!title.trim()) {
    showError("title", "Title cannot be empty.");
    hasError = true;
  } else {
    clearError("title");
  }

  if (!body.trim()) {
    showError("body", "Post caption cannot be empty.");
    hasError = true;
  } else {
    clearError("body");
  }

  if (!media.url.trim() || !media.url.trim().startsWith("http")) {
    showError(
      "media",
      "Please enter a valid image url that starts with http or https."
    );
    hasError = true;
  } else {
    clearError("media");
  }

  if (!media.alt.trim()) {
    showError("alt", "ALT text cannot be empty.");
    hasError = true;
  } else {
    clearError("alt");
  }

  if (hasError) return;

  const post = { title, media, body };

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}`,
      {
        method: "POST",
        headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
        body: JSON.stringify(post),
      }
    );
    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    alert("Post created!");
    createPostForm.reset();
    window.location.href = "/index.html";
  } catch (error) {
    const errorMessage = error.message || "An undexpected error occured.";
    alert("Something went wrong while creating the post: ", errorMessage);
  }
});

attachInputListeners(["#title", "#media", "#body", "#alt"]);

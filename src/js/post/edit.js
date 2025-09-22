import {
  showError,
  clearError,
  Count,
  API_BASE_URL,
  API_ENDPOINTS,
  attachInputListeners,
  API_Headers_accesstoken_apikey,
  API_Headers_accesstoken_content_apikey,
} from "../utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  new Count();

  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("id");

  if (!postId) {
    alert("No post ID provied.");
    window.location.href = "/index.html";
    return;
  }
  const accessToken = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userName");
  const apiKey = localStorage.getItem("apiKey");

  if (!accessToken || !userName) {
    alert("You must be logged in.");
    window.location.href = "../../auth/login/index.html";
    return;
  }

  const editForm = document.getElementById("edit-form");
  const deleteBtn = document.getElementById("delete-btn");

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}/${postId}`,
      {
        method: "GET",
        headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const post = data.data ?? data;

    document.getElementById("title").value = post.title;
    document.getElementById("body").value = post.body;
    document.getElementById("media").value = post.media?.url || "";
    document.getElementById("alt").value = post.media?.alt || "";
  } catch (error) {
    console.error("Error loading post:", error);
    alert("Failed to load the post for editing.");
  }

  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const updatePost = {
      title: document.getElementById("title").value,
      body: document.getElementById("body").value,
      media: {
        url: document.getElementById("media").value,
        alt: document.getElementById("alt").value,
      },
    };

    const title = updatePost.title;
    const body = updatePost.body;
    const media = updatePost.media;
    const alt = media.alt;

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

    if (!alt.trim()) {
      showError("alt", "ALT text cannot be empty.");
      hasError = true;
    } else {
      clearError("alt");
    }

    if (hasError) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}/${postId}`,
        {
          method: "PUT",
          headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
          body: JSON.stringify(updatePost),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        const errorMessage =
          data.errors?.[0]?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      alert("Post updated!");
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error updating post: ", error);
      alert("Failed to update the post");
    }
  });

  deleteBtn.addEventListener("click", async function () {
    const confirmed = confirm("Are you sure you want to delte the post?");

    if (!confirmed) {
      alert("Post not deleted!");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );
      if (!response.ok) {
        const data = await response.json();
        const errorMessage =
          data.errors?.[0]?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      document.getElementById("edit-form").reset();
      alert("Post deleted!");
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error deleting post: ", error);
      alert("Failed to delete the post.");
    }
  });
});

attachInputListeners(["#title", "#media", "#body", "#alt"]);

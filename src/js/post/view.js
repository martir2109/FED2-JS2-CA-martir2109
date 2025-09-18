import { API_BASE_URL, API_ENDPOINTS } from "../utils.js";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const postId = new URLSearchParams(window.location.search).get("id");
    if (!postId) {
      alert("No post ID found in the URL.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    const apiKey = localStorage.getItem("apiKey");
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const currentUserName =
      currentUser.name || currentUser.username || currentUser.email || "User";
    const editLink = document.getElementById("edit-link");

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}/${postId}?_author=true&_reactions=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    const post = await response.json();
    if (!response.ok) {
      const errorMessage =
        post.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const postData = post.data ?? post;

    const authorName =
      postData.author?.name || postData.author?.username || "Unknown Author";

    const usernameElement = document.querySelector(".username");
    usernameElement.innerHTML = `<a href="../../profile/view-profile/index.html?name=${authorName}">${authorName}</a>`;

    document.querySelector(".post-title").textContent =
      postData.title || "No Title";
    const postImage = document.querySelector(".post-image");
    postImage.src =
      postData.media?.url || "../../public/images/no image - default image.jpg";
    postImage.alt = postData.media?.alt || postData.title || "Post image";
    document.querySelector(".body").textContent = postData.body || "No content";

    const isAuthor =
      currentUserName?.toLowerCase() === postData.author?.name?.toLowerCase();

    if (isAuthor) {
      editLink.href = `../../post/edit/index.html?id=${postData.id}`;
      editLink.style.display = "block";
    } else {
      editLink.style.display = "none";
    }

    const postDate = new Date(postData.created);
    const postUpdate = new Date(postData.updated);
    const postUpdateContainer = document.querySelector(
      ".post-update-container"
    );
    postUpdateContainer.innerHTML = `
      <p class="post-update">Post Published: ${postDate.toLocaleDateString()}</p>
      <p class="post-update">Last updated: ${postUpdate.toLocaleDateString()}</p>
    `;
    const reactionContainer = document.querySelector(".reaction-container");
    const reactionCountElement = reactionContainer.querySelector("p");
    const reactionButton = reactionContainer.querySelector("i");

    const thumbsUpReaction = postData.reactions?.find(
      (reaction) => reaction.symbol === "👍"
    );
    let reactionCount = thumbsUpReaction?.count || 0;
    reactionCountElement.textContent = reactionCount;

    let userHasReacted = thumbsUpReaction?.reactors?.includes(currentUser.name);

    function updateReactionButton() {
      if (userHasReacted) {
        reactionButton.classList.remove("bi-hand-thumbs-up");
        reactionButton.classList.add("bi-hand-thumbs-up-fill");
        reactionButton.style.pointerEvents = "none";
        reactionButton.style.opacity = "0.7";
      } else {
        reactionButton.classList.remove("bi-hand-thumbs-up-fill");
        reactionButton.classList.add("bi-hand-thumbs-up");
        reactionButton.style.pointerEvents = "auto";
        reactionButton.style.opacity = "1";
      }
    }

    updateReactionButton();

    console.log(postData);
    reactionButton.addEventListener("click", async () => {
      if (userHasReacted) return;
      try {
        const reactResponse = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}/${postId}/react/👍`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );

        if (!reactResponse.ok) {
          const errorData = await reactResponse.json();
          throw new Error(errorData.errors?.[0]?.message || "Failed to react");
        }

        reactionCount += 1;
        reactionCountElement.textContent = reactionCount;

        reactionButton.classList.remove("bi-hand-thumbs-up");
        reactionButton.classList.add("bi-hand-thumbs-up-fill");
        reactionButton.style.pointerEvents = "none";
      } catch (error) {
        console.error("Error reacting to post:", error);
        alert("Failed to react. Please try again.");
      }
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    alert("Failed to load the post. Please try again later.");
  }
});

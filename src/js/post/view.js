import {
  showError,
  clearError,
  API_BASE_URL,
  API_ENDPOINTS,
  API_Headers_accesstoken_apikey,
  API_Headers_accesstoken_content_apikey,
  getAuthenticationCredentials,
} from "../utils.js";

const currentUser = JSON.parse(localStorage.getItem("user")) || {};
const currentUserName =
  currentUser.name || currentUser.username || currentUser.email || "User";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const postId = new URLSearchParams(window.location.search).get("id");
    if (!postId) {
      alert("No post ID found in the URL.");
      return;
    }

    const { accessToken, apiKey } = getAuthenticationCredentials();
    const editLink = document.getElementById("edit-link");

    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}/${postId}?_author=true&_reactions=true&_comments=true`,
      {
        headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
      }
    );

    const post = await response.json();

    if (!response.ok) {
      const errorMessage =
        post.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const postData = post.data ?? post;
    const commentsList = document.querySelector(".comments-list");
    commentsList.innerHTML = "";

    if (postData.comments && postData.comments.length > 0) {
      commentsList.innerHTML = postData.comments
        .map((comment) => {
          const isOwner = comment.owner === currentUserName;
          return `
            <li data-comment-id="${comment.id}">
              <div class="comment-main">
                <div class="comment-container">
                  <span>${comment.owner}: ${comment.body}</span>
                  <div class="comment-actions">
                    ${
                      isOwner
                        ? '<i class="bi bi-trash delete-btn" title="Delete"></i>'
                        : ""
                    }
                  </div>
                </div>
              </div>
            </li>
          `;
        })
        .join("");
    } else {
      commentsList.innerHTML = "<li>No comments yet.</li>";
    }

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const commentId = event.target.closest("li").dataset.commentId;
        deleteComment(postId, commentId);
      });
    });

    const chatButton = document.querySelector(".bi-chat");
    const commentFormContainer = document.querySelector(
      ".comment-create-container"
    );
    if (chatButton && commentFormContainer) {
      chatButton.addEventListener("click", () => {
        commentFormContainer.classList.toggle("active");
      });
    }

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

    reactionButton.addEventListener("click", async () => {
      if (userHasReacted) return;
      try {
        const reactResponse = await fetch(
          `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}/${postId}/react/👍`,
          {
            method: "PUT",
            headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
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

document.querySelectorAll(".comment-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const postId = new URLSearchParams(window.location.search).get("id");
    const commentText = event.target.querySelector("textarea").value.trim();
    const maxLength = 200;
    const { accessToken, apiKey } = getAuthenticationCredentials();

    clearError("comment");

    if (commentText.length > maxLength) {
      showError(
        "comment",
        `Comment cannot be longer than ${maxLength} characters.`
      );
      return;
    }

    if (!commentText) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}/${postId}/comment`,
        {
          method: "POST",
          headers: API_Headers_accesstoken_content_apikey(accessToken, apiKey),
          body: JSON.stringify({ body: commentText }),
        }
      );

      if (!response.ok) {
        const errorMessage =
          data.errors?.[0]?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      const newComment = await response.json();
      const commentData = newComment.data;

      const commentsList = document.querySelector(".comments-list");

      const newCommentElement = document.createElement("li");
      newCommentElement.dataset.commentId = commentData.id;

      const textSpan = document.createElement("span");
      textSpan.textContent = `${commentData.owner}: ${commentData.body}`;
      newCommentElement.appendChild(textSpan);

      if (commentData.owner === currentUserName) {
        const deleteBtn = document.createElement("i");
        deleteBtn.classList.add("bi", "bi-trash");

        deleteBtn.addEventListener("click", () => {
          deleteComment(postId, commentData.id);
        });

        newCommentElement.appendChild(deleteBtn);
      }

      commentsList.appendChild(newCommentElement);

      event.target.reset();
      window.location.reload();
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  });
});

async function deleteComment(postId, commentId) {
  const { accessToken, apiKey } = getAuthenticationCredentials();

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.SOCIAL.POSTS}/${postId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: API_Headers_accesstoken_apikey(accessToken, apiKey),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.message || "Failed to comment");
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
}

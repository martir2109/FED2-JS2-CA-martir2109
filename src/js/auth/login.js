import {
  showError,
  clearError,
  togglePassword,
  API_BASE_URL,
  API_ENDPOINTS,
} from "../utils.js";

export async function login({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data.errors?.[0]?.message || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    const token = data.accessToken || data.data?.accessToken;
    const user = data.data || data;

    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(user));
    const userName = user.name || user.username || user.email;
    localStorage.setItem("userName", userName);

    return { token, user, userName };
  } catch (error) {
    throw error;
  }
}

document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    let hasError = false;

    if (!email.trim()) {
      showError("email", "Email cannot be empty.");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      showError("email", "Invalid email format.");
      hasError = true;
    } else {
      clearError("email");
    }

    if (!password.trim()) {
      showError("password", "Password cannot be empty.");
      hasError = true;
    } else {
      clearError("password");
    }

    if (hasError) return;

    try {
      const { token, user, userName } = await login({ email, password });
      alert("Login successful!");

      const apiKeyResponse = await fetch(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.CREATE_API_KEY}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (apiKeyResponse.ok) {
        const apiKeyData = await apiKeyResponse.json();
        localStorage.setItem("apiKey", apiKeyData.data.key);
      } else {
        const errorData = await apiKeyResponse.json();
        console.error("Failed to create API key:", errorData);
      }

      setTimeout(() => {
        window.location.href = "/index.html";
      }, 1000);
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  });

const inputfield = document.querySelectorAll(".inputfield");

inputfield.forEach((input) => {
  input.addEventListener("focus", () => {
    clearError(input.id);
  });

  input.addEventListener("input", () => {
    if (input.value.trim()) {
      clearError(input.id);
    }
  });

  input.addEventListener("input", () => {
    const value = input.value;

    if (value.endsWith("@")) {
      input.value = `${value}stud.noroff.no`;
    }
  });
});

const passwordCheckbox = document.getElementById("show-password");
if (passwordCheckbox) {
  passwordCheckbox.addEventListener("change", togglePassword);
}

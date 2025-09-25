/**
 * Create the navbar HTML depending on login state.
 * Check if the user has an access token in localStorage.
 * @returns {string} The HTML string for navbar.
 */
function createNavbar() {
  const isLoggedIn = localStorage.getItem("accessToken") !== null;

  if (isLoggedIn) {
    // Navbar for logged-in users
    return `
        <nav class="topnav">
        <a href="/index.html">
          <div class="nav-logo">
            <img src="../../public/logo/Posty logo - dark backgroung.png" alt="Posty logo">
          </div>
          </a>
          
          <button class="icon" onclick="toggleMobileMenu()" aria-label="Open and close navigation menu">
            <div class="container">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
            </div>
          </button>
          
          <div class="nav-links">  
            <a href="/index.html"><i class="bi bi-house-door" title="Home"></i>
            <span class="nav-text">Home</span>
            </a>

            <a href="/search/index.html"><i class="bi bi-search" title="Search"></i>
            <span class="nav-text">Search</span>
            </a>
            <a href="../../profile/index.html"><i class="bi bi-person" title="Profile"></i>
            <span class="nav-text">Profile</span>
            </a>
            <a href="../../settings/index.html"><i class="bi bi-gear" title="Settings"></i>
            <span class="nav-text">Settings</span>
            </a>
            <a href="javascript:void(0);" onclick="logout()"><i class="bi bi-box-arrow-right" title="Log out"></i>
            <span class="nav-text">Log out</span>
            </a>
          </div>
        </nav>
      `;
  } else {
    // Navbar for logged-out users
    return `
        <nav class="topnav">
        <a href="/index.html">
          <div class="nav-logo">
            <img src="../../public/logo/Posty logo - dark backgroung.png" alt="Posty logo">
          </div>
          </a>
          
          <button class="icon" onclick="toggleMobileMenu()" aria-label="Open and close navigation menu">
            <div class="container">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
            </div>
          </button>
          
          <div class="nav-links">  
            <a href="/index.html"><i class="bi bi-house-door" title="Home"></i>
            <span class="nav-text">Home</span>
            </a>
            <a href="../../auth/login/index.html"><i class="bi bi-person" title="Profile"></i> 
            <span class="nav-text">Log in or Register</span>
            </a>
          </div>
        </nav>
      `;
  }
}

/**
 * Log out the current user by removing user credentials from localStorage.
 * Redirects to the home page after logout.
 */
function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("userName");
  window.location.href = "/index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("navbar-container");
  if (container) {
    container.innerHTML = createNavbar();
  }
});

/**
 * Toggle the mobile menu open/closed by switching CSS classes.
 */
function toggleMobileMenu() {
  const nav = document.querySelector(".topnav");
  const hamburger = document.querySelector(".container");

  nav.classList.toggle("responsive");
  hamburger.classList.toggle("change");
}

window.toggleMobileMenu = toggleMobileMenu;
window.logout = logout;

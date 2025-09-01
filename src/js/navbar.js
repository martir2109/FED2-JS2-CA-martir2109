function createNavbar() {
  const isLoggedIn = localStorage.getItem("accessToken") !== null;

  if (isLoggedIn) {
    // Navbar for logged-in users
    return `
        <nav class="topnav">
        <a href="/index.html">
          <div class="nav-logo">
            <img src="/public/logo/Posty logo - dark backgroung.png" alt="Posty logo">
          </div>
          </a>
          
          <a href="javascript:void(0);" class="icon" onclick="toggleMobileMenu()">
            <div class="container">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
            </div>
          </a>
          
          <div class="nav-links">  
            <a href="/index.html"><i class="bi bi-house-door" title="Home"></i>
            <span class="nav-text">Home</span>
            </a>
            <a href="/profile/index.html"><i class="bi bi-person" title="Profile"></i>
            <span class="nav-text">Profile</span>
            </a>
            <a href="/settings/index.html"><i class="bi bi-gear" title="Settings"></i>
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
            <img src="/public/logo/Posty logo - dark backgroung.png" alt="Posty logo">
          </div>
          </a>
          
          <a href="javascript:void(0);" class="icon" onclick="toggleMobileMenu()">
            <div class="container">
              <div class="bar1"></div>
              <div class="bar2"></div>
              <div class="bar3"></div>
            </div>
          </a>
          
          <div class="nav-links">  
            <a href="/index.html"><i class="bi bi-house-door" title="Home"></i>
            <span class="nav-text">Home</span>
            </a>
            <a href="/auth/login/index.html"><i class="bi bi-person" title="Profile"></i> 
            <span class="nav-text">Log in or Register</span>
            </a>
          </div>
        </nav>
      `;
  }
}

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

function toggleMobileMenu() {
  const nav = document.querySelector(".topnav");
  const hamburger = document.querySelector(".container");

  nav.classList.toggle("responsive");
  hamburger.classList.toggle("change");
}

window.toggleMobileMenu = toggleMobileMenu;
window.logout = logout;

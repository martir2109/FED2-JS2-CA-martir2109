function createFooter() {
  return `<footer class="main-footer">
      <div class="footer-container">
        <div class="footer-left-container">
          <h2>Site Links</h2>
          <div class="links-container">
            <a href="../../footer-links/about/index.html">
              <p>About</p>
            </a>
            <a href="../../footer-links/contact/index.htmø">
              <p>Contact/ Support</p>
            </a>
            <a href="../../footer-links/privacy-policy/index.html">
              <p>Privacy Policy</p>
            </a>
            <a href="../../footer-links/terms-of-service/index.html">
              <p>Terms of Service</p>
            </a>
            <a href="../../footer-links/faq/index.html">
              <p>Frequently Asked Questions</p>
            </a>
          </div>
        </div>
        <div class="footer-right-container">
          <h2>Contact</h2>
          <div class="links-container">
            <p>Email: posty@gmail.com</p>
            <p>phone: +47 12 34 56 78</p>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-logo-container">
          <img
            src="../../public/logo/Posty logo - light background.png"
            alt="Posty logo"
            class="footer-logo"
          />
        </div>

        <p>© 2025 Posty</p>
      </div>
    </footer>`;
}

function loadFooter() {
  let footerContainer = document.getElementById("footer-container");

  if (!footerContainer) {
    footerContainer = document.createElement("div");
    footerContainer.id = "footer-container";
    document.body.appendChild(footerContainer);
  }
  footerContainer.innerHTML = createFooter();
}

document.addEventListener("DOMContentLoaded", loadFooter);

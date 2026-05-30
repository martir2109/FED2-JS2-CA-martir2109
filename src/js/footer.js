/**
 * Create the footer HTML.
 * @returns {string} The HTML for footer.
 */
function createFooter() {
  return `<footer class="w-full min-h-[696px] bg-primary text-medium text-secondary overflow-hidden flex flex-col justify-center">
      <div class="w-full  min-h-[321px] flex flex-col sm:place-items-start items-center sm:flex-row justify-center gap-[15%] leading-[50px]">
        <div class="mt-[50px] w-70 bg-primary h-[350px]">
          <h2 class="font-bold">Site Links</h2>
          <div class="break-normal no-underline">
            <a href="../../footer-links/about/index.html">
              <p>About</p>
            </a>
            <a href="../../footer-links/contact/index.html">
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
        <div class="mt-[50px] w-70 sm:w-60 bg-primary sm:h-[350px]">
          <h2 class="font-bold">Contact</h2>
          <div class="break-normal no-underline">
            <p>Email: posty@gmail.com</p>
            <p>phone: +47 12 34 56 78</p>
          </div>
        </div>
      </div>

      <div class="w-full flex flex-col gap-[30px] justify-center items-center p-5">
        <div class="w-full flex justify-center mt-[200px]">
          <img
            src="../../public/logo/Posty logo - light background.png"
            alt="Posty logo"
            class="w-[157px] h-auto"
          />
        </div>

        <p class="text-1rem">© 2025 Posty</p>
      </div>
    </footer>`;
}

/**
 * Load the footer HTML into the existing #footer-container element on the page.
 */
function loadFooter() {
  const footerContainer = document.getElementById("footer-container");
  if (footerContainer) {
    footerContainer.innerHTML = createFooter();
  }
}

document.addEventListener("DOMContentLoaded", loadFooter);

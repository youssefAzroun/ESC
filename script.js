// mobile menu open / close
(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector(".primary-nav");

  // nothing to do if the button isn't on the page
  if (!navToggle || !primaryNav) {
    return;
  }

  function setNavOpen(isOpen) {
    primaryNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  }

  // hamburger click
  navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!isOpen);
  });

  // close after picking a link
  primaryNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setNavOpen(false);
    });
  });

  // close with Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
  });

  // if they resize back up to desktop, shut the menu
  window.addEventListener("resize", function () {
    if (window.matchMedia("(min-width: 769px)").matches) {
      setNavOpen(false);
    }
  });
})();

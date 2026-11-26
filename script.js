// mobile menu open / close
(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector(".primary-nav");
  const desktopQuery = window.matchMedia("(min-width: 769px)");

  // nothing to do if the button isn't on the page
  if (!navToggle || !primaryNav) {
    return;
  }

  function setNavOpen(isOpen) {
    primaryNav.classList.toggle("is-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", isOpen);
  }

  function isNavOpen() {
    return navToggle.getAttribute("aria-expanded") === "true";
  }

  // hamburger / X click
  navToggle.addEventListener("click", function () {
    setNavOpen(!isNavOpen());
  });

  // close after picking a link
  primaryNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setNavOpen(false);
    });
  });

  // close with Escape
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isNavOpen()) {
      setNavOpen(false);
      navToggle.focus();
    }
  });

  // if they resize back up to desktop, shut the menu
  desktopQuery.addEventListener("change", function (event) {
    if (event.matches) {
      setNavOpen(false);
    }
  });
})();

// Loading API from https://lernia-sjj-assignments.vercel.app/api/challenges
const API_URL = 'https://lernia-sjj-assignments.vercel.app/api/challenges';

async function loadChallenges() 
{
    const response = await fetch(API_URL);

    if (!response.ok) 
        {
        throw new Error(`Failed to load challenges: ${response.status} ${response.statusText}`);
        }

    const data = await response.json();

    if (!Array.isArray(data.challenges)) 
        {
        throw new Error('The API response does not contain a challenges array.');
        }

    for (const challenge of data.challenges) {
        console.log(challenge);
    }
}

loadChallenges().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

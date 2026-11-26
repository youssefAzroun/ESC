// all challenges page – list + filters

function displayChallenges(items) {
  const statusEl = document.getElementById("all-challenges-status");
  const listEl = document.getElementById("all-challenges-list");
  if (!statusEl || !listEl) return;

  listEl.innerHTML = "";

  if (!items || items.length === 0) {
    statusEl.textContent = "No matching challenges";
    statusEl.classList.add("status--empty");
    return;
  }

  statusEl.classList.remove("status--empty");
  statusEl.textContent = "";
  items.forEach(function (challenge, index) {
    const card = createChallengeCard(challenge);
    card.style.setProperty("--card-index", String(Math.min(index, 12)));
    card.addEventListener(
      "animationend",
      function () {
        card.classList.add("is-visible");
      },
      { once: true }
    );
    listEl.appendChild(card);
  });
}

function matchesSearch(challenge, query) {
  if (!query) return true;
  const title = (challenge.title || "").toLowerCase();
  const description = (challenge.description || "").toLowerCase();
  return title.includes(query) || description.includes(query);
}

function matchesType(challenge) {
  const onlineEl = document.getElementById("onlineFilter");
  const onSiteEl = document.getElementById("onSiteFilter");
  if (!onlineEl || !onSiteEl) return true;

  const online = onlineEl.checked;
  const onSite = onSiteEl.checked;

  return (
    (!online && !onSite) ||
    (online && challenge.type === "online") ||
    (onSite && challenge.type === "onsite")
  );
}

function matchesRatingFilter(challenge) {
  const rating = Number(challenge.rating) || 0;
  return rating >= minRating && rating <= maxRating;
}

// run type, rating, tags and search together
function applyAllFilters() {
  if (!Array.isArray(challenges)) return;

  const searchInput = document.getElementById("challenge-search");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

  const filtered = challenges.filter(function (challenge) {
    return (
      matchesType(challenge) &&
      matchesRatingFilter(challenge) &&
      matchesTags(challenge) &&
      matchesSearch(challenge, query)
    );
  });

  displayChallenges(filtered);
}

(async function () {
  const statusEl = document.getElementById("all-challenges-status");

  function showError(message) {
    statusEl.textContent = message;
    statusEl.classList.add("status--error");
  }

  try {
    const data = await getChallenges();
    const list = Array.isArray(data.challenges) ? data.challenges : null;

    if (!list) {
      showError("Could not load challenges: unexpected API response.");
      return;
    }

    // keep the global list in sync for the rating/type filters
    challenges = list;

    if (challenges.length === 0) {
      statusEl.textContent = "No challenges found.";
      return;
    }

    const searchInput = document.getElementById("challenge-search");
    if (searchInput) {
      searchInput.addEventListener("input", applyAllFilters);
    }

    // tag buttons also trigger the full filter
    buildTagFilter(challenges, document.getElementById("filter-tags"), applyAllFilters);

    applyAllFilters();
  } catch (error) {
    console.error(error);
    showError("Failed to load challenges. Please try again later.");
  }
})();


// open / close the filter panel
const filterButton = document.querySelector(".filter-button");
const filterContainer = document.querySelector(".filter-container");
const filterCloseButton = document.querySelector(".filter-close-button");

function openFilters() {
  filterContainer.hidden = false;
  filterContainer.setAttribute("aria-hidden", "false");
  // wait one frame so the open animation actually plays
  requestAnimationFrame(function () {
    filterContainer.classList.add("is-open");
    filterButton.classList.add("is-hidden");
    filterButton.setAttribute("aria-expanded", "true");
  });
}

function closeFilters() {
  filterContainer.classList.remove("is-open");
  filterButton.classList.remove("is-hidden");
  filterButton.setAttribute("aria-expanded", "false");
  filterContainer.setAttribute("aria-hidden", "true");

  window.setTimeout(function () {
    if (!filterContainer.classList.contains("is-open")) {
      filterContainer.hidden = true;
    }
  }, 400);
}

if (filterButton && filterContainer && filterCloseButton) {
  filterButton.addEventListener("click", openFilters);
  filterCloseButton.addEventListener("click", closeFilters);
}

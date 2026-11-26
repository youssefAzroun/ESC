// 1.5: Show all challenges from the API on this page

(async function () {
  const statusEl = document.getElementById("all-challenges-status");
  const listEl = document.getElementById("all-challenges-list");

  function showError(message) {
    statusEl.textContent = message;
    statusEl.classList.add("status--error");
  }

  // Stars only for this page list
  function createStars(rating) {
    const stars = document.createElement("span");
    stars.className = "stars";
    const value = Number(rating) || 0;
    const filled = Math.floor(value);
    const hasHalf = value - filled >= 0.5;
    stars.setAttribute("aria-label", `${value} out of 5 stars`);

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.setAttribute("aria-hidden", "true");
      star.textContent = "★";
      if (i <= filled) {
        star.classList.add("star-filled");
      } else if (i === filled + 1 && hasHalf) {
        star.classList.add("star-half");
      }
      stars.appendChild(star);
    }

    return stars;
  }

  function createChallengeItem(challenge) {
    const li = document.createElement("li");
    li.className = "all-challenge-item";

    if (challenge.image) {
      const image = document.createElement("img");
      image.className = "all-challenge-image";
      image.src = challenge.image;
      image.alt = "";
      li.appendChild(image);
    }

    const body = document.createElement("div");
    body.className = "all-challenge-body";

    const title = document.createElement("h2");
    title.textContent = challenge.title || "Untitled challenge";

    const meta = document.createElement("div");
    meta.className = "all-challenge-meta";
    meta.appendChild(createStars(challenge.rating));

    const participants = document.createElement("span");
    participants.className = "participants";
    const type = challenge.type || "unknown";
    const min = challenge.minParticipants ?? "?";
    const max = challenge.maxParticipants ?? "?";
    participants.textContent = `${type} · ${min}–${max} participants`;
    meta.appendChild(participants);

    const description = document.createElement("p");
    description.textContent = challenge.description || "";

    const bookLink = document.createElement("a");
    bookLink.className = "btn btn-primary btn-small";
    bookLink.href = "#contact";
    bookLink.textContent = "Book this room";

    body.append(title, meta, description, bookLink);
    li.appendChild(body);
    return li;
  }

  try {
    const data = await getChallenges();
    const challenges = Array.isArray(data.challenges) ? data.challenges : null;

    if (!challenges) {
      showError("Could not load challenges: unexpected API response.");
      return;
    }

    if (challenges.length === 0) {
      statusEl.textContent = "No challenges found.";
      return;
    }

    const searchInput = document.getElementById("challenge-search");

    function renderChallenges(items) {
      listEl.innerHTML = "";

      if (items.length === 0) {
        statusEl.textContent = "No matching challenges";
        return;
      }

    statusEl.textContent = `${items.length} challenges`;
    items.forEach(function (challenge) {
      listEl.appendChild(createChallengeItem(challenge));
    });
  }

  renderChallenges(challenges);
 
  if (searchInput) {
    searchInput.addEventListener("input", function (event) {
      const query = event.target.value.trim().toLowerCase();
      const filtered = challenges.filter(function (challenge) {
        return (
          challenge.title.toLowerCase().includes(query) ||
          challenge.description.toLowerCase().includes(query)
        );
      });
      renderChallenges(filtered);
    });
  }

  // 2.3: tag buttons, shows the challenges that have all active tags
  // (2.5 combines this with the search)
  buildTagFilter(challenges, document.getElementById("filter-tags"), function () {
    renderChallenges(challenges.filter(matchesTags));
  });
  } catch (error) {
    console.error(error);
    showError("Failed to load challenges. Please try again later.");
  }
})();


// 2.1 Adding a filter button and a filter container to the all-challenges.html file. The filter button will be used to toggle the visibility of the filter container.
const filterButton = document.querySelector(".filter-button");
const filterContainer = document.querySelector(".filter-container");
const filterCloseButton = document.querySelector(".filter-close-button");

filterButton.addEventListener("click", function () {
  filterContainer.hidden = false;
  filterButton.hidden = true;
  filterButton.setAttribute("aria-expanded", "true");
});

filterCloseButton.addEventListener("click", function () {
  filterContainer.hidden = true;
  filterButton.hidden = false;
  filterButton.setAttribute("aria-expanded", "false");
});
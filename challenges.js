
let challenges = [];
let minRating = 0;
let maxRating = 5;

async function getChallenges() {
  try {
    const response = await fetch('https://lernia-sjj-assignments.vercel.app/api/challenges');
    if (!response.ok) {
        throw new Error('Failed to fetch challenges');
    }
      return await response.json();
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
}   



function createRatingWidget(elementId, callback) {
    const container = document.getElementById(elementId);
    if (!container) return;

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("img");

        star.src = "assets/empty-star.svg";
        star.alt = `${i} stars`;
        star.style.cursor = "pointer";

        star.addEventListener("click", () => {
            callback(i);
            updateStars(container, i);
        });

        container.appendChild(star);
    }
}


function updateStars(container, rating) {
    const stars = container.querySelectorAll("img");

    stars.forEach((star, index) => {
        if (index < rating) {
            star.src = "assets/fullstar.svg";
        } else {
            star.src = "assets/empty-star.svg";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const minEl = document.getElementById("minRating");
    const maxEl = document.getElementById("maxRating");
    const onlineEl = document.getElementById("onlineFilter");
    const onSiteEl = document.getElementById("onSiteFilter");

    // these elements are only on the all challenges page
    if (!minEl || !maxEl || !onlineEl || !onSiteEl) {
        return;
    }

    createRatingWidget("minRating", (rating) => {
        minRating = rating;
        filterChallenges();
    });

    createRatingWidget("maxRating", (rating) => {
        maxRating = rating;
        filterChallenges();
    });

    // default max is 5 so fill those stars
    updateStars(maxEl, maxRating);

    onlineEl.addEventListener("change", filterChallenges);
    onSiteEl.addEventListener("change", filterChallenges);
});



function filterChallenges() {
    // if the combined filter exists, use that instead
    if (typeof applyAllFilters === "function") {
        applyAllFilters();
        return;
    }

    const onlineEl = document.getElementById("onlineFilter");
    const onSiteEl = document.getElementById("onSiteFilter");
    if (!onlineEl || !onSiteEl || !Array.isArray(challenges)) {
        return;
    }

    const online = onlineEl.checked;
    const onSite = onSiteEl.checked;

    const filteredChallenges = challenges.filter(challenge => {
        const matchesType =
        (!online && !onSite) ||
        (online && challenge.type === "online") ||
        (onSite && challenge.type === "onsite");

        const matchesRating =
        challenge.rating >= minRating &&
        challenge.rating <= maxRating;

        return matchesType && matchesRating;
    });

    if (typeof displayChallenges === "function") {
        displayChallenges(filteredChallenges);
    }
}

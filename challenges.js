
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

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement("img");

        star.src = "assets/star-empty.svg";
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
            star.src = "assets/star-filled.svg";
        } else {
            star.src = "assets/star-empty.svg";
        }
    });
}

document.addEventListener("DOMContentLoaded", async () => {

   
    createRatingWidget("minRating", (rating) => {
        minRating = rating;
        filterChallenges();
    });

  
    createRatingWidget("maxRating", (rating) => {
        maxRating = rating;
        filterChallenges();
    });

   
    document.getElementById("onlineFilter")
        .addEventListener("change", filterChallenges);

    document.getElementById("onSiteFilter")
        .addEventListener("change", filterChallenges);

 
    try {
        challenges = await getChallenges();
    } catch (error) {
        console.error(error);
    }
});



function filterChallenges() {
    const online = document.getElementById("onlineFilter").checked;
    const onSite = document.getElementById("onSiteFilter").checked;

    const filteredChallenges = challenges.filter(challenge => {
        const matchesType =
        (!online && !onSite) ||
        (online && challenge.type === "online") ||
        (onSite && challenge.type === "on-site");

        const matchesRating =
        challenge.rating >= minRating &&
        challenge.rating <= maxRating;

        return matchesType && matchesRating;
    });

    displayChallenges(filteredChallenges);
}

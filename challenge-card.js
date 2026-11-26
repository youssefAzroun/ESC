// challenge card used on home + all challenges

const laptopIcon =
  '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 5h16v10H4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 19h20" stroke="currentColor" stroke-width="2"/></svg>';
const houseIcon =
  '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" fill="currentColor"/></svg>';

// rating stars (supports half values like 3.5)
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

function createChallengeCard(challenge) {
  const card = document.createElement("li");
  card.className = "challenge-card";
  card.dataset.challengeId = challenge.id;
  card.dataset.minParticipants = challenge.minParticipants;
  card.dataset.maxParticipants = challenge.maxParticipants;
  card.dataset.challengeType = challenge.type;

  // image on top, stars sit on the bottom left of it
  const media = document.createElement("div");
  media.className = "challenge-media-wrap";

  const image = document.createElement("img");
  image.className = "challenge-media";
  image.src = challenge.image;
  image.alt = "";
  image.loading = "lazy";

  const icon = document.createElement("span");
  icon.className = "challenge-type-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = challenge.type === "online" ? laptopIcon : houseIcon;

  media.append(image, icon, createStars(challenge.rating));

  const body = document.createElement("div");
  body.className = "challenge-body";

  const title = document.createElement("h3");
  title.textContent = challenge.title;

  const participants = document.createElement("p");
  participants.className = "participants";
  const min = challenge.minParticipants;
  const max = challenge.maxParticipants;
  const countLabel =
    min === max ? `${min} participants` : `${min}–${max} participants`;
  participants.textContent =
    challenge.type === "online"
      ? `${countLabel} (networked)`
      : countLabel;

  const description = document.createElement("p");
  description.className = "challenge-description";
  description.textContent = challenge.description;

  const bookButton = document.createElement("a");
  bookButton.className = "btn btn-primary btn-small";
  bookButton.href = "#";
  if (challenge.type === "online") {
    bookButton.textContent = "Take challenge online";
  } else {
    bookButton.textContent = "Book this room";
  }

  body.append(title, participants, description, bookButton);
  card.append(media, body);
  return card;
}

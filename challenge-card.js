// 1.3: Reusable ChallengeCard component (start page + all challenges page)

const laptopIcon =
  '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 5h16v10H4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M2 19h20" stroke="currentColor" stroke-width="2"/></svg>';
const houseIcon =
  '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M3 11 12 3l9 8v10h-6v-6H9v6H3z" fill="currentColor"/></svg>';

// 5 stars, half star for ratings like 3.5
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

  const image = document.createElement("img");
  image.className = "challenge-media";
  image.src = challenge.image;
  image.alt = "";
  image.loading = "lazy";

  // laptop = online, house = on-site
  const icon = document.createElement("span");
  icon.className = "challenge-type-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.innerHTML = challenge.type === "online" ? laptopIcon : houseIcon;

  const body = document.createElement("div");
  body.className = "challenge-body";

  const title = document.createElement("h3");
  const type = challenge.type === "onsite" ? "on-site" : challenge.type;
  title.textContent = `${challenge.title} (${type})`;

  const meta = document.createElement("div");
  meta.className = "challenge-meta";
  const participants = document.createElement("span");
  participants.className = "participants";
  participants.textContent = `${challenge.minParticipants}–${challenge.maxParticipants} participants`;
  meta.append(createStars(challenge.rating), participants);

  const description = document.createElement("p");
  description.textContent = challenge.description;

  const bookButton = document.createElement("a");
  bookButton.className = "btn btn-primary btn-small";
  bookButton.href = "#contact";
  bookButton.textContent = "Book this room";

  body.append(title, meta, description, bookButton);
  card.append(image, icon, body);
  return card;
}

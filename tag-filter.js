// 2.3: Tag filter, a challenge has to match all active tags

const activeTags = new Set();

// all unique labels from the API data, A-Z
function getUniqueTags(challenges) {
  const tags = new Set();
  challenges.forEach(function (challenge) {
    (challenge.labels || []).forEach(function (label) {
      tags.add(label);
    });
  });
  return Array.from(tags).sort();
}

// one button per tag, click to turn on / off
function buildTagFilter(challenges, container, onChange) {
  container.replaceChildren();
  activeTags.clear();

  getUniqueTags(challenges).forEach(function (tag) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tag";
    button.textContent = tag;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", function () {
      if (activeTags.has(tag)) {
        activeTags.delete(tag);
      } else {
        activeTags.add(tag);
      }
      button.setAttribute("aria-pressed", String(activeTags.has(tag)));
      onChange();
    });

    container.appendChild(button);
  });
}

function matchesTags(challenge) {
  const labels = challenge.labels || [];
  for (const tag of activeTags) {
    if (!labels.includes(tag)) {
      return false;
    }
  }
  return true;
}

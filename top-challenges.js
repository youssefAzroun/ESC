// top 3 cards by rating on start page //

(async function () {
    const gridEl = document.querySelector(".challenge-grid");
    if (!gridEl) return;

    
    try {
        const data = await getChallenges();
        const list = Array.isArray(data.challenges) ? data.challenges : [];
        const topThree = [...list]
        .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0))
        .slice(0,3);

        if (topThree.length === 0) return;

        gridEl.innerHTML ="";
        topThree.forEach(function (challenge) {
            gridEl.appendChild(createChallengeCard(challenge));
        });
    } catch (error) {
        console.error("Failed to load top three challenges", error);
    }
})();
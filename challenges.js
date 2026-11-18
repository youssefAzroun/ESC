
async function getChallenges() {
  try {
    const response = await fetch('https://lernia-sjj-assignments.vercel.app/api/challenges');
    if (!response.ok) {
        throw new Error('Failed to fetch challenges');
    }
    const challenges = await response.json();
    return challenges;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
}   

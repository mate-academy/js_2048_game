/* eslint-disable no-console */
let score = 0;

export function getScore() {
  return score;
}

export function setScore(newScore) {
  if (newScore !== score) {
    const addedScore = newScore - score;

    score = newScore;
    updateScoreDisplay(addedScore);
  }
}

export function addScore(mergedValue) {
  const currentScore = getScore();

  console.log(`Adding ${mergedValue} to ${currentScore}`);

  setScore(currentScore + mergedValue);
  animateScoreChange();
}

export function resetScore() {
  score = 0;
}

export function updateScoreDisplay(addedScore = 0) {
  const scoreElement = document.querySelector('.game-score');
  const addedScoreElement = document.querySelector('.game-score--added');

  scoreElement.textContent = score;

  if (addedScore > 0) {
    console.log(`Updating display with added score: +${addedScore}`);

    addedScoreElement.textContent = `+${addedScore}`;
    addedScoreElement.style.opacity = '1';

    setTimeout(() => {
      addedScoreElement.style.opacity = '0';
    }, 500);
  }
}

function animateScoreChange() {
  const scoreElement = document.querySelector('.game-score');

  scoreElement.style.transform = 'translateY(-5px)';

  setTimeout(() => {
    scoreElement.style.transform = '';
  }, 300);
}

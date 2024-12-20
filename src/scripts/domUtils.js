const Game = require('../modules/Game.class.js');

const CELL_CLASS = 'field-cell';
const HIDDEN_CLASS = 'hidden';
const GRID_SIZE = 4;

function updateScore(game, gameScore, gameBest) {
  const currentScore = game.getScore();
  const pageScore = Number(gameScore.textContent);
  const pageBest = Number(gameBest.textContent);

  gameScore.textContent = currentScore;

  if (currentScore > pageScore) {
    const difference = currentScore - pageScore;

    gameScore.style.setProperty('--score-diffeerence', `"+${difference}"`);
    gameScore.classList.remove('game-score--animate');
    void gameScore.offsetWidth;
    gameScore.classList.add('game-score--animate');
  }

  if (currentScore > pageBest) {
    gameBest.textContent = currentScore;
    localStorage.setItem('best', currentScore);
  }
}

function updateStatus(game, messages) {
  const [messageLose, messageWin, messageStart] = messages;
  const gameStatus = game.getStatus();

  Array.from(messages).forEach((message) => {
    message.classList.add(HIDDEN_CLASS);
  });

  switch (gameStatus) {
    case Game.Statuses.IDLE:
      messageStart.classList.remove(HIDDEN_CLASS);
      break;
    case Game.Statuses.WIN:
      messageWin.classList.remove(HIDDEN_CLASS);
      break;
    case Game.Statuses.LOSE:
      messageLose.classList.remove(HIDDEN_CLASS);
      break;
    default:
      break;
  }
}

function updateCells(game, fieldRows) {
  const state = game.getState();

  Array.from(fieldRows).forEach((row, rowIndex) => {
    for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
      const currentNumber = +state[rowIndex][colIndex];
      const currentElement = row.children[colIndex];

      currentElement.textContent = currentNumber || '';
      currentElement.classList = '';
      currentElement.classList.add(CELL_CLASS);

      if (currentNumber) {
        currentElement.classList.add(`${CELL_CLASS}--${currentNumber}`);
      }
    }
  });
}

module.exports = {
  updateCells,
  updateScore,
  updateStatus,
};

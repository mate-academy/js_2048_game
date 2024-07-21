import Game from '../modules/Game.class';

const game = new Game();

const startButton = document.querySelector('.start');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const updateUI = () => {
  const grid = game.getGrid();

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const cell = gameField.rows[row].cells[col];
      const value = grid[row][col];

      cell.textContent = value || '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
  gameScore.textContent = game.getScore();
};

const checkGameState = () => {
  if (game.hasWon()) {
    messageWin.classList.remove('hidden');

    return true;
  }

  if (game.isGameOver()) {
    messageLose.classList.remove('hidden');

    return true;
  }

  return false;
};

startButton.addEventListener('click', () => {
  game.reset();
  updateUI();
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (key === 'ArrowUp') {
    game.move('up');
  } else if (key === 'ArrowDown') {
    game.move('down');
  } else if (key === 'ArrowLeft') {
    game.move('left');
  } else if (key === 'ArrowRight') {
    game.move('right');
  }

  updateUI();
  checkGameState();
});

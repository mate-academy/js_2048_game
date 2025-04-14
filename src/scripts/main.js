const Game = require('../modules/Game.class');
const game = new Game();

const {
  startButton,
  gameScore,
  gameBoardRows,
  messageLose,
  messageWin,
  messageStart,
} = {
  startButton: document.querySelector('.start'),
  gameScore: document.querySelector('.game-score'),
  gameBoardRows: document.querySelectorAll('tr'),
  messageLose: document.querySelector('.message-lose'),
  messageWin: document.querySelector('.message-win'),
  messageStart: document.querySelector('.message-start'),
};

const updateGameFields = () => {
  const state = game.getState();

  gameBoardRows.forEach((row, rowIndex) => {
    for (const cell of row.cells) {
      cell.textContent = '';
      cell.className = 'field-cell';

      const cellIndex = cell.cellIndex;
      const cellValue = state[rowIndex][cellIndex];

      if (cellValue !== 0) {
        cell.textContent = cellValue;
        cell.classList.add(`${cell.className}--${cellValue}`);
      }
    }
  });
};

const updateMessage = () => {
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === 'idle') {
    messageStart.classList.remove('hidden');
  }
};

const updateScore = () => {
  gameScore.textContent = game.getScore();
};

const startGame = () => {
  if (startButton.textContent === 'Start') {
    game.start();
  }

  if (startButton.textContent === 'Restart') {
    game.restart();

    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    updateScore();
  }

  updateGameFields();
  updateMessage();

  isFirstMove = true;
};

let isFirstMove = true;

const handleArrowDown = (e) => {
  if (game.getStatus() === 'idle') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  if (isFirstMove) {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    isFirstMove = false;
  }

  updateMessage();
  updateGameFields();
  updateScore();
};

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleArrowDown);

const Game = require('../modules/Game.class.js');

const game = new Game();

const startButton = document.querySelector('.button');
const scoreDisplay = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

function numBoard(currentGame) {
  const state = currentGame.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';
    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateScoreAndMessage() {
  scoreDisplay.textContent = game.getScore();

  const gamestatus = game.getStatus();

  winMessage?.classList.toggle('hidden', gamestatus !== 'win');
  loseMessage?.classList.toggle('hidden', gamestatus !== 'lose');
  startMessage?.classList.add('hidden');
}

function clearBoard() {
  cells.forEach((cell) => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    // Start the game
    game.start();
    numBoard(game);
    updateScoreAndMessage();

    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else {
    // Restart the game
    game.restart();
    clearBoard(); // Очистить поле
    scoreDisplay.textContent = '0'; // Сбросить очки

    startMessage?.classList.remove('hidden'); // Показать стартовое сообщение
    winMessage?.classList.add('hidden');
    loseMessage?.classList.add('hidden');

    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
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

  numBoard(game);
  updateScoreAndMessage();
});

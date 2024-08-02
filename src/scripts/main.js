'use strict';

// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');

const game = new Game([
  [0, 16, 0, 8],
  [8, 0, 16, 0],
  [0, 8, 0, 32],
  [32, 0, 8, 0],
]);

const button = document.querySelector('button');
const messages = document.querySelectorAll('.message');
const startMessage = document.querySelector('.message-start');

button.addEventListener('click', () => {
  const isStartButton = button.classList.contains('start');

  button.textContent = isStartButton ? 'Restart' : 'Start';

  if (isStartButton) {
    game.start();
    button.classList.replace('start', 'restart');
  } else {
    game.restart();
    handleScoreChange(0);
    button.classList.replace('restart', 'start');

    messages.forEach((message) => {
      if (!message.classList.contains('hiiden')) {
        message.classList.add('hidden');
      }
    });
  }

  startMessage.classList.toggle('hidden');
});

function setupInput() {
  document.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case 'ArrowLeft':
      await game.moveLeft();
      break;
    case 'ArrowRight':
      await game.moveRight();
      break;
    case 'ArrowUp':
      await game.moveUp();
      break;
    case 'ArrowDown':
      await game.moveDown();
      break;
    default:
      setupInput();

      return;
  }

  game.cellState.flat().forEach((cell) => {
    cell.mergeTiles();
  });

  handleStatusChange(game.getStatus());
  handleScoreChange(game.getScore());

  if (!game.isWinner() || !game.noMovesPossible()) {
    setupInput();
  }
}

setupInput();

function handleStatusChange(gameStatus) {
  messages.forEach((message) => {
    if (message.classList.contains(`message-${gameStatus}`)) {
      message.classList.remove('hidden');
    }
  });
}

function handleScoreChange(currentScore) {
  const gameScore = document.querySelector('.game-score');

  gameScore.textContent = currentScore;
}

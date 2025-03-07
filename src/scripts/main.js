import Game from '../modules/Game.class.js';

// const game = new Game();

const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

/*
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 1024, 1024],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const game = new Game([
  [2, 0, 0, 0],
  [0, 4, 0, 0],
  [0, 0, 8, 0],
  [0, 0, 0, 16],
]);
*/

function renderGame(gameState) {
  const cells = document.querySelectorAll('.field-cell');
  const scoreElement = document.querySelector('.game-score');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = gameState[row][col];

    cell.textContent = value !== 0 ? value : '';
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.score;
}

function updateMessage() {
  switch (game.status) {
    case 'idle':
      document.querySelector('.message-start').classList.remove('hidden');
      document.querySelector('.message-win').classList.add('hidden');
      document.querySelector('.message-lose').classList.add('hidden');
      break;
    case 'playing':
      document.querySelector('.message-start').classList.add('hidden');
      break;
    case 'win':
      document.querySelector('.message-win').classList.remove('hidden');
      break;
    case 'lose':
      document.querySelector('.message-lose').classList.remove('hidden');
      break;
    default:
      break;
  }

  updateButton();
}

function updateButton() {
  const button = document.querySelector('.button');

  if (game.status === 'idle') {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
}

document.querySelector('.start').addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  renderGame(game.getState());
  updateMessage();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'playing') {
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
      default:
        return;
    }

    renderGame(game.getState());
    updateMessage();
  }
});

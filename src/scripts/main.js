'use strict';

import Game from '../modules/Game.class.js';
import updateBoard from '../modules/UpdateBoard.js';

const game = new Game();

const startButton = document.querySelector('.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const messageStart = document.querySelector('.message-start');

startButton.addEventListener('click', (e) => {
  if (e) {
    startButton.classList.add('restart');
    startButton.innerHTML = 'Ress';
    game.restart();
    updateBoard(game);
  }
});

function updateMaxTileDisplay() {
  const maxTile = game.getMaxTile();

  document.querySelector('.game-score').innerText = `${maxTile}`;
}

function startGame() {
  game.start();
  updateBoard(game);
}

startButton.addEventListener('click', () => {
  startGame();
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
});

document.addEventListener('keydown', (events) => {
  const boardBeforeMove = game.board.map((row) => [...row]);

  if (game.getStatus() === 'playing') {
    switch (events.key) {
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
  }

  let hasChanged = false;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.board[i][j] !== boardBeforeMove[i][j]) {
        hasChanged = true;
        break;
      }
    }

    if (hasChanged) {
      break;
    }
  }

  // Якщо дошка змінилася, додаємо нову плитку
  if (hasChanged) {
    game.getWin();
    updateBoard(game);
    // game.addRandomTile();
    updateMaxTileDisplay();
    // eslint-disable-next-line no-console
    console.log(game.board);
    // eslint-disable-next-line no-console
    console.log(game.getStatus());
  }
});

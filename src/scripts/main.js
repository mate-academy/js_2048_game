'use strict';

import Game from '../modules/Game.class.js';
import updateBoard from '../modules/UpdateBoard.js';

const game = new Game();

const startButton = document.querySelector('.start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const gameField = document.querySelector('.game-field');

function updateMaxTileDisplay() {
  const maxTile = game.getMaxTile();

  document.querySelector('.game-score').innerText = `${maxTile}`;
}

function startGame() {
  game.start();
  updateBoard(game);
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    startButton.classList.remove('restart');
    startButton.innerHTML = 'Start';
    game.restart();
    hiden();
    updateBoard(game);
  } else {
    startButton.classList.add('restart');
    startButton.innerHTML = 'Reset';
    startGame();
    updateBoard(game);
  }

  if (game.getStatus() === 'playing') {
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    messageStart.classList.remove('hidden');
  }
});

const hiden = () => {
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
};

document.addEventListener('keyup', (events) => {
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

  // eslint-disable-next-line no-console
  console.log(`Has ${hasChanged}`);

  if (hasChanged) {
    game.getWin();
    game.addRandomTile();
    updateMaxTileDisplay();
    updateBoard(game);

    // eslint-disable-next-line no-console
    console.log(game.board);
    // eslint-disable-next-line no-console
    console.log(game.getStatus());
  }
});

let startX = 0;
let startY = 0;

gameField.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];

  startX = touch.pageX;
  startY = touch.pageY;
});

gameField.addEventListener('touchend', (e) => {
  if (game.getStatus() === 'playing') {
    const touch = e.changedTouches[0];
    const endX = touch.pageX;
    const endY = touch.pageY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        game.moveRight();
      } else {
        game.moveLeft();
      }
    } else {
      if (deltaY > 0) {
        game.moveDown();
      } else {
        game.moveUp();
      }
    }

    updateBoard(game);
    game.addRandomTile();
  }
});

'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startButton = document.querySelector('.start');
const rows = document.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    game.restart();
    updateBoard();
    score.textContent = 0;
  } else {
    startMessage.classList.add('hidden');
    game.start();
    updateBoard();
  }
});

document.addEventListener('keydown', handleMove);

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (ev) => {
  touchStartX = ev.touches[0].clientX;
  touchStartY = ev.touches[0].clientY;
});

document.addEventListener('touchend', (ev) => {
  touchEndX = ev.changedTouches[0].clientX;
  touchEndY = ev.changedTouches[0].clientY;
  handleSwipe();
});

function handleSwipe() {
  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 50) {
      handleMove({ key: 'ArrowRight' });
    } else if (diffX < -50) {
      handleMove({ key: 'ArrowLeft' });
    }
  } else {
    if (diffY > 50) {
      handleMove({ key: 'ArrowDown' });
    } else if (diffY < -50) {
      handleMove({ key: 'ArrowUp' });
    }
  }
}

function handleMove(ev) {
  if (game.status === 'lose') {
    return;
  }

  if (startMessage.classList.contains('hidden')) {
    startButton.setAttribute('class', 'button restart');

    switch (ev.key) {
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

    score.textContent = game.score;
    game.checkWin();

    if (game.status === 'win') {
      winMessage.classList.remove('hidden');
    } else if (game.status === 'lose') {
      loseMessage.classList.remove('hidden');
    }

    updateBoard();
  }
}

function updateBoard() {
  const currentState = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (currentState[row][col]) {
        rows[row].children[col].textContent = currentState[row][col];

        rows[row].children[col].setAttribute(
          'class',
          `field-cell field-cell--${currentState[row][col]}`,
        );
      } else {
        rows[row].children[col].textContent = '';

        rows[row].children[col].setAttribute(
          'class',
          'field-cell field-cell--empty',
        );
      }
    }
  }
}

'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const field = document.querySelector('.game-field');

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

startButton.addEventListener('click', () => {
  const isStarting = startButton.classList.contains('start');

  game[isStarting ? 'start' : 'restart']();

  startButton.classList.toggle('start');
  startButton.classList.toggle('restart');
  startButton.textContent = isStarting ? 'Restart' : 'Start';

  hideMessages();
  updateGameState();
});

document.addEventListener('keydown', (e) => {
  const moves = {
    ArrowRight: 'moveRight',
    ArrowLeft: 'moveLeft',
    ArrowUp: 'moveUp',
    ArrowDown: 'moveDown',
  };

  if (moves[e.key]) {
    game[moves[e.key]]();
    updateGameState();
  }
});

function updateGameState() {
  updateField();
  updateScore();
  checkGameStatus();
}

function updateScore() {
  score.textContent = game.getScore();
}

function checkGameStatus() {
  hideMessages();

  const gameStatus = game.getStatus();

  if (gameStatus === Game.STATUS.win) {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === Game.STATUS.lose) {
    loseMessage.classList.remove('hidden');
  }
}

function hideMessages() {
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
}

function updateField() {
  field.innerHTML = '';

  game.getState().forEach((row) => {
    const tr = document.createElement('tr');

    row.forEach((value) => {
      const td = document.createElement('td');

      td.textContent = value !== 0 ? value : '';
      td.className = `field-cell${value ? ` field-cell--${value}` : ''}`;
      tr.appendChild(td);
    });
    field.appendChild(tr);
  });
}

// for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  // Визначаємо напрямок свайпу
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Горизонтальний свайп
    if (diffX > 0) {
      game.moveRight();
    } else {
      game.moveLeft();
    }
  } else {
    // Вертикальний свайп
    if (diffY > 0) {
      game.moveDown();
    } else {
      game.moveUp();
    }
  }

  updateGameState();
});

// Initial setup
updateGameState();

'use strict';

const Game = require('../modules/Game.class');
const field = document.querySelector('.game-field');
const startBtn = document.querySelector('.start');
const messages = document.querySelectorAll('.message');
const scoreDisplay = document.querySelector('.game-score');

const STATUS_CLASSES = {
  start: 'message-start',
  win: 'message-win',
  lose: 'message-lose',
};

const INITIAL_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let game = new Game(INITIAL_STATE);
let firstMove = true;
let gameStart = false;

startBtn.addEventListener('click', () => {
  if (startBtn.textContent === 'Start') {
    gameStart = !gameStart; // if startBtn push one more time

    if (gameStart) {
      game.start();
    } else {
      game = new Game(INITIAL_STATE);
      game.start();
      gameStart = true;
    }
    showMessage(null);
    showScore(game.getScore());

    updateField();
  }

  if (startBtn.textContent === 'Restart') {
    game.restart();
    updateStartBtn(false);
    firstMove = true;

    showMessage(STATUS_CLASSES.start);
    showScore(game.getScore());

    updateField();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.status === 'idle') {
    return false;
  }

  if (game.status === 'playing') {
    const keyActions = {
      ArrowUp: () => game.moveUp(),
      ArrowRight: () => game.moveRight(),
      ArrowDown: () => game.moveDown(),
      ArrowLeft: () => game.moveLeft(),
    };

    const action = keyActions[e.key];

    if (action && action()) {
      updateField();
    }
  }

  if (firstMove) {
    updateStartBtn(true);
    firstMove = false;
  }

  showScore(game.getScore());

  if (game.status === 'win') {
    showMessage(STATUS_CLASSES.win);
  }

  if (game.status === 'lose') {
    showMessage(STATUS_CLASSES.lose);
  }
});

function showMessage(statusClass) {
  messages.forEach((message) => {
    if (message.classList.contains(statusClass)) {
      message.classList.remove('hidden');
    } else {
      message.classList.add('hidden');
    }
  });
}

function showScore(score) {
  scoreDisplay.textContent = score;
}

function updateField() {
  const fragment = game.updateField(field);

  field.appendChild(fragment);
}

function updateStartBtn(isRestart) {
  if (isRestart) {
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  } else {
    startBtn.classList.remove('restart');
    startBtn.classList.add('start');
    startBtn.textContent = 'Start';
  }
}

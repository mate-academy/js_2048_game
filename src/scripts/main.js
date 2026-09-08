'use strict';

const Game = require('../modules/Game.class');
const fieldRow = document.querySelectorAll('.field-row');
const a = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let stat = 'idle';
const score = document.querySelector('.game-score');
const game = new Game(a);
let board = game.getBoard();
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const start = document.querySelector('.start');

score.innerText = game.getScore();

let usingKey = false;
let ind2 = 0;

function randomNum() {
  while (ind2 < 2) {
    const line = Math.floor(Math.random() * 4);
    const pillar = Math.floor(Math.random() * 4);

    if (ind2 < 2 && board[line][pillar] === 0) {
      board[line][pillar] = 2;
      ind2++;
    }
  }
}

let ind = 1;

start.addEventListener('click', () => {
  if (ind === 1) {
    randomNum();
    usingKey = true;
    stat = 'idle';
    changeBoard(board);
    messageStart.classList.add('hidden');
    start.innerText = 'Restart';
    start.classList.remove('start');
    start.classList.add('restart');
    ind++;
  } else if (ind === 2) {
    const zero = game.restart();

    messageStart.style.opacity = '1';
    messageStart.style.pointerEvents = 'auto';
    messageStart.innerText = 'Press "Start" to begin game. Good luck!';
    start.innerText = 'Start';
    board = zero;
    usingKey = false;
    start.classList.remove('restart');
    start.classList.add('start');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    changeBoard(board);
    ind = ind - 1;
    scoring(0);
    ind2 = 0;
  }
});

function scoring(b) {
  score.innerText = b;
}

function changeBoard(b) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const cell = fieldRow[i].children[j];

      cell.className = 'field-cell';
      cell.innerText = '';

      if (b[i][j] > 1) {
        cell.innerText = b[i][j];
        cell.classList.add(`field-cell--${b[i][j]}`);
      }
    }
  }
}

function stati(none) {
  if (none === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (none === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (usingKey === false) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    changeBoard(board);

    scoring(game.getScore());
    stat = game.getStatus();
    stati(stat);
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    changeBoard(board);

    scoring(game.getScore());
    stat = game.getStatus();
    stati(stat);
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    changeBoard(board);

    scoring(game.getScore());
    stat = game.getStatus();
    stati(stat);
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    changeBoard(board);

    scoring(game.getScore());
    stat = game.getStatus();
    stati(stat);
  }
});

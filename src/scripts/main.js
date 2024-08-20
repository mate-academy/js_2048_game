'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
// const game = new Game();
const game = new Game([
  [128, 128, 0, 8],
  [16, 8, 16, 32],
  [8, 16, 32, 64],
  [16, 32, 0, 128],
]);

// const gameField = document.querySelector('.game-field');
const button = document.querySelector('.button');
const messegeStart = document.querySelector('.message-start');
const messegeWin = document.querySelector('.message-win');
const messegeLose = document.querySelector('.message-lose');

// button start click

button.onclick = function () {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    messegeStart.classList.add('hidden');

    start();
  } else if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerText = 'Start';
    messegeStart.classList.remove('hidden');
    game.restart();

    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell) => {
      cell.innerText = '';
      cell.classList.value = '';
      cell.classList.add('field-cell');
    });

    document.querySelector('.game-score').innerText = '0';

    if (!messegeWin.classList.contains('hidden')) {
      document.querySelector('.message-win').classList.add('hidden');
    }

    if (!messegeLose.classList.contains('hidden')) {
      document.querySelector('.message-lose').classList.add('hidden');
    }
  }
};

// event lisener

document.addEventListener('keyup', (e) => {
  if (game.status === 'playing') {
    switch (e.code) {
      case 'ArrowLeft':
        if (game.canMoveLeft()) {
          // eslint-disable-next-line no-console
          console.log(game.status);
          moveLeft();
          // eslint-disable-next-line no-console
          console.log(game.status);
        }
        break;

      case 'ArrowRight':
        if (game.canMoveRight()) {
          moveRight();
        }
        break;

      case 'ArrowUp':
        if (game.canMoveUp()) {
          moveUp();
        }
        break;

      case 'ArrowDown':
        if (game.canMoveDown()) {
          moveDown();
        }
        break;
    }
  }

  document.querySelector('.game-score').innerText = game.getScore();
});

function setTheBoard() {
  for (let r = 0; r < Game.ROWS; r++) {
    for (let c = 0; c < Game.COLUMNS; c++) {
      const value = game.setBoard[r][c];
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      updateCell(tile, value);
    }
  }
}

function start() {
  game.start();
  setTheBoard();

  setTile();
  setTile();
}

function updateCell(cell, value) {
  cell.textContent = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (value > 0) {
    cell.innerText = value.toString();
    cell.classList.add('field-cell--' + value.toString());
  }
}

function setTile() {
  if (game.hasEmptyTile()) {
    const arr = game.setTwo();
    const r = arr[0];
    const c = arr[1];
    const num = arr[2];
    const tile = document.getElementById(r.toString() + '-' + c.toString());

    tile.innerText = num.toString();

    if (num === 2) {
      tile.classList.add('field-cell--2');
    } else {
      tile.classList.add('field-cell--4');
    }
  }
}

function moveLeft() {
  game.moveLeft();
  setTile();
  win();
  lose();

  for (let r = 0; r < Game.ROWS; r++) {
    for (let c = 0; c < Game.COLUMNS; c++) {
      const value = game.board[r][c];
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      updateCell(tile, value);
    }
  }
}

function moveRight() {
  game.moveRight();
  setTile();
  win();
  lose();

  for (let r = 0; r < Game.ROWS; r++) {
    for (let c = 0; c < Game.COLUMNS; c++) {
      const value = game.board[r][c];
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      updateCell(tile, value);
    }
  }
}

function moveUp() {
  game.moveUp();
  setTile();
  win();
  lose();

  for (let r = 0; r < Game.ROWS; r++) {
    for (let c = 0; c < Game.COLUMNS; c++) {
      const value = game.board[r][c];
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      updateCell(tile, value);
    }
  }
}

function moveDown() {
  game.moveDown();
  setTile();
  win();
  lose();

  for (let r = 0; r < Game.ROWS; r++) {
    for (let c = 0; c < Game.COLUMNS; c++) {
      const value = game.board[r][c];
      const tile = document.getElementById(r.toString() + '-' + c.toString());

      updateCell(tile, value);
    }
  }
}

function win() {
  if (game.getStatus() === Game.WIN) {
    messegeWin.classList.remove('hidden');
  }
}

function lose() {
  if (game.getStatus() === Game.LOSE) {
    messegeLose.classList.remove('hidden');
  }
}

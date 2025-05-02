'use strict';

// Uncomment the next lines to use your game instance in the browser
/*  const Game = require('../modules/Game.class');
 const game = new Game(); */

class Game {
  constructor(
    initialState = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0)),
  ) {
    this.state = initialState;
    this.score = 0;
    this.status = 'ready'; // 'playing' 'win' 'gameover'
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    const oldState = this.state.map((row) => row.slice());

    this.state = this.state.map((row) => this.shiftInTheDirection(row));

    if (this.isSatetCahnge(oldState, this.state)) {
      this.addRandomtile();
    }
    this.checkGameOver();
  }

  moveRight() {
    const oldState = this.state.map((row) => row.slice());

    this.state = this.state.map((row) => {
      return this.shiftInTheDirection(row.reverse()).reverse();
    });

    if (this.isSatetCahnge(oldState, this.state)) {
      this.addRandomtile();
    }
    this.checkGameOver();
  }

  moveUp() {
    const oldState = this.state.map((row) => row.slice());

    this.transpos();
    this.state = this.state.map((row) => this.shiftInTheDirection(row));
    this.transpos();

    if (this.isSatetCahnge(oldState, this.state)) {
      this.addRandomtile();
    }
    this.checkGameOver();
  }

  moveDown() {
    const oldState = this.state.map((row) => row.slice());

    this.transpos();

    this.state = this.state.map((row) => {
      return this.shiftInTheDirection(row.reverse()).reverse();
    });

    this.transpos();

    if (this.isSatetCahnge(oldState, this.state)) {
      this.addRandomtile();
    }
    this.checkGameOver();
  }

  start() {
    this.status = 'playing';
    this.addRandomtile();
    this.addRandomtile();
    updateMessage('playing');
  }

  restart() {
    this.state = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'ready';
    updateMessage('ready');
  }

  isSatetCahnge(oldState, newState) {
    for (let row = 0; row < oldState.length; row++) {
      for (let coll = 0; coll < oldState[row].length; coll++) {
        if (oldState[row][coll] !== newState[row][coll]) {
          return true; // if 1 cell change
        }
      }
    }

    return false; // state not change
  }

  addRandomtile() {
    const emptyCell = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCell.push([rowIndex, cellIndex]);
        }
      });
    });

    if (emptyCell.length > 0) {
      const randomCell =
        emptyCell[Math.floor(Math.random() * emptyCell.length)];

      this.state[randomCell[0]][randomCell[1]] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  shiftInTheDirection(row) {
    let newRow = row.filter((cell) => cell !== 0); // remove 0

    for (let i = 0; i < newRow.length; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2; // (об'єднання) association newRow
        this.score += newRow[i];
        newRow[i + 1] = 0; // remove association tile
      }
    }

    newRow = newRow.filter((cell) => cell !== 0); // remove 0 after shift

    while (newRow.length < 4) {
      newRow.push(0); // fill in the blanks
    }

    return newRow;
  }

  checkGameOver() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    const hasEmptyCell = this.state.flat().includes(0);

    const canMerge = this.state.some((row, rowIndex) => {
      return row.some((cell, cellIndex) => {
        return (
          (cellIndex < 3 && cell === row[cellIndex + 1]) ||
          (rowIndex < 3 && cell === this.state[rowIndex + 1][cellIndex])
        );
      });
    });

    if (!hasEmptyCell && !canMerge) {
      this.status = 'gameover';
      updateMessage('gameover');
    }
  }

  transpos() {
    this.state = this.state[0].map((_, cellIndex) => {
      return this.state.map((row) => row[cellIndex]);
    });
  }
}

const game = new Game();

function renderboard(state) {
  const cells = document.querySelectorAll('.field-cell');

  state.flat().forEach((value, index) => {
    const cell = cells[index];

    cell.textContent = value > 0 ? value : '';
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateUl() {
  renderboard(game.getState());
  document.querySelector('.game-score').textContent = game.getScore();

  const button = document.querySelector('.button');

  if (game.getStatus() === 'ready') {
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  } else {
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  }

  updateMessage(game.getStatus());
}

function updateMessage(stat) {
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');
  const messageColor = document.querySelector('.message');

  // hidden all messages under upload
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  messageColor.classList.remove('message-background', 'message-color');

  if (stat === 'gameover') {
    messageLose.classList.remove('hidden');
    messageColor.style.background = 'tomato';
    messageColor.style.color = 'AntiqueWhite';
  } else if (stat === 'win') {
    messageWin.classList.remove('hidden');
    messageColor.style.background = '#cccc00';
    messageColor.style.color = '#ffffcc';
  } else if (stat === 'playing') {
    messageStart.classList.add('hidden');
  } else if (stat === 'ready') {
    messageStart.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (en) => {
  switch (en.key) {
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

  updateUl();
});

document.querySelector('.start').addEventListener('click', (e) => {
  if (game.getStatus() === 'ready') {
    game.start();
  } else {
    game.restart();
  }

  updateUl();
});

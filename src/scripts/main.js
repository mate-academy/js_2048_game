'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = initialState.map((row) => row.slice());
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state.map((row) => row.slice());
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.addRandomTile();
      this.addRandomTile();
      this.status = 'playing';
    }
  }

  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.getState();
    // console.log(oldState);

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.state[i].filter((val) => val !== 0);
      // console.log(row);

      const newRow = [];
      const merged = new Set(); // обьект в к.т храним все неповтор. данные

      for (let j = 0; j < row.length; j++) {
        if (
          j < row.length - 1 && // чтоб j не была последней
          row[j] === row[j + 1] &&
          // клетка с индексом j ещё не была объединена в этом ходе.
          !merged.has(j) &&
          !merged.has(j + 1)
        ) {
          const mergedValue = row[j] * 2;

          newRow.push(mergedValue);
          this.score += mergedValue;
          merged.add(j);
          merged.add(j + 1);
          j++;
        } else {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
        this.state[i] = newRow;
      }

      if (newRow.join() !== oldState[i].join()) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    // debugger
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.getState();

    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.state[i].filter((val) => val !== 0).reverse();

      const newRow = [];
      const merged = new Set();

      for (let j = 0; j < row.length; j++) {
        if (
          j < row.length - 1 &&
          row[j] === row[j + 1] &&
          !merged.has(j) &&
          !merged.has(j + 1)
        ) {
          const mergedValue = row[j] * 2;

          newRow.push(mergedValue);
          // console.log(newRow);

          this.score += mergedValue;
          merged.add(j);
          merged.add(j + 1);
          j++;
        } else {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }
      this.state[i] = newRow.reverse();

      if (this.state[i].join() !== oldState[i].join()) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < 4; j++) {
      const col = [
        this.state[0][j],
        this.state[1][j],
        this.state[2][j],
        this.state[3][j],
      ].filter((val) => val !== 0);
      const newCol = [];
      const merged = new Set(); // исключаем дублирование

      for (let i = 0; i < col.length; i++) {
        if (
          i < col.length - 1 &&
          col[i] === col[i + 1] &&
          !merged.has(i) &&
          !merged.has(i + 1)
        ) {
          const mergedValue = col[i] * 2;

          newCol.push(mergedValue);
          this.score += mergedValue;
          merged.add(i);
          merged.add(i + 1);
          i++;
        } else {
          newCol.push(col[i]);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (this.state[i][j] !== newCol[i]) {
          moved = true;
        }
        this.state[i][j] = newCol[i];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < 4; j++) {
      const col = [
        this.state[0][j],
        this.state[1][j],
        this.state[2][j],
        this.state[3][j],
      ]
        .filter((val) => val !== 0)
        .reverse();
      let newCol = [];
      const merged = new Set();

      for (let i = 0; i < col.length; i++) {
        if (
          i < col.length - 1 &&
          col[i] === col[i + 1] &&
          !merged.has(i) &&
          !merged.has(i + 1)
        ) {
          const mergedValue = col[i] * 2;

          newCol.push(mergedValue);
          this.score += mergedValue;
          merged.add(i);
          merged.add(i + 1);
          i++;
        } else {
          newCol.push(col[i]);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }
      newCol = newCol.reverse();

      for (let i = 0; i < 4; i++) {
        if (this.state[i][j] !== newCol[i]) {
          moved = true;
        }

        this.state[i][j] = newCol[i];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length > 0) {
      // const x = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      // console.log(x);

      // const z = x.i;
      // console.log(z);
      // const d = x.j;
      // console.log(d);

      const { i, j } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  updateStatus() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i < 3 && this.state[i][j] === this.state[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

// const Game = require('../modules/Game.class');
const game = new Game();

const cells = document.querySelectorAll('.field-cell'); // клеточки моего поля
const scoreDisplay = document.querySelector('.game-score'); // табло с очками
const startButton = document.querySelector('.button'); // start
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function updateBoard() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4); // строки

    const col = index % 4; // столбцы
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell'; // Сбрасываем классы

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
  scoreDisplay.textContent = game.getScore();
}

function updateMessages() {
  const statusFunc = game.getStatus();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (statusFunc === 'idle') {
    messageStart.classList.remove('hidden');
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  } else if (statusFunc === 'win') {
    messageWin.classList.remove('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else if (statusFunc === 'lose') {
    messageLose.classList.remove('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  updateBoard();
  updateMessages();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

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
  }
  updateBoard();
  updateMessages();
});

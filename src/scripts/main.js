'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');

// Write your code here

class Game {
  constructor() {
    this.score = 0;

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
  }

  spawnTile() {
    const freeTiles = [];

    this.state.forEach((currentRow, rowIndex) => {
      currentRow.forEach((cell, colIndex) => {
        if (cell === 0) {
          freeTiles.push([rowIndex, colIndex]);
        }
      });
    });

    const randomIndex = Math.floor(Math.random() * freeTiles.length);
    const [row, col] = freeTiles[randomIndex];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    this.status = 'playing';

    let moved = false;

    this.state.forEach((currentRow, rowIndex) => {
      const rowWithoutZero = currentRow.filter((cell) => cell !== 0);
      const mergedRow = [];
      const merged = Array(4).fill(false);

      for (let i = 0; i < rowWithoutZero.length; i++) {
        if (
          rowWithoutZero[i] === rowWithoutZero[i + 1] &&
          !merged[i] &&
          !merged[i + 1]
        ) {
          mergedRow.push(rowWithoutZero[i] * 2);
          this.score += rowWithoutZero[i] * 2;
          merged[i] = true;
          i++;
          moved = true;
        } else {
          mergedRow.push(rowWithoutZero[i]);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      if (!arraysEqual(currentRow, mergedRow)) {
        moved = true;
      }

      for (let i = 0; i < 4; i++) {
        currentRow[i] = mergedRow[i];
      }
    });

    if (moved) {
      this.spawnTile();
      updateTile();
    }

    if (this.checkWin()) {
      this.status = 'win';
      document.querySelector('.message-win').classList.remove('hidden');

      return;
    }

    if (this.checkLose()) {
      this.status = 'lose';
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }

  moveRight() {
    this.status = 'playing';

    let moved = false;

    this.state.forEach((currentRow) => {
      const rowWithoutZero = currentRow.filter((cell) => cell !== 0);
      const mergedRow = [];
      const merged = Array(4).fill(false);

      for (let i = rowWithoutZero.length - 1; i >= 0; i--) {
        if (
          rowWithoutZero[i] === rowWithoutZero[i - 1] &&
          !merged[i] &&
          !merged[i - 1]
        ) {
          mergedRow.unshift(rowWithoutZero[i] * 2);
          this.score += rowWithoutZero[i] * 2;
          merged[i] = true;
          i--;
          moved = true;
        } else {
          mergedRow.unshift(rowWithoutZero[i]);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.unshift(0);
      }

      if (!arraysEqual(currentRow, mergedRow)) {
        moved = true;
      }

      for (let i = 0; i < 4; i++) {
        currentRow[i] = mergedRow[i];
      }
    });

    if (moved) {
      this.spawnTile();
      updateTile();
    }

    if (this.checkWin()) {
      this.status = 'win';
      document.querySelector('.message-win').classList.remove('hidden');

      return;
    }

    if (this.checkLose()) {
      this.status = 'lose';
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }

  moveUp() {
    this.status = 'playing';

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const columnWithoutZero = column.filter((cell) => cell !== 0);
      const mergedColumn = [];
      const merged = Array(4).fill(false);

      for (let i = 0; i < columnWithoutZero.length; i++) {
        if (
          columnWithoutZero[i] === columnWithoutZero[i + 1] &&
          !merged[i] &&
          !merged[i + 1]
        ) {
          mergedColumn.push(columnWithoutZero[i] * 2);
          this.score += columnWithoutZero[i] * 2;
          merged[i] = true;
          i++;
          moved = true;
        } else {
          mergedColumn.push(columnWithoutZero[i]);
        }
      }

      while (mergedColumn.length < 4) {
        mergedColumn.push(0);
      }

      const originalColumn = this.state.map((currentRow) => currentRow[col]);

      if (!arraysEqual(originalColumn, mergedColumn)) {
        moved = true;
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = mergedColumn[row];
      }
    }

    if (moved) {
      this.spawnTile();
      updateTile();
    }

    if (this.checkWin()) {
      this.status = 'win';
      document.querySelector('.message-win').classList.remove('hidden');

      return;
    }

    if (this.checkLose()) {
      this.status = 'lose';
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }

  moveDown() {
    this.status = 'playing';

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const columnWithoutZero = column.filter((cell) => cell !== 0);
      const mergedColumn = [];
      const merged = Array(4).fill(false);

      for (let i = columnWithoutZero.length - 1; i >= 0; i--) {
        if (
          columnWithoutZero[i] === columnWithoutZero[i - 1] &&
          !merged[i] &&
          !merged[i - 1]
        ) {
          mergedColumn.unshift(columnWithoutZero[i] * 2);
          this.score += columnWithoutZero[i] * 2;
          merged[i] = true;
          i--;
          moved = true;
        } else {
          mergedColumn.unshift(columnWithoutZero[i]);
        }
      }

      while (mergedColumn.length < 4) {
        mergedColumn.unshift(0);
      }

      const originalColumn = this.state.map((currentRow) => currentRow[col]);

      if (!arraysEqual(originalColumn, mergedColumn)) {
        moved = true;
      }

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = mergedColumn[row];
      }
    }

    if (moved) {
      this.spawnTile();
      updateTile();
    }

    if (this.checkWin()) {
      this.status = 'win';
      document.querySelector('.message-win').classList.remove('hidden');

      return;
    }

    if (this.checkLose()) {
      this.status = 'lose';
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }

  getScore() {
    const score = document.querySelector('.game-score');

    score.textContent = this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.state;
  }

  start() {
    buttonStart.className = 'button restart';
    buttonStart.textContent = 'Restart';
    document.querySelector('.message-start').hidden = true;
    game.spawnTile();
    game.spawnTile();
    updateTile();
    buttonStart.removeEventListener('click', firstStart);
    this.status = 'playing';
  }

  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
    this.score = 0;
  }

  checkLose() {
    for (let currentRow = 0; currentRow < 4; currentRow++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[currentRow][col] === 0) {
          return false;
        }

        if (
          col < 3 &&
          this.state[currentRow][col] === this.state[currentRow][col + 1]
        ) {
          return false;
        }

        if (
          currentRow < 3 &&
          this.state[currentRow][col] === this.state[currentRow + 1][col]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  checkWin() {
    return this.state.some((currentRow) => currentRow.includes(2048));
  }
}

const buttonStart = document.querySelector('.start');
const game = new Game();

const firstStart = () => {
  game.start();
  buttonStart.removeEventListener('click', firstStart);
  buttonStart.addEventListener('click', restartGame, { once: true });
};

buttonStart.addEventListener('click', firstStart, { once: true });

const restartGame = () => {
  game.restart();
  updateTile();

  buttonStart.className = 'button start';
  buttonStart.textContent = 'Start';

  document.querySelector('.message-start').classList.remove('hidden');
  document.querySelector('.message').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');

  buttonStart.removeEventListener('click', restartGame);
  buttonStart.addEventListener('click', firstStart, { once: true });
};

document.addEventListener('keydown', (eve) => {
  if (eve.key === 'ArrowRight') {
    game.moveRight();
  }

  if (eve.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (eve.key === 'ArrowUp') {
    game.moveUp();
  }

  if (eve.key === 'ArrowDown') {
    game.moveDown();
  }
});

function updateTile() {
  const cells = document.querySelectorAll('.field-cell');

  let index = 0;

  game.getState().forEach((currentRow) => {
    currentRow.forEach((cell) => {
      const cellElement = cells[index];

      cellElement.textContent = cell === 0 ? '' : cell;
      cellElement.className = 'field-cell';

      if (cell !== 0) {
        cellElement.classList.add(`field-cell--${cell}`);
      }
      index++;
    });
  });
  game.getScore();
  game.getStatus();
}

function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

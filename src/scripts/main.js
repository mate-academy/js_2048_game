'use strict';

const fieldRows = document.querySelectorAll('.field_row');
const messageWin = document.querySelector('.message_win');
const messageLose = document.querySelector('.message_lose');
const button = document.querySelector('.start');
const messageStart = document.querySelector('.message_start');
const gameScore = document.querySelector('.game_score');

const GRID_SIZE = 4;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    grid.slideUp();
  } else if (e.key === 'ArrowLeft') {
    grid.slideLeft();
  } else if (e.key === 'ArrowDown') {
    grid.slideDown();
  } else if (e.key === 'ArrowRight') {
    grid.slideRight();
  }
});

button.addEventListener('click', () => {
  button.classList.replace('start', 'restart');
  button.textContent = 'Restart';
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  grid.startGame();
});

class Grid2048 {
  startGame() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.addNumber();
    this.addNumber();
    this.updateGrid();
  }

  addNumber() {
    const zeros = [];

    for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
      for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
        if (this.field[rowIndex][colIndex] === 0) {
          zeros.push([rowIndex, colIndex]);
        }
      }
    }

    const randomZeroIndex = Math.floor(Math.random() * zeros.length);
    const randomZeroCoord = zeros[randomZeroIndex];
    const digit = Math.random() < 0.9 ? 2 : 4;
    const x = randomZeroCoord[0];
    const y = randomZeroCoord[1];

    this.field[x][y] = digit;
  }

  updateGrid() {
    for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
      for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
        const fieldRow = fieldRows[rowIndex];
        const fieldCell = fieldRow.children[colIndex];
        const cellValue = this.field[rowIndex][colIndex];

        if (cellValue === 0) {
          fieldCell.className = 'field_cell';
          fieldCell.textContent = '';
        } else {
          fieldCell.className = `field_cell field_cell--${cellValue}`;
          fieldCell.textContent = cellValue;
        }
      }
    }
  }

  messageWin() {
    for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
      for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
        if (this.field[rowIndex][colIndex] === 2048) {
          messageWin.classList.remove('hidden');
        }
      }
    }
  }

  gameOver() {
    const fieldCopy = [...this.field];

    for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
      for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
        if (fieldCopy[rowIndex][colIndex] === 0) {
          return false;
        }

        if (rowIndex !== GRID_SIZE - 1) {
          if (
            fieldCopy[rowIndex][colIndex] === fieldCopy[rowIndex + 1][colIndex]
          ) {
            return false;
          }
        }

        if (colIndex !== GRID_SIZE - 1) {
          if (
            fieldCopy[rowIndex][colIndex] === fieldCopy[rowIndex][colIndex + 1]
          ) {
            return false;
          }
        }
      }
    }

    return true;
  }

  messageLose() {
    if (this.gameOver()) {
      messageLose.classList.remove('hidden');
    }
  }

  operate(inputRow) {
    let row = [...inputRow];

    row = this.slide(row);
    row = this.combine(row);
    row = this.slide(row);

    return row;
  }

  slide(row) {
    let arr = row.filter((item) => item);
    const missing = GRID_SIZE - arr.length;
    const zeros = Array(missing).fill(0);

    arr = arr.concat(zeros);

    return arr;
  }

  combine(row) {
    for (let i = GRID_SIZE - 1; i >= 1; i--) {
      const a = row[i];
      const b = row[i - 1];

      if (a === b) {
        row[i] = a + b;
        row[i - 1] = 0;
        this.score += row[i];
        gameScore.textContent = this.score;
      }
    }

    return row;
  }

  flipField() {
    const newField = [];

    for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
      const newRow = [];

      for (let colIndex = GRID_SIZE - 1; colIndex >= 0; colIndex--) {
        newRow.push(this.field[rowIndex][colIndex]);
      }
      newField.push(newRow);
    }
    this.field = newField;
  }

  rotateField() {
    const newField = [];

    for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
      const newRow = [];

      for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
        newRow.push(this.field[GRID_SIZE - 1 - colIndex][rowIndex]);
      }

      newField.push(newRow);
    }

    this.field = newField;
  }

  slideLeft() {
    let changed = false;

    for (let rowIndex = 0; rowIndex < GRID_SIZE; rowIndex++) {
      const oldRow = [...this.field[rowIndex]];
      const newRow = this.operate(this.field[rowIndex]);

      for (let colIndex = 0; colIndex < GRID_SIZE; colIndex++) {
        if (oldRow[colIndex] !== newRow[colIndex]) {
          changed = true;
          break;
        }
      }

      this.field[rowIndex] = newRow;
    }

    if (changed) {
      this.addNumber();
      this.updateGrid();
      this.messageWin();
      this.messageLose();
    }
  }

  slideRight() {
    this.flipField();
    this.slideLeft();
    this.flipField();
    this.updateGrid();
  }

  slideDown() {
    this.rotateField();
    this.slideLeft();
    this.rotateField();
    this.rotateField();
    this.rotateField();
    this.updateGrid();
  }

  slideUp() {
    this.rotateField();
    this.rotateField();
    this.rotateField();
    this.slideLeft();
    this.rotateField();
    this.updateGrid();
  }
}

const grid = new Grid2048();

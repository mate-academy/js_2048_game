'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.grid = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.grid.length; row++) {
      let rowWithoutZero = this.grid[row].filter((item) => item > 0);

      for (let i = 0; i < rowWithoutZero.length - 1; i++) {
        if (rowWithoutZero[i] === rowWithoutZero[i + 1]) {
          rowWithoutZero[i] *= 2;
          rowWithoutZero[i + 1] = 0;
          this.score += rowWithoutZero[i];
          moved = true;
        }
      }

      rowWithoutZero = rowWithoutZero.filter((cell) => cell !== 0);

      while (rowWithoutZero.length < 4) {
        rowWithoutZero.push(0);
      }

      if (this.grid[row].toString() !== rowWithoutZero.toString()) {
        moved = true;
      }

      this.grid[row] = rowWithoutZero;
    }

    this.updateDOM();

    if (this.checkWin()) {
      return;
    }

    if (moved) {
      this.addStartCell();
    }
    this.checkLose();
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < this.grid.length; row++) {
      let rowWithoutZero = this.grid[row].filter((item) => item > 0);

      for (let i = rowWithoutZero.length - 1; i > 0; i--) {
        if (rowWithoutZero[i] === rowWithoutZero[i - 1]) {
          rowWithoutZero[i] *= 2;
          rowWithoutZero[i - 1] = 0;
          this.score += rowWithoutZero[i];
          moved = true;
        }
      }

      rowWithoutZero = rowWithoutZero.filter((cell) => cell !== 0);

      while (rowWithoutZero.length < 4) {
        rowWithoutZero.unshift(0);
      }

      if (this.grid[row].toString() !== rowWithoutZero.toString()) {
        moved = true;
      }

      this.grid[row] = rowWithoutZero;
    }

    this.updateDOM();

    if (this.checkWin()) {
      return;
    }

    if (moved) {
      this.addStartCell();
    }
    this.checkLose();
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < this.grid[0].length; col++) {
      let colWithoutZero = [];

      for (let row = 0; row < this.grid.length; row++) {
        if (this.grid[row][col] > 0) {
          colWithoutZero.push(this.grid[row][col]);
        }
      }

      for (let i = 0; i < colWithoutZero.length - 1; i++) {
        if (colWithoutZero[i] === colWithoutZero[i + 1]) {
          colWithoutZero[i] *= 2;
          colWithoutZero[i + 1] = 0;
          this.score += colWithoutZero[i];
          moved = true;
        }
      }

      colWithoutZero = colWithoutZero.filter((cell) => cell !== 0);

      while (colWithoutZero.length < 4) {
        colWithoutZero.push(0);
      }

      for (let row = 0; row < this.grid.length; row++) {
        if (this.grid[row][col] !== colWithoutZero[row]) {
          moved = true;
        }
        this.grid[row][col] = colWithoutZero[row];
      }
    }

    this.updateDOM();

    if (this.checkWin()) {
      return;
    }

    if (moved) {
      this.addStartCell();
    }
    this.checkLose();
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < this.grid.length; col++) {
      let colWithoutZero = [];

      for (let row = 0; row < this.grid.length; row++) {
        if (this.grid[row][col] > 0) {
          colWithoutZero.push(this.grid[row][col]);
        }
      }

      for (let i = colWithoutZero.length - 1; i > 0; i--) {
        if (colWithoutZero[i] === colWithoutZero[i - 1]) {
          colWithoutZero[i] *= 2;
          colWithoutZero[i - 1] = 0;
          this.score += colWithoutZero[i];
          moved = true;
        }
      }

      colWithoutZero = colWithoutZero.filter((cell) => cell !== 0);

      while (colWithoutZero.length < 4) {
        colWithoutZero.unshift(0);
      }

      for (let row = 0; row < this.grid.length; row++) {
        if (this.grid[row][col] !== colWithoutZero[row]) {
          moved = true;
        }
        this.grid[row][col] = colWithoutZero[row] || 0;
      }
    }

    this.updateDOM();

    if (this.checkWin()) {
      return;
    }

    if (moved) {
      this.addStartCell();
    }
    this.checkLose();
  }

  checkWin() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    this.status = 'playing';

    return false;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.grid;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.updateDOM();

    this.addStartCell();
    this.addStartCell();
  }

  restart() {
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell) => {
      cell.innerHTML = '';
      cell.className = 'field-cell';
    });

    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.updateDOM();
  }

  addStartCell() {
    const basicCells = Math.random() >= 0.9 ? 4 : 2;
    const emptyCells = this.grid.flat().filter((cell) => cell === 0);

    if (emptyCells.length === 0) {
      return;
    }

    let foundedEmpty = false;

    while (!foundedEmpty) {
      try {
        const rowIndex = Math.floor(Math.random() * 4);
        const cellIndex = Math.floor(Math.random() * 4);

        if (this.grid[rowIndex] && this.grid[rowIndex][cellIndex] === 0) {
          this.grid[rowIndex][cellIndex] = basicCells;
          this.updateDOM();
          foundedEmpty = true;
        }
      } catch (error) {
        return;
      }
    }
  }

  updateDOM() {
    const cells = document.querySelectorAll('.field-cell');

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        const cell = cells[row * 4 + col];
        const value = this.grid[row][col];

        cell.className = 'field-cell';
        cell.innerHTML = '';

        if (value > 0) {
          cell.classList.add(`field-cell--${value}`);
          cell.innerHTML = value;
        }
      }
    }
  }

  checkLose() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === 0) {
          this.status = 'playing';

          return false;
        }
      }
    }

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (
          (row > 0 && this.grid[row][col] === this.grid[row - 1][col]) ||
          (row < this.grid.length - 1 &&
            this.grid[row][col] === this.grid[row + 1][col]) ||
          (col > 0 && this.grid[row][col] === this.grid[row][col - 1]) ||
          (col < this.grid[row].length - 1 &&
            this.grid[row][col] === this.grid[row][col + 1])
        ) {
          this.status = 'playing';

          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }
}

module.exports = Game;

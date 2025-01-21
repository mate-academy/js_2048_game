'use strict';

export default class Game {
  constructor(field) {
    this.matrixLength = 4;
    this.field = field;

    this.matrix = Array(this.matrixLength)
      .fill(null)
      .map(() => Array(this.matrixLength).fill(0));
    this.renderField();
    this.score = 0;
    this.status = 'idle';
  }

  checkFreeCell() {
    return this.matrix.flat().some((item) => item === 0);
  }

  getRandomEmptyCell() {
    const basicNumber = Math.random() > 0.5 ? 2 : 4;
    let isEmpty = false;

    while (!isEmpty && this.checkFreeCell()) {
      const rowIndex = Math.floor(Math.random() * this.matrix.length);
      const columnIndex = Math.floor(Math.random() * this.matrix.length);

      if (this.matrix[rowIndex][columnIndex] === 0) {
        this.matrix[rowIndex][columnIndex] = basicNumber;
        isEmpty = true;
      }
    }
  }

  renderField() {
    this.field.innerHTML = '';

    this.matrix.flat().forEach((number) => {
      const cell = document.createElement('div');

      cell.classList.add('game__cell');

      if (number === 0) {
        cell.textContent = '';
      } else {
        cell.textContent = number;
        cell.classList.add(`game__cell--${number}`);
      }
      this.field.append(cell);
    });
  }

  restartMatrix() {
    this.matrix.forEach((row) => row.fill(0));
  }

  moveLeft() {
    let isRowMoved = false;

    this.matrix = this.matrix.map((row) => {
      const filteredRow = row.filter((item) => item !== 0);
      const mergedRow = filteredRow.map((item, index, currentRow) => {
        if (currentRow[index] === currentRow[index + 1]) {
          const newItem = item * 2;
          currentRow[index + 1] = 0;
          this.score += newItem;

          return newItem;
        } else {
          return item;
        }
      });

      const resultRow = mergedRow.filter((item) => item !== 0);

      while (resultRow.length < row.length) {
        resultRow.push(0);
      }

      if (JSON.stringify(row) !== JSON.stringify(resultRow)) {
        isRowMoved = true;
      }

      return resultRow;
    });

    if (isRowMoved) {
      this.rowMoved();
    }
  }

  getReversedMatrix(matrix) {
    return matrix.map((row) => row.reverse());
  }

  moveRight() {
    this.matrix = this.getReversedMatrix(this.matrix);
    this.moveLeft();
    this.matrix = this.getReversedMatrix(this.matrix);
  }

  getTransposedMatrix(matrix) {
    const transposedMatrix = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));

    matrix.forEach((row, rowindex) => {
      row.forEach((cell, cellIndex) => {
        transposedMatrix[cellIndex][rowindex] = cell;
      });
    });

    return transposedMatrix;
  }

  moveUp() {
    this.matrix = this.getTransposedMatrix(this.matrix);
    this.moveLeft();
    this.matrix = this.getTransposedMatrix(this.matrix);
  }

  moveDown() {
    this.matrix = this.getTransposedMatrix(this.matrix);
    this.moveRight();
    this.matrix = this.getTransposedMatrix(this.matrix);
  }

  rowMoved() {
    this.getRandomEmptyCell();

    if (this.matrix.flat().includes(2048)) {
      this.status = 'win';
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        const current = this.matrix[i][j];

        if (current === 0) {
          return true;
        }

        if (
          (j < this.matrix.length - 1 && current === this.matrix[i][j + 1]) ||
          (i < this.matrix.length - 1 && current === this.matrix[i + 1][j]) ||
          (i > 0 && current === this.matrix[i - 1][j]) ||
          (j > 0 && current === this.matrix[i][j - 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  getScore(element) {
    element.textContent = this.score;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  start() {
    this.restartMatrix();
    this.status = 'playing';
    this.getRandomEmptyCell();
    this.getRandomEmptyCell();
    this.renderField();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';
    this.restartMatrix();
    this.renderField();
  }
}

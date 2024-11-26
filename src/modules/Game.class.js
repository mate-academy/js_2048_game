'use strict';

class Game {
  #state;
  #score;
  #status;
  #initialState;

  constructor(initialState = null) {
    this.#initialState = initialState
      ? this.#deepCopy(initialState)
      : Array.from({ length: 4 }, () => Array(4).fill(0));
    this.restart();
  }

  getState() {
    return this.#deepCopy(this.#state);
  }

  getScore() {
    return this.#score;
  }

  getStatus() {
    return this.#status;
  }

  start() {
    if (this.#status === 'idle') {
      this.#addRandomCell();
      this.#addRandomCell();
      this.#status = 'playing';
    }
  }

  restart() {
    this.#state = this.#deepCopy(this.#initialState);
    this.#score = 0;
    this.#status = 'idle';
  }

  moveLeft() {
    this.#makeMove('left');
  }

  moveRight() {
    this.#makeMove('right');
  }

  moveUp() {
    this.#makeMove('up');
  }

  moveDown() {
    this.#makeMove('down');
  }

  #makeMove(direction) {
    if (this.#status !== 'playing' && this.#status !== 'win') {
      return;
    }

    let moved = false;

    if (direction === 'left' || direction === 'right') {
      moved = this.#processRows(direction === 'left');
    } else if (direction === 'up' || direction === 'down') {
      this.#transpose();
      moved = this.#processRows(direction === 'up');
      this.#transpose();
    }

    if (moved) {
      this.#addRandomCell();
      this.#updateStatus();
    }
  }

  #processRows(isLeft) {
    let moved = false;

    for (const row of this.#state) {
      const processedRow = isLeft ? row : [...row].reverse();
      const { newRow, hasMoved } = this.#compressRow(processedRow);

      if (hasMoved) {
        moved = true;
      }
      row.splice(0, 4, ...(isLeft ? newRow : newRow.reverse()));
    }

    return moved;
  }

  #compressRow(row) {
    const nonZero = row.filter((n) => n !== 0);
    const newRow = Array(4).fill(0);
    let moved = false;
    let writeIndex = 0;

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        newRow[writeIndex++] = nonZero[i] * 2;
        this.#score += nonZero[i] * 2;

        if (newRow[writeIndex - 1] === 2048) {
          this.#status = 'win';
        }
        i++;
        moved = true;
      } else {
        newRow[writeIndex++] = nonZero[i];

        if (newRow[writeIndex - 1] !== row[writeIndex - 1]) {
          moved = true;
        }
      }
    }

    return { newRow, hasMoved: moved };
  }

  #addRandomCell() {
    const emptyCells = [];

    this.#state.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push({ i, j });
        }
      }));

    if (emptyCells.length > 0) {
      const { i, j } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.#state[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  #updateStatus() {
    if (this.#status === 'win') {
      return;
    }

    if (!this.#canMakeMove()) {
      this.#status = 'lose';
    }
  }

  #canMakeMove() {
    return this.#state.some((row, i) =>
      row.some((cell, j) => {
        if (cell === 0) {
          return true;
        }

        if (j < 3 && cell === row[j + 1]) {
          return true;
        }

        if (i < 3 && cell === this.#state[i + 1][j]) {
          return true;
        }

        return false;
      }));
  }

  #transpose() {
    this.#state = this.#state[0].map((_, colIndex) =>
      this.#state.map((row) => row[colIndex]),
    );
  }

  #deepCopy(state) {
    return state.map((row) => [...row]);
  }
}

module.exports = Game;

'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  reset() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  start() {
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
  }

  addRandomCell() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = this.state[row].filter((val) => val !== 0);

      for (let col = 0; col < currentRow.length - 1; col++) {
        if (currentRow[col] === currentRow[col + 1]) {
          currentRow[col] *= 2;
          this.score += currentRow[col];
          currentRow.splice(col + 1, 1);
        }
      }

      while (currentRow.length < 4) {
        currentRow.push(0);
      }

      if (!this.arraysEqual(this.state[row], currentRow)) {
        moved = true;
        this.state[row] = currentRow;
      }
    }

    if (moved) {
      this.addRandomCell();
      this.checkGameStatus();
    }
  }

  moveRight() {
    this.reverseRows();
    this.moveLeft();
    this.reverseRows();
    this.checkGameStatus();
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
    this.checkGameStatus();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
    this.checkGameStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  transpose() {
    const newState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newState[j][i] = this.state[i][j];
      }
    }
    this.state = newState;
  }

  reverseRows() {
    for (let row = 0; row < 4; row++) {
      this.state[row].reverse();
    }
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  checkGameStatus() {
    // Перевірка на перемогу
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // Перевірка на поразку
    const hasEmpty = this.state.some((row) => row.includes(0));

    if (hasEmpty) {
      return;
    } // ще можна грати

    // Перевірка на можливе злиття
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];
        const right = col < 3 ? this.state[row][col + 1] : null;
        const down = row < 3 ? this.state[row + 1][col] : null;

        if (current === right || current === down) {
          return;
        } // ще можна грати
      }
    }

    this.status = 'lose';
  }
}
module.exports = Game;

'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  updateBoard() {
    const table = document.getElementById('game-board').querySelector('tbody');

    table.innerHTML = '';

    for (let row = 0; row < this.size; row++) {
      const tr = document.createElement('tr');

      for (let col = 0; col < this.size; col++) {
        const value = this.board[row][col];
        const td = document.createElement('td');

        td.classList.add('field-cell');

        if (value) {
          td.classList.add(`field-cell--${value}`);
          td.textContent = value;
        } else {
          td.textContent = '';
        }

        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const newRow = [];

      for (let col = 0; col < this.size; col++) {
        const value = this.board[row][col];

        if (value !== 0) {
          newRow.push(value);
        }
      }

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] !== newRow[col]) {
          this.board[row][col] = newRow[col];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateBoard();
    }

    return this.score;
  }

  moveRight() {
    let moved = false;

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = this.size - 1; row >= 0; row--) {
        const value = this.board[col][row];

        if (value !== 0) {
          column.push(value);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i + 1, 1);
        }
      }

      while (column.length < this.size) {
        column.push(0);
      }

      for (let row = this.size - 1; row >= 0; row--) {
        const newValue = column[this.size - 1 - row];

        if (this.board[col][row] !== newValue) {
          this.board[col][row] = newValue;
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateBoard();
    }

    return this.score;
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        const value = this.board[row][col];

        if (value !== 0) {
          column.push(value);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i + 1, 1);
        }
      }

      while (column.length < this.size) {
        column.push(0);
      }

      for (let row = 0; row < this.size; row++) {
        if (this.board[row][col] !== column[row]) {
          this.board[row][col] = column[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateBoard();
    }

    return this.score;
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = this.size - 1; row >= 0; row--) {
        const value = this.board[row][col];

        if (value !== 0) {
          column.push(value);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column.splice(i + 1, 1);
        }
      }

      while (column.length < this.size) {
        column.push(0);
      }

      for (let row = this.size - 1; row >= 0; row--) {
        const newValue = column[this.size - 1 - row];

        if (this.board[row][col] !== newValue) {
          this.board[row][col] = newValue;
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateBoard();
    }

    return this.score;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateBoard();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateBoard();
  }

  isGameOver() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        const current = this.board[row][col];

        if (row < this.size - 1 && this.board[row + 1][col] === current) {
          return false;
        }

        if (col < this.size - 1 && this.board[row][col + 1] === current) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Game;

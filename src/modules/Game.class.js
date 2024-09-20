'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState = this.createEmptyBoard()) {
    this.state = initialState;
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    this.idle = true;
    this.start();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(null));
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    if (this.idle) {
      return 'idle';
    }

    if (this.won) {
      return 'Won';
    }

    if (this.gameOver) {
      return 'Game Over';
    }

    return 'Playing';
  }

  start() {
    this.addRandomTile();
    this.addRandomTile();
    this.idle = false;
  }

  restart() {
    this.state = this.createEmptyBoard();
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    this.idle = false;
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!this.state[i][j]) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.compressRow(this.state[row]);

      moved = moved || newRow.moved;
      this.state[row] = newRow.row;
    }

    if (moved) {
      this.afterMove();
    }
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const newRow = this.compressRow(this.state[row].slice().reverse());

      moved = moved || newRow.moved;
      this.state[row] = newRow.row.reverse();
    }

    if (moved) {
      this.afterMove();
    }
  }

  moveUp() {
    this.rotateBoard();
    this.moveLeft();
    this.rotateBoard(true);
  }

  moveDown() {
    this.rotateBoard();
    this.moveRight();
    this.rotateBoard(true);
  }

  pause() {
    this.idle = true;
  }

  resume() {
    this.idle = false;
  }

  rotateBoard(clockwise = false) {
    const N = this.state.length;
    const newBoard = Array.from({ length: N }, () => Array(N).fill(0));

    for (let row = 0; row < N; row++) {
      for (let col = 0; col < N; col++) {
        if (clockwise) {
          // Повертаємо на 90 градусів за годинниковою стрілкою
          newBoard[col][N - 1 - row] = this.state[row][col];
        } else {
          // Повертаємо на 90 градусів проти годинникової стрілки
          newBoard[N - 1 - col][row] = this.state[row][col];
        }
      }
    }

    this.state = newBoard;
  }

  compressRow(row) {
    let newRow = row.filter((x) => x !== null);
    let moved = false;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = null;
        i++;
        moved = true;

        if (newRow[i] === 2048) {
          this.won = true;
        }
      }
    }

    newRow = newRow.filter((x) => x !== null);

    while (newRow.length < 4) {
      newRow.push(null);
    }

    return {
      row: newRow,
      moved: moved || row.some((val, idx) => newRow[idx] !== val),
    };
  }

  afterMove() {
    this.addRandomTile();

    if (!this.canMove()) {
      this.gameOver = true;
    }
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!this.state[row][col]) {
          return true;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

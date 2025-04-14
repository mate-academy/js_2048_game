'use strict';

/**
 * This class represents the game.
 */

class Game {
  constructor(initialState = this.generateEmptyBoard()) {
    this.boardSize = 4;
    this.board = initialState;
    this.score = 0;
    this.gameOver = false;
  }

  generateEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.gameOver ? 'over' : 'playing';
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < this.boardSize; i++) {
      const row = this.board[i].filter((value) => value !== 0);
      const newRow = [];
      const merged = [];

      for (let j = 0; j < row.length; j++) {
        if (row[j] === row[j + 1] && !merged[j] && !merged[j + 1]) {
          newRow.push(row[j] * 2);
          merged[j] = merged[j + 1] = true;
          this.score += row[j] * 2;
          j++;
        } else {
          newRow.push(row[j]);
        }
      }

      while (newRow.length < this.boardSize) {
        newRow.push(0);
      }

      if (JSON.stringify(newRow) !== JSON.stringify(this.board[i])) {
        moved = true;
        this.board[i] = newRow;
      }
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < this.boardSize; i++) {
      const row = this.board[i].filter((value) => value !== 0);
      const newRow = [];
      const merged = [];

      for (let j = row.length - 1; j >= 0; j--) {
        if (row[j] === row[j - 1] && !merged[j] && !merged[j - 1]) {
          newRow.unshift(row[j] * 2);
          merged[j] = merged[j - 1] = true;
          this.score += row[j] * 2;
          j--;
        } else {
          newRow.unshift(row[j]);
        }
      }

      while (newRow.length < this.boardSize) {
        newRow.unshift(0);
      }

      if (JSON.stringify(newRow) !== JSON.stringify(this.board[i])) {
        moved = true;
        this.board[i] = newRow;
      }
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let j = 0; j < this.boardSize; j++) {
      const col = [];

      for (let i = 0; i < this.boardSize; i++) {
        col.push(this.board[i][j]);
      }

      const newCol = col.filter((value) => value !== 0);
      const merged = [];
      const finalCol = [];

      for (let i = 0; i < newCol.length; i++) {
        if (newCol[i] === newCol[i + 1] && !merged[i] && !merged[i + 1]) {
          finalCol.push(newCol[i] * 2);
          merged[i] = merged[i + 1] = true;
          this.score += newCol[i] * 2;
          i++;
        } else {
          finalCol.push(newCol[i]);
        }
      }

      while (finalCol.length < this.boardSize) {
        finalCol.push(0);
      }

      for (let i = 0; i < this.boardSize; i++) {
        if (finalCol[i] !== this.board[i][j]) {
          moved = true;
          this.board[i][j] = finalCol[i];
        }
      }
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let j = 0; j < this.boardSize; j++) {
      const col = [];

      for (let i = 0; i < this.boardSize; i++) {
        col.push(this.board[i][j]);
      }

      const newCol = col.filter((value) => value !== 0);
      const merged = [];
      const finalCol = [];

      for (let i = newCol.length - 1; i >= 0; i--) {
        if (newCol[i] === newCol[i - 1] && !merged[i] && !merged[i - 1]) {
          finalCol.unshift(newCol[i] * 2);
          merged[i] = merged[i - 1] = true;
          this.score += newCol[i] * 2;
          i--;
        } else {
          finalCol.unshift(newCol[i]);
        }
      }

      while (finalCol.length < this.boardSize) {
        finalCol.unshift(0);
      }

      for (let i = 0; i < this.boardSize; i++) {
        if (finalCol[i] !== this.board[i][j]) {
          moved = true;
          this.board[i][j] = finalCol[i];
        }
      }
    }

    return moved;
  }

  start() {
    this.board = this.generateEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
    this.gameOver = false;
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() > 0.1 ? 2 : 4;
    }
  }

  isGameOver() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (
          i < this.boardSize - 1 &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          return false;
        }

        if (
          j < this.boardSize - 1 &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Game;

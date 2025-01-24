'use strict';
export default class Game {
  constructor(initialState) {
    this.score = 0;
    this.bestScore = 0;

    if (initialState) {
      this.board = initialState;
    } else {
      this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    }
  }
  moveLeft() {
    this.board = this.board.map((row) => {
      const filteredRow = row.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
          filteredRow.push(0);
        }
      }

      return [
        ...filteredRow,
        ...Array(row.length - filteredRow.length).fill(0),
      ];
    });
    this.updateBestScore();
    this.addRandomTile();
  }

  moveRight() {
    this.board = this.board.map((row) => {
      const filteredRow = row.filter((num) => num !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i - 1, 1);
          filteredRow.unshift(0);
        }
      }

      return [
        ...Array(row.length - filteredRow.length).fill(0),
        ...filteredRow,
      ];
    });
    this.updateBestScore();
    this.addRandomTile();
  }
  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }
  moveUp() {
    const transposedBoard = this.transpose(this.board);

    for (let i = 0; i < transposedBoard.length; i++) {
      const filteredRow = transposedBoard[i].filter((value) => value !== 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] *= 2;
          this.score += filteredRow[j];
          filteredRow.splice(j + 1, 1);
          filteredRow.push(0);
        }
      }

      transposedBoard[i] = [
        ...filteredRow,
        ...Array(4 - filteredRow.length).fill(0),
      ];
    }

    this.board = this.transpose(transposedBoard);
    this.updateBestScore();
    this.addRandomTile();
  }

  moveDown() {
    const transposedBoard = this.transpose(this.board);

    for (let i = 0; i < transposedBoard.length; i++) {
      const filteredRow = transposedBoard[i].filter((value) => value !== 0);

      for (let j = filteredRow.length - 1; j > 0; j--) {
        if (filteredRow[j] === filteredRow[j - 1]) {
          filteredRow[j] *= 2;
          this.score += filteredRow[j];
          filteredRow.splice(j - 1, 1);
          filteredRow.unshift(0);
        }
      }

      transposedBoard[i] = [
        ...Array(4 - filteredRow.length).fill(0),
        ...filteredRow,
      ];
    }
    this.board = this.transpose(transposedBoard);
    this.updateBestScore();
    this.addRandomTile();
  }
  getScore() {
    return this.score;
  }
  getState() {
    return this.board;
  }

  updateBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
  }

  hasAvailableMoves() {
    for (const row of this.board) {
      if (row.includes(0)) {
        return true;
      }
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    for (let i = 0; i < this.board.length - 1; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
  getStatus() {
    if (this.board.flat().includes(2048)) {
      return 'win';
    }

    if (!this.hasAvailableMoves()) {
      return 'lose';
    }

    return this.board.flat().some((value) => value !== 0) ? 'playing' : 'idle';
  }
  addRandomTile() {
    const emptyTiles = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          emptyTiles.push({ row: r, col: c });
        }
      }
    }

    if (emptyTiles.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const { row, col } = emptyTiles[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  renderBoard() {
    const rows = document.querySelectorAll('.field-row');

    this.board.forEach((row, rowIndex) => {
      const cells = rows[rowIndex].querySelectorAll('.field-cell');

      row.forEach((cell, colIndex) => {
        const cellElement = cells[colIndex];

        cellElement.textContent = '';

        if (cell !== 0) {
          cellElement.textContent = cell;
          cellElement.className = `field-cell field-cell--${cell}`;
        } else {
          cellElement.className = 'field-cell';
        }
      });
    });
  }

  start() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
    this.renderBoard();
  }
  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
    this.renderBoard();
  }
}

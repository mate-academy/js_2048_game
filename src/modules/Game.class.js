'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  checkWinCondition() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }
  }

  checkLoseCondition() {
    for (const row of this.board) {
      if (row.includes(0)) {
        return;
      }
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return;
        }
      }
    }

    for (let j = 0; j < this.board[0].length; j++) {
      for (let i = 0; i < this.board.length - 1; i++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = [...this.board[row]];
      let newRow = currentRow.filter((value) => value !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (currentRow.toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkWinCondition();
    this.checkLoseCondition();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = [...this.board[row]];
      let newRow = currentRow.filter((value) => value !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i - 1] = 0;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      if (currentRow.toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkWinCondition();
    this.checkLoseCondition();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      const oldColumn = [...column];
      let newColumn = column.filter((value) => value !== 0);

      for (let i = 0; i < newColumn.length - 1; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          newColumn[i] *= 2;
          this.score += newColumn[i];
          newColumn[i + 1] = 0;
        }
      }

      newColumn = newColumn.filter((value) => value !== 0);

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      if (oldColumn.toString() !== newColumn.toString()) {
        moved = true;
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkWinCondition();
    this.checkLoseCondition();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      let newColumn = column.filter((value) => value !== 0);

      for (let i = newColumn.length - 1; i > 0; i--) {
        if (newColumn[i] === newColumn[i - 1]) {
          newColumn[i] *= 2;
          this.score += newColumn[i];
          newColumn[i - 1] = 0;
        }
      }

      newColumn = newColumn.filter((value) => value !== 0);

      while (newColumn.length < 4) {
        newColumn.unshift(0);
      }

      const oldColumn = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      if (oldColumn.toString() !== newColumn.toString()) {
        moved = true;
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkWinCondition();
    this.checkLoseCondition();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  reset() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  hasValidMoves() {
    if (this.board.some((row) => row.includes(0))) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];

        if (col < 3 && value === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && value === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      if (this.board[row].includes(2048)) {
        this.status = 'won';

        return true;
      }
    }

    return false;
  }
}

module.exports = Game;

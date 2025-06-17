'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let initialBord;

class Game {
  constructor(initialState) {
    if (initialState) {
      initialBord = JSON.parse(JSON.stringify(initialState));
    }

    this.board = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : JSON.parse(JSON.stringify(board));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];
      let newRow = row.filter((value) => value !== 0);

      for (let j = 0; j < newRow.length; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          newRow[j + 1] = 0;
          this.score += newRow[j];
        }
      }
      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }
      this.board[i] = newRow;
    }

    if (!this.boardsAreEqual(this.board, oldBoard)) {
      if (!this.hasWon()) {
        if (!this.canMove()) {
          return;
        }
      }

      this.addRandomTile();
    } else {
      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < this.board.length; i++) {
      const row = [...this.board[i]].reverse();

      let newRow = row.filter((value) => value !== 0);

      for (let j = 0; j < newRow.length; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          newRow[j + 1] = 0;
          this.score += newRow[j];
        }
      }
      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }
      newRow.reverse();
      this.board[i] = newRow;
    }

    if (!this.boardsAreEqual(this.board, oldBoard)) {
      if (!this.hasWon()) {
        if (!this.canMove()) {
          return;
        }
      }

      this.addRandomTile();
    } else {
      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const newColumn = this.processLine(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    if (!this.boardsAreEqual(this.board, oldBoard)) {
      if (!this.hasWon()) {
        if (!this.canMove()) {
          return;
        }
      }

      this.addRandomTile();
    } else {
      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const newColumn = this.processLine(column.reverse());

      newColumn.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    if (!this.boardsAreEqual(this.board, oldBoard)) {
      if (!this.hasWon()) {
        if (!this.canMove()) {
          return;
        }
      }

      this.addRandomTile();
    } else {
      if (!this.canMove()) {
        this.status = 'lose';
      }
    }
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
    if (!this.board || this.board.flat().every((value) => value === 0)) {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    for (let i = 0; i < 2; i++) {
      this.addRandomTile();
    }

    this.status = 'playing';
  }

  restart() {
    this.board = initialBord
      ? JSON.parse(JSON.stringify(initialBord))
      : JSON.parse(JSON.stringify(board));
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  addRandomTile() {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (empty.length > 0) {
      const { r, c } = empty[Math.floor(Math.random() * empty.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  boardsAreEqual(board1, board2) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  processLine(line) {
    let newLine = line.filter((v) => v !== 0);

    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        newLine[i + 1] = 0;
        this.score += newLine[i];
      }
    }
    newLine = newLine.filter((v) => v !== 0);

    while (newLine.length < 4) {
      newLine.push(0);
    }

    return newLine;
  }

  hasWon() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return true;
    }

    return false;
  }

  canMove() {
    if (this.board.some((row) => row.includes(0))) {
      this.status = 'playing';

      return true;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4 - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          this.status = 'playing';

          return true;
        }

        if (this.board[j][i] === this.board[j + 1][i]) {
          this.status = 'playing';

          return true;
        }
      }
    }

    this.status = 'lose';

    return false;
  }
}

module.exports = Game;

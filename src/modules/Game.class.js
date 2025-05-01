'use strict';
class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    const board = [];

    for (let i = 0; i < 4; i++) {
      board.push([0, 0, 0, 0]);
    }

    return board;
  }

  moveLeft() {
    const oldBoard = this.board.map((row) => [...row]);
    let scoreThisMove = 0;

    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i];

      const filtered = row.filter((cell) => cell !== 0);

      const newRow = [];
      let j = 0;

      while (j < filtered.length) {
        if (filtered[j] === filtered[j + 1]) {
          const merged = filtered[j] * 2;

          newRow.push(merged);
          scoreThisMove += merged;
          j += 2;
        } else {
          newRow.push(filtered[j]);
          j += 1;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[i] = newRow;
    }

    const boardChanged = this.board.some(
      (row, i) => row.some((cell, j) => cell !== oldBoard[i][j]),
      // eslint-disable-next-line
    );

    if (boardChanged) {
      this.addRandomTile();
      this.score += scoreThisMove;
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }
  }
  moveRight() {
    const oldBoard = this.board.map((row) => [...row]);
    let scoreThisMove = 0;

    for (let i = 0; i < this.board.length; i++) {
      const row = [...this.board[i]].reverse();

      const filtered = row.filter((cell) => cell !== 0);

      const newRow = [];
      let j = 0;

      while (j < filtered.length) {
        if (filtered[j] === filtered[j + 1]) {
          const merged = filtered[j] * 2;

          newRow.push(merged);
          scoreThisMove += merged;
          j += 2;
        } else {
          newRow.push(filtered[j]);
          j += 1;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[i] = newRow.reverse();
    }

    const boardChanged = this.board.some(
      (row, i) => row.some((cell, j) => cell !== oldBoard[i][j]),
      // eslint-disable-next-line
    );

    if (boardChanged) {
      this.addRandomTile();
      this.score += scoreThisMove;
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }
  }
  moveUp() {
    const oldBoard = this.board.map((row) => [...row]);
    let scoreThisMove = 0;

    for (let j = 0; j < 4; j++) {
      const column = [];

      for (let i = 0; i < 4; i++) {
        column.push(this.board[i][j]);
      }

      const filtered = column.filter((cell) => cell !== 0);
      const newColumn = [];
      let index = 0;

      while (index < filtered.length) {
        if (filtered[index] === filtered[index + 1]) {
          const merged = filtered[index] * 2;

          newColumn.push(merged);
          scoreThisMove += merged;
          index += 2;
        } else {
          newColumn.push(filtered[index]);
          index += 1;
        }
      }

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = newColumn[i];
      }
    }

    const boardChanged = this.board.some(
      (row, i) => row.some((cell, j) => cell !== oldBoard[i][j]),
      // eslint-disable-next-line
    );

    if (boardChanged) {
      this.addRandomTile();
      this.score += scoreThisMove;
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }
  }
  moveDown() {
    const oldBoard = this.board.map((row) => [...row]);
    let scoreThisMove = 0;

    for (let j = 0; j < 4; j++) {
      const column = [];

      for (let i = 0; i < 4; i++) {
        column.push(this.board[i][j]);
      }

      const filtered = column.filter((cell) => cell !== 0);
      const newColumn = [];
      let index = filtered.length - 1;

      while (index >= 0) {
        if (filtered[index] === filtered[index - 1]) {
          const merged = filtered[index] * 2;

          newColumn.unshift(merged);
          scoreThisMove += merged;
          index -= 2;
        } else {
          newColumn.unshift(filtered[index]);
          index -= 1;
        }
      }

      while (newColumn.length < 4) {
        newColumn.unshift(0);
      }

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = newColumn[i];
      }
    }

    const boardChanged = this.board.some(
      (row, i) => row.some((cell, j) => cell !== oldBoard[i][j]),
      // eslint-disable-next-line
    );

    if (boardChanged) {
      this.addRandomTile();
      this.score += scoreThisMove;
    }

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      const value = Math.random() < 0.9 ? 2 : 4;

      this.board[row][col] = value;
    }
  }

  isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  restart() {
    this.start();
  }
}

module.exports = Game;

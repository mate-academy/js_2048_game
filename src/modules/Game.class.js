'use strict';

class Game {
  constructor(initialState) {
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = this.initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.serializeBoard();

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.slideRow(this.board[i]);
    }

    const newState = this.serializeBoard();
    const hasChange = oldState !== newState;

    if (hasChange) {
      this.addRandom();
    }
    this.checkGameStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.serializeBoard();

    for (let i = 0; i < 4; i++) {
      this.board[i].reverse();
      this.board[i] = this.slideRow(this.board[i]);
      this.board[i].reverse();
    }

    const newState = this.serializeBoard();
    const hasChange = oldState !== newState;

    if (hasChange) {
      this.addRandom();
    }
    this.checkGameStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.serializeBoard();

    for (let c = 0; c < 4; c++) {
      const column = [];

      for (let r = 0; r < 4; r++) {
        column.push(this.board[r][c]);
      }

      const movedColumn = this.slideRow(column);

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = movedColumn[r];
      }
    }

    const newState = this.serializeBoard();
    const hasChange = oldState !== newState;

    if (hasChange) {
      this.addRandom();
    }
    this.checkGameStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.serializeBoard();

    for (let c = 0; c < 4; c++) {
      const column = [];

      for (let r = 0; r < 4; r++) {
        column.push(this.board[r][c]);
      }

      column.reverse();

      const movedColumn = this.slideRow(column);

      movedColumn.reverse();

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = movedColumn[r];
      }
    }

    const newState = this.serializeBoard();
    const hasChange = oldState !== newState;

    if (hasChange) {
      this.addRandom();
    }
    this.checkGameStatus();
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
    this.addRandom();
    this.addRandom();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';
    this.board = this.initialState.map((row) => [...row]);
  }

  addRandom() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ rInx: r, cInx: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { rInx, cInx } = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[rInx][cInx] = value;
  }

  slideRow(row) {
    let numbers = row.filter((val) => val !== 0);

    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] === numbers[i + 1]) {
        numbers[i] *= 2;

        this.score += numbers[i];
        numbers[i + 1] = 0;
        i++;
      }
    }

    numbers = numbers.filter((val) => val !== 0);

    while (numbers.length < 4) {
      numbers.push(0);
    }

    return numbers;
  }

  serializeBoard() {
    return this.board.map((row) => row.toString()).join(',');
  }

  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;

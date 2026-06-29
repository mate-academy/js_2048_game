'use strict';

export default class Game {
  constructor(initialState = null) {
    this.initialBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.initialBoard.map((row) => [...row]);

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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  moveLeft() {
    this.makeMove((row) => this.moveRowLeft(row));
  }

  moveRight() {
    this.makeMove((row) => this.moveRowLeft([...row].reverse()).reverse());
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const newColumn = this.moveRowLeft(column);

      if (column.toString() !== newColumn.toString()) {
        changed = true;
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    this.afterMove(changed);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const newColumn = this.moveRowLeft([...column].reverse()).reverse();

      if (column.toString() !== newColumn.toString()) {
        changed = true;
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newColumn[row];
      }
    }

    this.afterMove(changed);
  }

  makeMove(callback) {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;

    for (let row = 0; row < 4; row++) {
      const oldRow = [...this.board[row]];
      const newRow = callback(oldRow);

      if (oldRow.toString() !== newRow.toString()) {
        changed = true;
      }

      this.board[row] = newRow;
    }

    this.afterMove(changed);
  }

  afterMove(changed) {
    if (!changed) {
      return;
    }

    this.addRandomTile();

    if (this.has2048()) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  moveRowLeft(row) {
    const newRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];

        newRow.splice(i + 1, 1);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (!emptyCells.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  getEmptyCells() {
    const cells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          cells.push({ row, col });
        }
      }
    }

    return cells;
  }

  has2048() {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  }

  canMove() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

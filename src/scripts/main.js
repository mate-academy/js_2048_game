'use strict';

class Game {
  static SIZE = 4;
  static TILE_PROBABILITY = 0.9;
  static WIN_TILE_VALUE = 2048;

  constructor(initialState = null) {
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : null;

    this.state = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: Game.SIZE }, () => Array(Game.SIZE).fill(0));
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let row = 0; row < Game.SIZE; row++) {
      for (let col = 0; col < Game.SIZE; col++) {
        if (this.state[row][col] === 0) {
          emptyTiles.push({ row, col });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { row, col } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.state[row][col] = Math.random() < Game.TILE_PROBABILITY ? 2 : 4;
    }
  }

  checkGameState() {
    if (this.state.some((row) => row.includes(Game.WIN_TILE_VALUE))) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let row = 0; row < Game.SIZE; row++) {
      for (let col = 0; col < Game.SIZE; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (
          (row < Game.SIZE - 1 &&
            this.state[row][col] === this.state[row + 1][col]) ||
          (col < Game.SIZE - 1 &&
            this.state[row][col] === this.state[row][col + 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.state);

    if (direction === 'left') {
      this.state = this.shiftLeft(this.state);
    }

    if (direction === 'right') {
      this.state = this.shiftRight(this.state);
    }

    if (direction === 'up') {
      this.state = this.shiftUp(this.state);
    }

    if (direction === 'down') {
      this.state = this.shiftDown(this.state);
    }

    if (JSON.stringify(this.state) !== previousState) {
      this.addRandomTile();
    }

    this.checkGameState();
  }

  shiftLeft(state) {
    return state.map((row) => this.compressRow(row));
  }

  shiftRight(state) {
    return state.map((row) => this.compressRow([...row].reverse()).reverse());
  }

  shiftUp(state) {
    const transposed = this.transpose(state);
    const shifted = this.shiftLeft(transposed);

    return this.transpose(shifted);
  }

  shiftDown(state) {
    const transposed = this.transpose(state);
    const shifted = this.shiftRight(transposed);

    return this.transpose(shifted);
  }

  compressRow(row) {
    const filtered = row.filter((value) => value !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    const filtered2 = filtered.filter((value) => value !== 0);

    return [...filtered2, ...Array(Game.SIZE - filtered2.length).fill(0)];
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.resetGame();
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.resetGame();
    this.status = 'idle';
  }

  resetGame() {
    this.state = this.initialState
      ? JSON.parse(JSON.stringify(this.initialState))
      : this.createEmptyBoard();
    this.score = 0;
  }
}

module.exports = Game;

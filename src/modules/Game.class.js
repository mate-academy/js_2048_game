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
      : this.initializeBoard();
  }

  initializeBoard() {
    return Array.from({ length: Game.SIZE }, () => Array(Game.SIZE).fill(0));
  }

  spawnTile() {
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

  updateStatus() {
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
        if (
          this.state[row][col] === 0 ||
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

    switch (direction) {
      case 'left':
        this.state = this.slideLeft(this.state);
        break;
      case 'right':
        this.state = this.slideRight(this.state);
        break;
      case 'up':
        this.state = this.slideUp(this.state);
        break;
      case 'down':
        this.state = this.slideDown(this.state);
        break;
    }

    if (JSON.stringify(this.state) !== previousState) {
      this.spawnTile();
    }

    this.updateStatus();
  }

  slideLeft(state) {
    return state.map((row) => this.compressRow(row));
  }

  slideRight(state) {
    return state.map((row) => this.compressRow(row.reverse()).reverse());
  }

  slideUp(state) {
    return this.transpose(this.slideLeft(this.transpose(state)));
  }

  slideDown(state) {
    return this.transpose(this.slideRight(this.transpose(state)));
  }

  compressRow(row) {
    let filtered = row.filter((value) => value !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((value) => value !== 0);

    return [...filtered, ...Array(Game.SIZE - filtered.length).fill(0)];
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
      this.resetBoard();
      this.status = 'playing';
      this.spawnTile();
      this.spawnTile();
    }
  }

  restart() {
    this.resetBoard();
    this.status = 'idle';
  }

  resetBoard() {
    this.state = this.initialState
      ? JSON.parse(JSON.stringify(this.initialState))
      : this.initializeBoard();
    this.score = 0;
  }
}

module.exports = Game;

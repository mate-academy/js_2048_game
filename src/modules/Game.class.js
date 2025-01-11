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
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;
    this.state = this.cloneState(this.initialState);
  }

  // --- Main Methods ---
  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveUp() {
    this.handleMove('up');
  }

  moveDown() {
    this.handleMove('down');
  }

  moveLeft() {
    this.handleMove('left');
  }

  moveRight() {
    this.handleMove('right');
  }

  // --- Additional Methods ---
  handleMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.slide(direction);

    if (moved) {
      this.addRandomTile();
      this.updateGameStatus();
    }
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  addRandomTile() {
    const emptyTiles = this.findEmptyTiles();

    if (emptyTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);
      const [row, column] = emptyTiles[randomIndex];

      this.state[row][column] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  findEmptyTiles() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyTiles.push([row, col]);
        }
      }
    }

    return emptyTiles;
  }

  slide(direction) {
    const originalState = this.cloneState(this.state);

    switch (direction) {
      case 'left':
        this.state = this.slideLeft(this.state);
        break;
      case 'right':
        this.state = this.slideRight(this.state);
        break;
      case 'up':
        this.state = this.transpose(this.slideLeft(this.transpose(this.state)));
        break;
      case 'down':
        this.state = this.transpose(
          this.slideRight(this.transpose(this.state)),
        );
        break;
    }

    return !this.areStatesEqual(this.state, originalState);
  }

  slideLeft(state) {
    return state.map((row) => this.processRow(row, true));
  }

  slideRight(state) {
    return state.map((row) => this.processRow(row, false));
  }

  processRow(row, isLeft) {
    const rowCopy = isLeft ? row : [...row].reverse();
    const newRow = this.mergeTiles(rowCopy.filter((n) => n !== 0));

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return isLeft ? newRow : newRow.reverse();
  }

  mergeTiles(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return row.filter((n) => n !== 0);
  }

  areStatesEqual(state1, state2) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (state1[row][col] !== state2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  transpose(state) {
    const transposed = [];

    for (let col = 0; col < 4; col++) {
      transposed[col] = [];

      for (let row = 0; row < 4; row++) {
        transposed[col].push(state[row][col]);
      }
    }

    return transposed;
  }

  // --- Game Status Updates ---
  updateGameStatus() {
    if (this.hasReached2048()) {
      this.status = 'win';

      return;
    }

    if (!this.hasEmptyCells() && !this.canMergeTiles()) {
      this.status = 'lose';
    }
  }

  hasReached2048() {
    return this.state.some((row) => row.includes(2048));
  }

  hasEmptyCells() {
    return this.state.some((row) => row.includes(0));
  }

  canMergeTiles() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const tile = this.state[row][col];

        if (
          (col < 3 && tile === this.state[row][col + 1]) ||
          (row < 3 && tile === this.state[row + 1][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

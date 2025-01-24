'use strict';

// --- Constants ---
const BOARD_SIZE = 4;
const WINNING_TILE = 2048;
const TILE_PROBABILITY = 0.9;

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

  // --- Public Methods ---
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

  // --- Core Logic ---
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
    const filteredRow = isLeft ? row : [...row].reverse();
    const mergedRow = this.mergeTiles(filteredRow.filter((n) => n !== 0));

    while (mergedRow.length < BOARD_SIZE) {
      mergedRow.push(0);
    }

    return isLeft ? mergedRow : mergedRow.reverse();
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

  addRandomTile() {
    const emptyTiles = this.findEmptyTiles();

    if (emptyTiles.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const [row, column] = emptyTiles[randomIndex];

    this.state[row][column] = Math.random() < TILE_PROBABILITY ? 2 : 4;
  }

  findEmptyTiles() {
    const emptyTiles = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.state[row][col] === 0) {
          emptyTiles.push([row, col]);
        }
      }
    }

    return emptyTiles;
  }

  // --- Game Status Updates ---
  updateGameStatus() {
    if (this.hasWinningTile()) {
      this.status = 'win';
    } else if (!this.hasEmptyCells() && !this.canMergeTiles()) {
      this.status = 'lose';
    }
  }

  hasWinningTile() {
    return this.state.some((row) => row.includes(WINNING_TILE));
  }

  hasEmptyCells() {
    return this.state.some((row) => row.includes(0));
  }

  canMergeTiles() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const tile = this.state[row][col];

        if (
          // eslint-disable-next-line max-len
          (col < BOARD_SIZE - 1 && tile === this.state[row][col + 1]) || // Right
          (row < BOARD_SIZE - 1 && tile === this.state[row + 1][col]) || // Down
          tile === 0 // Empty space
        ) {
          return true;
        }
      }
    }

    return false;
  }

  canMergeWithNeighbor(row, col, tile) {
    if (tile === 0) {
      return false;
    }

    return (
      (col < BOARD_SIZE - 1 && tile === this.state[row][col + 1]) || // Right
      (row < BOARD_SIZE - 1 && tile === this.state[row + 1][col]) // Down
    );
  }

  // --- Utility Methods ---
  cloneState(state) {
    return state.map((row) => [...row]);
  }

  areStatesEqual(state1, state2) {
    return state1.every((row, rowIndex) => {
      return row.every((tile, colIndex) => tile === state2[rowIndex][colIndex]);
    });
  }

  transpose(state) {
    return state[0].map((_, colIndex) => state.map((row) => row[colIndex]));
  }
}

module.exports = Game;

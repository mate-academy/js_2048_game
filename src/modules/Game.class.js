'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
  ) {
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;
    this.state = this.cloneState(this.initialState);
  }

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
    this.start();
  }

  moveLeft() {
    this.handleMove('left');
  }

  moveRight() {
    this.handleMove('right');
  }

  moveUp() {
    this.handleMove('up');
  }

  moveDown() {
    this.handleMove('down');
  }

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
    return state.map(row => [...row]);
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyTiles.push([row, col]);
        }
      }
    }

    if (emptyTiles.length > 0) {
      const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
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
        this.state = this.transpose(this.slideRight(this.transpose(this.state)));
        break;
    }

    return !this.areStatesEqual(this.state, originalState);
  }

  slideLeft(state) {
    return state.map(row => this.processRow(row, true));
  }

  slideRight(state) {
    return state.map(row => this.processRow(row, false));
  }

  processRow(row, isLeft) {
    const processedRow = [...row];
    const merged = new Array(4).fill(false);

    if (!isLeft) {
      processedRow.reverse();
    }

    // Move all numbers to the left
    for (let i = 0; i < 4; i++) {
      if (processedRow[i] !== 0) {
        let pos = i;
        while (pos > 0 && processedRow[pos - 1] === 0) {
          processedRow[pos - 1] = processedRow[pos];
          processedRow[pos] = 0;
          pos--;
        }
        if (pos > 0 && processedRow[pos - 1] === processedRow[pos] && !merged[pos - 1]) {
          processedRow[pos - 1] *= 2;
          this.score += processedRow[pos - 1];
          processedRow[pos] = 0;
          merged[pos - 1] = true;
        }
      }
    }

    if (!isLeft) {
      processedRow.reverse();
    }

    return processedRow;
  }

  areStatesEqual(state1, state2) {
    return JSON.stringify(state1) === JSON.stringify(state2);
  }

  transpose(state) {
    return state[0].map((_, i) => state.map(row => row[i]));
  }

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
    return this.state.some(row => row.includes(2048));
  }

  hasEmptyCells() {
    return this.state.some(row => row.includes(0));
  }

  canMergeTiles() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const currentTile = this.state[row][col];

        // Check right
        if (col < 3 && currentTile === this.state[row][col + 1]) {
          return true;
        }
        // Check down
        if (row < 3 && currentTile === this.state[row + 1][col]) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = Game;

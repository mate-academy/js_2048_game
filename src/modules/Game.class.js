'use strict';

class Game {
  constructor(initialState = Game.defaultState()) {
    this.score = 0;
    this.status = 'idle';
    this.initialState = this.cloneState(initialState);
    this.state = this.cloneState(initialState);
    this.size = initialState.length;
  }

  static defaultState() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
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
  }

  addRandomTile() {
    const emptyTiles = this.getEmptyTiles();

    if (emptyTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);
      const [row, col] = emptyTiles[randomIndex];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const moveMade = this.performMove(direction);

    if (moveMade) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  moveRight() {
    this.move('right');
  }
  moveLeft() {
    this.move('left');
  }
  moveUp() {
    this.move('up');
  }
  moveDown() {
    this.move('down');
  }

  hasEmptyCells() {
    return this.getEmptyTiles().length > 0;
  }

  canCombine() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const currentValue = this.state[row][col];

        if (col < this.size - 1 && currentValue === this.state[row][col + 1]) {
          return true;
        }

        if (row < this.size - 1 && currentValue === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameState() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (!this.hasEmptyCells() && !this.canCombine()) {
      this.status = 'lose';
    }
  }

  performMove(direction) {
    const previousState = this.cloneState(this.state);
    const newState = [];

    const isVertical = direction === 'up' || direction === 'down';
    const isReverse = direction === 'right' || direction === 'down';

    const rows = isVertical ? this.transposeState(this.state) : this.state;

    for (const row of rows) {
      const line = isReverse ? [...row].reverse() : row;
      const combined = this.combineRow(line);
      const padded = this.padRow(combined);
      const final = isReverse ? padded.reverse() : padded;

      newState.push(final);
    }

    this.state = isVertical ? this.transposeState(newState) : newState;

    return !this.areStatesEqual(previousState, this.state);
  }

  combineRow(row) {
    const combinedRow = [];
    const numbers = row.filter((n) => n !== 0);

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const merged = numbers[i] * 2;

        combinedRow.push(merged);
        this.score += merged;
        i++;
      } else {
        combinedRow.push(numbers[i]);
      }
    }

    return combinedRow;
  }

  padRow(row) {
    return [...row, ...Array(this.size - row.length).fill(0)];
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  areStatesEqual(state1, state2) {
    for (let row = 0; row < state1.length; row++) {
      for (let col = 0; col < state1[row].length; col++) {
        if (state1[row][col] !== state2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  transposeState(state) {
    return state[0].map((_, colIndex) => state.map((row) => row[colIndex]));
  }

  getEmptyTiles() {
    const emptyTiles = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 0) {
          emptyTiles.push([row, col]);
        }
      }
    }

    return emptyTiles;
  }
}

module.exports = Game;

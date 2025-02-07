'use strict';

class Game {
  constructor(initialState = Game.defaultState()) {
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;
    this.state = this._copyState(initialState);
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
    this.state = this._copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyTiles = this._getEmptyTiles();

    if (emptyTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);
      const [row, col] = emptyTiles[randomIndex];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveRight() {
    this._performMove('right');
  }

  moveLeft() {
    this._performMove('left');
  }

  moveDown() {
    this._performMove('down');
  }

  moveUp() {
    this._performMove('up');
  }

  hasEmptyCells() {
    return this._getEmptyTiles().length > 0;
  }

  canCombine() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.state[row][col];

        if (col < this.size - 1 && current === this.state[row][col + 1]) {
          return true;
        }

        if (row < this.size - 1 && current === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameState() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.hasEmptyCells() && !this.canCombine()) {
      this.status = 'lose';
    }
  }

  _performMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this._move(direction);

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  _move(direction) {
    const originalState = this._copyState(this.state);

    const moveRowLeft = (row) => {
      const combined = this._combineRow(row);

      return this._padRow(combined);
    };

    const moveRowRight = (row) => {
      const reversedRow = [...row].reverse();
      const combined = this._combineRow(reversedRow);

      return this._padRow(combined).reverse();
    };

    const moveStateLeft = (state) => state.map((row) => moveRowLeft(row));
    const moveStateRight = (state) => state.map((row) => moveRowRight(row));

    switch (direction) {
      case 'left':
        this.state = moveStateLeft(this.state);
        break;

      case 'right':
        this.state = moveStateRight(this.state);
        break;

      case 'up':
        this.state = this._transposeState(
          moveStateLeft(this._transposeState(this.state)),
        );
        break;

      case 'down':
        this.state = this._transposeState(
          moveStateRight(this._transposeState(this.state)),
        );
        break;

      default:
        break;
    }

    return !this._areStatesEqual(this.state, originalState);
  }

  _combineRow(row) {
    const filteredRow = row.filter((n) => n !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        this.score += filteredRow[i];
        i++;
      }
    }

    return filteredRow.filter((n) => n !== 0);
  }

  _padRow(row) {
    return [...row, ...Array(this.size - row.length).fill(0)];
  }

  _copyState(state) {
    return state.map((row) => [...row]);
  }

  _areStatesEqual(state1, state2) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (state1[i][j] !== state2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  _transposeState(state) {
    const transposed = [];

    for (let col = 0; col < this.size; col++) {
      transposed[col] = [];

      for (let row = 0; row < this.size; row++) {
        transposed[col].push(state[row][col]);
      }
    }

    return transposed;
  }

  _getEmptyTiles() {
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

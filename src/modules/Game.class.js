'use strict';

class Game {
  constructor(initialState = null) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.state = this.initialState.map(row => [...row]);
    this.score = 0;
    this.status = Game.STATUS.idle;
  }

  static get STATUS() {
    return {
      idle: 'idle',
      playing: 'playing',
      win: 'win',
      lose: 'lose',
    };
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
    this.status = Game.STATUS.playing;
    this.resetState();
    this.addCells(2);
  }

  restart() {
    this.resetState();
    this.status = Game.STATUS.idle;
  }

  resetState() {
    this.state = this.initialState.map(row => [...row]);
    this.score = 0;
  }

  addCells(count = 1) {
    for (let i = 0; i < count; i++) {
      this.addNewTile();
    }

    if (this.isVictory()) {
      this.status = Game.STATUS.win;
    } else if (!this.validState()) {
      this.status = Game.STATUS.lose;
    }
  }

  addNewTile() {
    const emptyCells = this.getEmptyCells();

    if (!emptyCells.length) {
      return;
    }

    const randomCell = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomCell];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  getEmptyCells() {
    return this.state
      .flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (cell === 0
          ? [rowIndex, colIndex]
          : null
        )),
      )
      .filter(cell => cell !== null);
  }

  isVictory() {
    return this.state.flat().some(tile => tile === 2048);
  }

  validState() {
    const size = this.state.length;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const current = this.state[row][col];

        if (
          current === 0
          || (col < size - 1 && current === this.state[row][col + 1])
          || (row < size - 1 && current === this.state[row + 1][col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const updatedState = this.state.map(row => this.applyMove(row));

    if (!this.isStateEqual(this.state, updatedState)) {
      this.state = updatedState;
      this.addCells();
    }
  }

  moveRight() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const reversedState = this.state.map(row => [...row].reverse());
    const updatedState = reversedState.map(row =>
      this.applyMove(row).reverse(),
    );

    if (!this.isStateEqual(this.state, updatedState)) {
      this.state = updatedState;
      this.addCells();
    }
  }

  moveUp() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const rotatedState = this.rotateRight(this.state);
    const updatedState = rotatedState.map(row => this.applyMove(row));
    const unrotatedState = this.rotateLeft(updatedState);

    if (!this.isStateEqual(this.state, unrotatedState)) {
      this.state = unrotatedState;
      this.addCells();
    }
  }

  moveDown() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const rotatedState = this.rotateLeft(this.state);
    const updatedState = rotatedState.map(row => this.applyMove(row));
    const unrotatedState = this.rotateRight(updatedState);

    if (!this.isStateEqual(this.state, unrotatedState)) {
      this.state = unrotatedState;
      this.addCells();
    }
  }

  applyMove(row) {
    const nonEmptyTiles = row.filter(tile => tile !== 0);
    const newRow = [];
    let skipNext = false;

    for (let i = 0; i < nonEmptyTiles.length; i++) {
      if (skipNext) {
        skipNext = false;
        continue;
      }

      const current = nonEmptyTiles[i];
      const next = nonEmptyTiles[i + 1];

      if (current === next) {
        newRow.push(current * 2);
        this.score += current * 2;
        skipNext = true;
      } else {
        newRow.push(current);
      }
    }

    while (newRow.length < row.length) {
      newRow.push(0);
    }

    return newRow;
  }

  rotateRight(matrix) {
    const resultMatrix = [];
    const cols = matrix[0].length;
    const rows = matrix.length;

    for (let col = 0; col < cols; col++) {
      resultMatrix.push(Array.from({ length: rows }, () => 0));
    }

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        const newRow = cols - 1 - colIndex;
        const newCol = rowIndex;

        resultMatrix[newRow][newCol] = matrix[rowIndex][colIndex];
      }
    }

    return resultMatrix;
  }

  rotateLeft(matrix) {
    const resultMatrix = [];
    const cols = matrix[0].length;
    const rows = matrix.length;

    for (let col = 0; col < cols; col++) {
      resultMatrix.push(Array.from({ length: rows }, () => 0));
    }

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        const newRow = rowIndex;
        const newCol = cols - 1 - colIndex;

        resultMatrix[newRow][newCol] = matrix[colIndex][rowIndex];
      }
    }

    return resultMatrix;
  }

  isStateEqual(state1, state2) {
    return JSON.stringify(state1) === JSON.stringify(state2);
  }
}

module.exports = Game;

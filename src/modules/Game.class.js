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
    this.initialState = initialState.map((row) => [...row]);
    Object.freeze(this.initialState);
    this.gameBoard = this.initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  start() {
    this.status = 'playing';
    this.generateTile(2);
  }

  restart() {
    this.gameBoard = this.initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  getStatus() {
    return this.status;
  }

  getScore() {
    return this.score;
  }
  getState() {
    return this.gameBoard;
  }

  isGameBoardFull() {
    return this.gameBoard.flat().every((n) => n !== 0);
  }

  generateTile(times = 1) {
    if (this.isGameBoardFull()) {
      return;
    }

    // console.log('done');

    for (let n = 0; n < times; n++) {
      let newTilePosition;

      do {
        newTilePosition = [
          Math.floor(Math.random() * 4),
          Math.floor(Math.random() * 4),
        ];
      } while (this.gameBoard[newTilePosition[0]][newTilePosition[1]] !== 0);

      const addedNumber = Math.random() < 0.9 ? 2 : 4;

      this.gameBoard[newTilePosition[0]][newTilePosition[1]] = addedNumber;
    }
  }

  checkForWin() {
    for (const row of this.gameBoard) {
      for (const n of row) {
        if (n === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  checkForLose() {
    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    switch (direction) {
      case 'left':
        this.moveLeft();
        break;
      case 'right':
        this.moveRight();
        break;
      case 'up':
        this.moveUp();
        break;
      case 'down':
        this.moveDown();
        break;
    }

    this.checkForWin();
    this.checkForLose();
  }

  transposeState(state) {
    const result = [];

    for (let col = 0; col < 4; col++) {
      result[col] = [];

      for (let row = 0; row < 4; row++) {
        result[col][row] = state[row][col];
      }
    }

    return result;
  }

  moveLeft(withGeneration = true) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < this.gameBoard.length; row++) {
      const newRow = this.shiftAndMerge(this.gameBoard[row]);

      if (newRow.join('') !== this.gameBoard[row].join('')) {
        moved = true;
      }
      this.gameBoard[row] = newRow;
    }

    if (withGeneration && moved) {
      this.generateTile();
    }

    return moved;
  }
  moveRight(withGeneration = true) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < this.gameBoard.length; row++) {
      const reversedRow = this.gameBoard[row].slice().reverse();
      const newRow = this.shiftAndMerge(reversedRow).reverse();

      if (newRow.join('') !== this.gameBoard[row].join('')) {
        moved = true;
      }
      this.gameBoard[row] = newRow;
    }

    if (withGeneration && moved) {
      this.generateTile();
    }

    return moved;
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.gameBoard = this.transposeState(this.gameBoard);

    const moved = this.moveLeft(false);

    this.gameBoard = this.transposeState(this.gameBoard);

    if (moved) {
      this.generateTile();
    }

    return moved;
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.gameBoard = this.transposeState(this.gameBoard);

    const moved = this.moveRight(false);

    this.gameBoard = this.transposeState(this.gameBoard);

    if (moved) {
      this.generateTile();
    }

    return moved;
  }

  shiftAndMerge(row) {
    const shifted = row.filter((val) => val !== 0);

    for (let i = 0; i < shifted.length - 1; i++) {
      if (shifted[i] === shifted[i + 1]) {
        shifted[i] *= 2;
        this.score += shifted[i];
        shifted.splice(i + 1, 1);
      }
    }

    while (shifted.length < 4) {
      shifted.push(0);
    }

    return shifted;
  }

  canMove() {
    for (let row = 0; row < this.gameBoard.length; row++) {
      for (let col = 0; col < this.gameBoard[row].length; col++) {
        if (this.gameBoard[row][col] === 0) {
          return true;
        }

        if (
          col < 3 &&
          this.gameBoard[row][col] === this.gameBoard[row][col + 1]
        ) {
          return true;
        }

        if (
          row < 3 &&
          this.gameBoard[row][col] === this.gameBoard[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

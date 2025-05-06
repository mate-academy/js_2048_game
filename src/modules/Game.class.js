/* eslint-disable indent */
'use strict';

export class Game {
  static possibleStatus = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.status = Game.possibleStatus.IDLE;
    this.score = 0;
    this.dimensions = 4;
  }

  moveLeft() {
    return this.moveInDirection('left');
  }

  moveRight() {
    return this.moveInDirection('right');
  }

  moveUp() {
    return this.moveInDirection('up');
  }

  moveDown() {
    return this.moveInDirection('down');
  }

  moveInDirection(direction) {
    if (this.status !== Game.possibleStatus.PLAYING) {
      return false;
    }

    const isVerticalMove = direction === 'up' || direction === 'down';
    const swapDirection =
      direction === 'up' || direction === 'left' ? 'left' : 'right';
    let board = this.state.map((row) => [...row]);

    if (isVerticalMove) {
      board = this.transposeMatrix(board);
    }

    const didSwap = this.adjustRowPosition(swapDirection, board);
    const didMerge = this.mergeAdjacentTiles(swapDirection, board);

    if (didMerge) {
      this.adjustRowPosition(swapDirection, board);
    }

    if (didSwap || didMerge) {
      this.state = isVerticalMove ? this.transposeMatrix(board) : board;
      this.addRandomTile();
      this.updateGameStatus();

      return true;
    }

    return false;
  }

  adjustRowPosition(direction = 'left', board = this.state) {
    let hasChanged = false;

    board.forEach((row) => {
      const filteredRow = row.filter((num) => num);
      const missing = this.dimensions - filteredRow.length;
      const zeros = Array(missing).fill(0);

      const newRow =
        direction === 'left'
          ? filteredRow.concat(zeros)
          : zeros.concat(filteredRow);

      if (!this.isEqualArrays(row, newRow)) {
        hasChanged = true;
        row.splice(0, this.dimensions, ...newRow);
      }
    });

    return hasChanged;
  }
  mergeAdjacentTiles(direction = 'left', board = this.state) {
    let hasChanged = false;

    board.forEach((row) => {
      const isLeft = direction === 'left';
      const step = isLeft ? 1 : -1;
      const start = isLeft ? 0 : this.dimensions - 1;
      const end = isLeft ? this.dimensions - 1 : 0;

      for (let i = start; isLeft ? i < end : i > end; i += step) {
        const nextIndex = i + step;

        if (row[i] !== 0 && row[i] === row[nextIndex]) {
          if (row[i] === 1024) {
            this.status = Game.possibleStatus.WIN;
          }

          row[i] *= 2;
          row[nextIndex] = 0;
          this.score += row[i];
          hasChanged = true;

          i += step; // Skip next index to avoid double merge
        }
      }
    });

    return hasChanged;
  }
  transposeMatrix(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  addRandomTile() {
    const availableCells = [];

    for (let i = 0; i < this.dimensions; i++) {
      for (let j = 0; j < this.dimensions; j++) {
        if (this.state[i][j] === 0) {
          availableCells.push([i, j]);
        }
      }
    }

    if (availableCells.length === 0) {
      return false;
    }

    const [row, col] =
      availableCells[Math.floor(Math.random() * availableCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  updateGameStatus() {
    const hasEmptyCell = this.state.some((row) => row.includes(0));
    const hasMergeableCells = this.state.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        const rightNeighbor =
          colIndex < this.dimensions - 1 && cell === row[colIndex + 1];
        const downNeighbor =
          rowIndex < this.dimensions - 1 &&
          cell === this.state[rowIndex + 1][colIndex];

        return rightNeighbor || downNeighbor;
      });
    });

    if (!hasEmptyCell && !hasMergeableCells) {
      this.status = Game.possibleStatus.LOSE;
    }
  }

  isEqualArrays(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((value, index) => value === arr2[index]);
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
    this.status = Game.possibleStatus.PLAYING;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.status = Game.possibleStatus.IDLE;
    this.score = 0;
  }
}

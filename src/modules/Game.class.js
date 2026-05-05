'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState || this.getEmptyBoard();
    this.state = this.copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move((row) => this.mergeRow(row));
  }

  moveRight() {
    this.move((row) => this.mergeRow([...row].reverse()).reverse());
  }

  moveUp() {
    this.moveColumn((col) => this.mergeRow(col));
  }

  moveDown() {
    this.moveColumn((col) => this.mergeRow([...col].reverse()).reverse());
  }

  getEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  copyBoard(board) {
    return board.map((row) => [...row]);
  }

  getState() {
    return this.copyBoard(this.state);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  move(mergeCallback) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.copyBoard(this.state);

    this.state = this.state.map((row) => mergeCallback(row));

    if (!this.hasBoardChanged(oldState, this.state)) {
      return;
    }

    this.addRandomTile();
    this.updateStatus();
  }

  moveColumn(mergeCallback) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.copyBoard(this.state);

    for (let col = 0; col < 4; col++) {
      const column = this.state.map((row) => row[col]);
      const mergedColumn = mergeCallback(column);

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = mergedColumn[row];
      }
    }

    if (!this.hasBoardChanged(oldState, this.state)) {
      return;
    }

    this.addRandomTile();
    this.updateStatus();
  }

  mergeRow(row) {
    const numbers = row.filter((value) => value !== 0);
    const result = [];

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const mergedValue = numbers[i] * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        i++;
      } else {
        result.push(numbers[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((stateRow, rowIndex) => {
      stateRow.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomCol] = emptyCells[randomIndex];

    this.state[randomRow][randomCol] = Math.random() < 0.1 ? 4 : 2;
  }

  hasBoardChanged(oldBoard, newBoard) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldBoard[row][col] !== newBoard[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.state[row][col];

        if (cell === 0) {
          return true;
        }

        if (this.state[row][col + 1] === cell) {
          return true;
        }

        if (this.state[row + 1]?.[col] === cell) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

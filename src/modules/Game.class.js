'use strict';

class Game {
  constructor() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = this.initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }
  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const updatedState = this.state.map((row) => this.move(row));

    if (JSON.stringify(this.getState()) !== JSON.stringify(updatedState)) {
      this.updateGameState(updatedState);
      this.addCells();
    }
  }

  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const reverseState = this.state.map((row) => [...row].reverse());

    const updatedState = reverseState.map((row) => {
      return this.move(row).reverse();
    });

    if (JSON.stringify(this.getState()) !== JSON.stringify(updatedState)) {
      this.updateGameState(updatedState);
      this.addCells();
    }
  }

  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const rotateState = this.rotateMatrixCounterClockwise(this.getState());

    const updatedState = rotateState.map((row) => this.move(row));

    const unRotateState = this.rotateMatrixClockwise(updatedState);

    if (JSON.stringify(this.getState()) !== JSON.stringify(unRotateState)) {
      this.updateGameState(unRotateState);
      this.addCells();
    }
  }

  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const rotateState = this.rotateMatrixClockwise(this.getState());

    const updatedState = rotateState.map((row) => this.move(row));

    const unRotateState = this.rotateMatrixCounterClockwise(updatedState);

    if (JSON.stringify(this.getState()) !== JSON.stringify(unRotateState)) {
      this.updateGameState(unRotateState);
      this.addCells();
    }
  }

  move(row) {
    const newRow = [];
    let i = 0;

    while (i < row.length) {
      const current = row[i];

      if (current) {
        let left = false;

        for (let j = i + 1; j < row.length; j++) {
          const next = row[j];

          if (next === current) {
            newRow.push(current * 2);
            this.updateGameScore(current * 2);
            left = true;
            i = j + 1;
            break;
          } else if (next) {
            newRow.push(current);
            left = true;
            i = j;
            break;
          }
        }

        if (!left) {
          newRow.push(current);
          i++;
        }
      } else {
        i++;
      }
    }

    while (newRow.length < row.length) {
      newRow.push(0);
    }

    return newRow;
  }
  rotateMatrixClockwise(matrix) {
    const n = matrix.length;
    const rotatedMatrix = [];

    for (let i = 0; i < n; i++) {
      rotatedMatrix.push([]);

      for (let j = 0; j < n; j++) {
        rotatedMatrix[i].unshift(matrix[j][i]);
      }
    }

    return rotatedMatrix;
  }

  rotateMatrixCounterClockwise(matrix) {
    const n = matrix.length;
    const rotatedMatrix = [];

    for (let i = 0; i < n; i++) {
      rotatedMatrix.push([]);
    }

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        rotatedMatrix[n - j - 1].push(matrix[i][j]);
      }
    }

    return rotatedMatrix;
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
    this.status = 'playing';
    this.addCells(2);
  }

  restart() {
    this.status = 'idle';
    this.resetState();
  }

  getEmptyCells() {
    return this.state
      .flatMap((row, rowIndex) => {
        return row.map((cell, colIndex) => {
          return cell === 0 ? [rowIndex, colIndex] : null;
        });
      })
      .filter((cell) => cell !== null);
  }

  createNewTile() {
    const emptyCells = this.getEmptyCells();

    if (!emptyCells.length) {
      return;
    }

    const [row, col] =
      emptyCells[Math.trunc(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  addCells(count = 1) {
    for (let i = 0; i < count; i++) {
      this.createNewTile();
    }

    const state = this.getState();

    if (this.isWin(state)) {
      this.status = 'win';
    } else if (!this.isStateValid(state)) {
      this.status = 'lose';
    }
  }

  resetState() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  isStateValid(currentState) {
    if (this.status !== 'playing') {
      return false;
    }

    for (let row = 0; row < currentState.length; row++) {
      for (let col = 0; col < currentState[row].length; col++) {
        if (
          col < currentState[row].length - 1 &&
          currentState[row][col] === currentState[row][col + 1]
        ) {
          return true;
        }

        if (
          row < currentState.length - 1 &&
          currentState[row][col] === currentState[row + 1][col]
        ) {
          return true;
        }

        if (!currentState[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  updateGameState(state) {
    this.state = state;
  }

  updateGameScore(addScore) {
    this.score += addScore;
  }

  isWin(state) {
    return state.flat().some((tile) => tile === 2048);
  }
}

module.exports = Game;

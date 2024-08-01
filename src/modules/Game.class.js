'use strict';

class Game {
  static Status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
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
    this.state = this.initialState.map((row) => [...row]);
    this.status = Game.Status.idle;
    this.score = 0;
  }

  moveLeft() {
    if (this.getStatus() !== Game.Status.playing) {
      return;
    }

    const newState = this.state.map((row) => this.move(row));

    if (JSON.stringify(this.getState()) !== JSON.stringify(newState)) {
      this.updateGameState(newState);
      this.addCells();
    }
  }

  moveRight() {
    if (this.getStatus() !== Game.Status.playing) {
      return;
    }

    const reversedState = this.state.map((row) => [...row].reverse());

    const newState = reversedState.map((row) => {
      return this.move(row).reverse();
    });

    if (JSON.stringify(this.getState()) !== JSON.stringify(newState)) {
      this.updateGameState(newState);
      this.addCells();
    }
  }

  moveUp() {
    if (this.getStatus() !== Game.Status.playing) {
      return;
    }

    const rotateState = this.rotateMatrixCounteClockwise(this.getState());

    const newState = rotateState.map((row) => this.move(row));

    const unRotateState = this.rotateMatrixClockwise(newState);

    if (JSON.stringify(this.getState()) !== JSON.stringify(unRotateState)) {
      this.updateGameState(unRotateState);
      this.addCells();
    }
  }

  moveDown() {
    if (this.getStatus() !== Game.Status.playing) {
      return;
    }

    const rotateState = this.rotateMatrixClockwise(this.getState());

    const newState = rotateState.map((row) => this.move(row));

    const unRotateState = this.rotateMatrixCounteClockwise(newState);

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
        let merged = false;

        for (let j = i + 1; j < row.length; j++) {
          const next = row[j];

          if (next === current) {
            newRow.push(current * 2);
            this.updateGameScore(current * 2);
            merged = true;
            i = j + 1;
            break;
          } else if (next) {
            newRow.push(current);
            merged = true;
            i = j;
            break;
          }
        }

        if (!merged) {
          newRow.push(current);
          i++;
        }
      } else {
        i++;
      }
    }

    return [...newRow, ...Array(row.length - newRow.length).fill(0)];
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

  rotateMatrixCounteClockwise(matrix) {
    const n = matrix.length;
    const rotatedMatrix = [];

    for (let i = 0; i < n; i++) {
      rotatedMatrix.unshift([]);

      for (let j = 0; j < n; j++) {
        rotatedMatrix[0].push(matrix[j][i]);
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
    this.status = Game.Status.playing;
    this.addCells(2);
  }

  restart() {
    this.status = Game.Status.idle;
    this.resetState();
  }

  getEmptyCells() {
    return this.state.reduce((acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          acc.push([rowIndex, colIndex]);
        }
      });

      return acc;
    }, []);
  }

  createNewTile() {
    const emptyCells = this.getEmptyCells();

    if (!emptyCells.length) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  addCells(count = 1) {
    for (let i = 0; i < count; i++) {
      this.createNewTile();
    }

    this.updateGameStatus();
  }

  updateGameStatus() {
    const state = this.getState();

    if (this.isVictory(state)) {
      this.status = Game.Status.win;
    } else if (!this.isStateValid(state)) {
      this.status = Game.Status.lose;
    }
  }

  resetState() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  isStateValid(currentState) {
    if (this.status !== Game.Status.playing) {
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

  updateGameScore(scoreToAdd) {
    this.score += scoreToAdd;
  }

  isVictory(state) {
    return state.flat().some((tile) => tile === 2048);
  }
}

module.exports = Game;

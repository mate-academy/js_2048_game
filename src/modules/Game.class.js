'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static gameStatuses = {
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
    this.status = Game.gameStatuses.idle;
    this.score = 0;
  }

  moveLeft() {
    if (this.getStatus() !== Game.gameStatuses.playing) {
      return;
    }

    const updatedState = this.state.map((row) => this.move(row));

    if (JSON.stringify(this.getState()) !== JSON.stringify(updatedState)) {
      this.updateGameState(updatedState);
      this.addCells();
    }
  }
  moveRight() {
    if (this.getStatus() !== Game.gameStatuses.playing) {
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
    if (this.getStatus() !== Game.gameStatuses.playing) {
      return;
    }

    const rotateState = this.rotateMatrixCounteClockwise(this.getState());

    const updatedState = rotateState.map((row) => this.move(row));

    const unRotateSteate = this.rotateMatrixClockwise(updatedState);

    if (JSON.stringify(this.getState()) !== JSON.stringify(unRotateSteate)) {
      this.updateGameState(unRotateSteate);
      this.addCells();
    }
  }
  moveDown() {
    if (this.getStatus() !== Game.gameStatuses.playing) {
      return;
    }

    const rotateState = this.rotateMatrixClockwise(this.getState());

    const updatedState = rotateState.map((row) => this.move(row));

    const unRotateSteate = this.rotateMatrixCounteClockwise(updatedState);

    if (JSON.stringify(this.getState()) !== JSON.stringify(unRotateSteate)) {
      this.updateGameState(unRotateSteate);
      this.addCells();
    }
  }

  move(row) {
    const newRow = [];
    let i = 0;

    while (i < row.length) {
      const current = row[i];

      if (current) {
        let pushed = false;

        for (let j = i + 1; j < row.length; j++) {
          const next = row[j];

          if (next === current) {
            newRow.push(current * 2);
            this.updateGameScore(current * 2);
            pushed = true;
            i = j + 1;
            break;
          } else if (next) {
            newRow.push(current);
            pushed = true;
            i = j;
            break;
          }
        }

        if (!pushed) {
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
    this.status = Game.gameStatuses.playing;
    this.addCells(2);
  }

  restart() {
    this.status = Game.gameStatuses.idle;
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

    if (this.isVictory(state)) {
      this.status = Game.gameStatuses.win;
    } else if (!this.isStateValid(state)) {
      this.status = Game.gameStatuses.lose;
    }
  }

  resetState() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  isStateValid(currentState) {
    if (this.status !== Game.gameStatuses.playing) {
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

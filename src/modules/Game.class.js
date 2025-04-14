/* eslint-disable prettier/prettier */
'use strict';

class Game {
  static gameStatuses = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(initialState = this.generateDefaultState()) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.status = Game.gameStatuses.IDLE;
    this.score = 0;
  }

  generateDefaultState() {
    return Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));
  }

  moveLeft() {
    if (!this.isStateValid(this.state)) {
      return;
    }

    const updatedState = this.state.map((row) => this.applyMove(row));

    this.updateGameState(updatedState);
    this.completeMoveTasks();
  }

  moveRight() {
    const reversedState = this.state.map((row) => [...row].reverse());

    if (!this.isStateValid(reversedState)) {
      return;
    }

    const updatedState = reversedState.map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.applyMove(row).reverse());

    if (!this.isStateDifferent(this.state, updatedState)) {
      return;
    }

    this.updateGameState(updatedState);
    this.completeMoveTasks();
  }

  moveUp() {
    const rotatedRightState = this.rotateRight(this.state);

    if (!this.isStateValid(rotatedRightState)) {
      return;
    }

    const updatedState = rotatedRightState.map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.applyMove([...row]));
    const rotatedLeftState = this.rotateLeft(updatedState);

    this.updateGameState(rotatedLeftState);
    this.completeMoveTasks();
  }

  moveDown() {
    const rotatedRightState = this.rotateRight(this.state);
    const reversedState = rotatedRightState.map((row) => [...row].reverse());

    if (!this.isStateValid(reversedState)) {
      return;
    }

    const updatedState = reversedState.map((row) =>
      // eslint-disable-next-line prettier/prettier
      this.applyMove(row).reverse());
    const rotatedLeftState = this.rotateLeft(updatedState);

    this.updateGameState(rotatedLeftState);
    this.completeMoveTasks();
  }

  isStateDifferent(stateA, stateB) {
    return JSON.stringify(stateA) !== JSON.stringify(stateB);
  }

  applyMove(vector) {
    const newRow = [];
    let i = 0;

    while (i < vector.length) {
      const current = vector[i];
      const next = vector[i + 1];

      if (current) {
        if (current === next) {
          newRow.push(current * 2);
          this.score += current * 2;
          i += 2;
        } else {
          newRow.push(current);
          i++;
        }
      } else {
        i++;
      }
    }

    while (newRow.length < vector.length) {
      newRow.push(0);
    }

    return newRow;
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
    this.status = Game.gameStatuses.PLAYING;
    this.completeMoveTasks(2);
  }

  restart() {
    this.resetState();
    this.status = Game.gameStatuses.IDLE;
    this.score = 0;
  }

  generateNewTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const [row, col] = randomCell;

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  getEmptyCells() {
    const matrix = this.getState();

    return matrix
      .flatMap((row, rowIndex) =>
        // eslint-disable-next-line prettier/prettier, max-len, comma-dangle
        row.map((cell, colIndex) => (cell === 0 ? [rowIndex, colIndex] : null)),)
      .filter(Boolean);
  }

  rotateLeft(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const resultMatrix = Array.from({ length: cols }, () =>
      // eslint-disable-next-line comma-dangle
      Array(rows).fill(''));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const newRow = col;
        const newCol = rows - 1 - row;

        resultMatrix[newRow][newCol] = matrix[row][col];
      }
    }

    return resultMatrix;
  }

  rotateRight(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    const resultMatrix = Array.from({ length: cols }, () =>
      Array(rows).fill(''));

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const newRow = cols - 1 - col;
        const newCol = row;

        resultMatrix[newRow][newCol] = matrix[row][col];
      }
    }

    return resultMatrix;
  }

  isStateValid(state) {
    if (this.status !== Game.gameStatuses.PLAYING) {
      return false;
    }

    for (const row of state) {
      let hasAdjacentEqualCells = false;
      let hasIsolatedEmptyCell = false;

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          hasAdjacentEqualCells = true;
          break;
        }

        if (row[i] === 0) {
          hasIsolatedEmptyCell = true;
        }
      }

      if (hasAdjacentEqualCells || hasIsolatedEmptyCell) {
        return true;
      }
    }

    return false;
  }

  completeMoveTasks(count = 1) {
    for (let i = 0; i < count; i++) {
      this.generateNewTile();
    }

    const state = this.getState();

    if (this.isVictory(state)) {
      this.status = Game.gameStatuses.WIN;
    } else if (this.isDefeat(state)) {
      this.status = Game.gameStatuses.LOSE;
    }
  }

  isDefeat(state) {
    const rotatedState = this.rotateRight(state);

    return [state, rotatedState].every(
      (currentState) => !this.isStateValid(currentState),
    );
  }

  isVictory(state) {
    return state.flat().includes(2048);
  }

  resetState() {
    this.state = this.initialState.map((row) => [...row]);
  }

  updateGameState(state) {
    this.state = state;
  }
}

module.exports = Game;

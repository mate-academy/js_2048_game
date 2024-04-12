'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(
    initialState = Array.from({ length: 4 }, () => Array(4).fill(0)),
  ) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    if (!this.isStateValid(this.state)) {
      return;
    }

    const updatedState = this.state.map((row) => this.moveCells(row));

    this.updateGameState(updatedState);
    this.completeMoveTasks();
  }

  moveRight() {
    const reversedState = this.state.map((row) => [...row].reverse());

    if (!this.isStateValid(reversedState)) {
      return;
    }

    const updatedState = reversedState.map((row) =>
      this.moveCells(row).reverse());

    this.updateGameState(updatedState);
    this.completeMoveTasks();
  }

  moveUp() {
    const rotatedRightState = this.rotateRight(this.state);

    if (!this.isStateValid(rotatedRightState)) {
      return;
    }

    const newState = [
      ...rotatedRightState.map((row) => this.moveCells([...row])),
    ];
    const rotatedLeftState = this.rotateLeft(newState);

    this.updateGameState(rotatedLeftState);
    this.completeMoveTasks();
  }

  moveDown() {
    const rotatedRightState = this.rotateRight(this.state);
    const rotatedLocalState = [
      ...rotatedRightState.map((row) => [...row].reverse()),
    ];

    if (!this.isStateValid(rotatedLocalState)) {
      return;
    }

    const newState = rotatedLocalState.map((row) =>
      this.moveCells([...row]).reverse());
    const rotatedLeftState = this.rotateLeft(newState);

    this.updateGameState(rotatedLeftState);
    this.completeMoveTasks();
  }

  moveCells(direction) {
    const newRow = [];

    let i = 0;

    while (i < direction.length) {
      const current = direction[i];
      const next = direction[i + 1];

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

    while (newRow.length < direction.length) {
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
    this.status = 'playing';
    this.completeMoveTasks(2);
  }

  restart() {
    this.resetState();
    this.status = 'idle';
    this.score = 0;
  }

  generateNewTile() {
    const emptyCells = this.getEmptyCells();

    if (!emptyCells.length) {
      return;
    }

    const [row, col]
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  getEmptyCells() {
    const matrix = this.getState();

    return matrix
      .flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (cell === 0 ? [rowIndex, colIndex] : null)))
      .filter((cell) => cell !== null);
  }

  rotateLeft(transformedMatrix) {
    const resultMatrix = [];
    const cols = transformedMatrix[0].length;
    const rows = transformedMatrix.length;

    for (let col = 0; col < cols; col++) {
      resultMatrix.push(Array.from({ length: rows }, () => ''));
    }

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
      for (let colIndex = 0; colIndex < cols; colIndex++) {
        const newRow = rowIndex;
        const newCol = cols - 1 - colIndex;

        resultMatrix[newRow][newCol] = transformedMatrix[colIndex][rowIndex];
      }
    }

    return resultMatrix;
  }

  rotateRight(matrix) {
    const resultMatrix = [];
    const cols = matrix[0].length;
    const rows = matrix.length;

    for (let col = 0; col < cols; col++) {
      resultMatrix.push(Array.from({ length: rows }, () => ''));
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

  isStateValid(currentState) {
    if (this.status !== 'playing') {
      return false;
    }

    for (const row of currentState) {
      let hasAdjacentEqualCells = false;
      let hasIsolatedEmptyCell = false;

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          hasAdjacentEqualCells = true;
          break;
        }

        if (!row[i]) {
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
      this.status = 'win';
    } else if (this.isDefeat(state)) {
      this.status = 'lose';
    }
  }

  isDefeat(state) {
    const rotatedRight = this.rotateRight(state);

    return [state, rotatedRight].every(
      (currentState) => !this.isStateValid(currentState),
    );
  }

  isVictory(state) {
    return state.flat().some((tile) => tile === 2048);
  }

  resetState() {
    this.state = [...this.initialState.map((row) => [...row])];
  }

  updateGameState(state) {
    this.state = state;
  }
}

module.exports = Game;

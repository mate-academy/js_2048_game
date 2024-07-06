'use strict';

class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.state = initialState || this.generateEmptyState();
    this.started = false;
    this.status = 'idle'; // Definindo o status inicial como 'idle'
  }

  getState() {
    return this.state;
  }

  getScore() {
    // Implementar lógica de pontuação se necessário
    return 0;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    if (!this.started) {
      return;
    }

    const newState = this.state.map((row) => this.moveRowLeft(row));

    this.state = newState;

    this.generateNewCell();
  }

  moveRight() {
    if (!this.started) {
      return;
    }

    const newState = this.state.map((row) => this.moveRowRight(row));

    this.state = newState;

    this.generateNewCell();
  }

  moveUp() {
    if (!this.started) {
      return;
    }

    const transposedState = this.transposeState(this.state);
    const newState = transposedState.map((row) => this.moveRowLeft(row));

    this.state = this.transposeState(newState);

    this.generateNewCell();
  }

  moveDown() {
    if (!this.started) {
      return;
    }

    const transposedState = this.transposeState(this.state);
    const newState = transposedState.map((row) => this.moveRowRight(row));

    this.state = this.transposeState(newState);

    this.generateNewCell();
  }

  start() {
    this.started = true;
    this.status = 'playing'; // Atualiza o status para 'playing'
    this.generateNewCell();
    this.generateNewCell();
  }

  restart() {
    this.state = this.generateEmptyState();
    this.started = false;
    this.status = 'idle'; // Reinicia o status para 'idle'
  }

  generateEmptyState() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  generateNewCell() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveRowLeft(row) {
    const newRow = row.filter((val) => val !== 0);
    const missingZeros = this.size - newRow.length;
    const zerosArray = Array(missingZeros).fill(0);
    const movedRow = newRow.concat(zerosArray);

    return this.mergeCells(movedRow);
  }

  moveRowRight(row) {
    const newRow = row.filter((val) => val !== 0);
    const missingZeros = this.size - newRow.length;
    const zerosArray = Array(missingZeros).fill(0);
    const movedRow = zerosArray.concat(newRow);

    return this.mergeCells(movedRow.reverse()).reverse();
  }

  mergeCells(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
      }
    }

    return row;
  }

  transposeState(state) {
    const result = [];

    for (let col = 0; col < this.size; col++) {
      result[col] = [];

      for (let row = 0; row < this.size; row++) {
        result[col].push(state[row][col]);
      }
    }

    return result;
  }
}

module.exports = Game;

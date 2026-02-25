'use strict';

class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    gameStatus = 'idle',
    score = 0,
  ) {
    this.gameStatus = gameStatus;
    this.currentState = structuredClone(initialState);
    this.score = score;
    this.initialState = structuredClone(initialState);
  }
  moveLeft() {
    let moved = false;

    for (let i = 0; i < this.currentState.length; i++) {
      const row = this.currentState[i];

      let filteredRow = row.filter((num) => num !== 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1]) {
          filteredRow[j] *= 2;
          this.score += filteredRow[j];

          if (filteredRow[j] === 2048) {
            this.gameStatus = 'win';
          }

          filteredRow[j + 1] = 0;
          moved = true;
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      if (!filteredRow.every((num, idx) => num === row[idx])) {
        moved = true;
      }

      this.currentState[i] = filteredRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();

      return true;
    }

    return false;
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < this.currentState.length; i++) {
      const row = this.currentState[i];

      let filteredRow = row.filter((num) => num !== 0);

      for (let j = filteredRow.length - 1; j > 0; j--) {
        if (filteredRow[j] === filteredRow[j - 1]) {
          filteredRow[j] *= 2;
          this.score += filteredRow[j];

          if (filteredRow[j] === 2048) {
            this.gameStatus = 'win';
          }

          filteredRow[j - 1] = 0;
          moved = true;
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      while (filteredRow.length < 4) {
        filteredRow.unshift(0);
      }

      if (!filteredRow.every((num, idx) => num === row[idx])) {
        moved = true;
      }

      this.currentState[i] = filteredRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();

      return true;
    }

    return false;
  }

  moveUp() {
    this.currentState = this.transpose(this.currentState);

    const moved = this.moveLeft();

    this.currentState = this.transpose(this.currentState);

    return moved;
  }

  moveDown() {
    this.currentState = this.transpose(this.currentState);

    const moved = this.moveRight();

    this.currentState = this.transpose(this.currentState);

    return moved;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.currentState;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.gameStatus;
  }
  /**
   * Starts the game.
   */
  start() {
    this.gameStatus = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.currentState = structuredClone(this.initialState);
    this.score = 0;
    this.gameStatus = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let i = 0; i < this.currentState.length; i++) {
      for (let j = 0; j < this.currentState[i].length; j++) {
        if (this.currentState[i][j] === 0) {
          emptyTiles.push([i, j]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const [row, col] = emptyTiles[randomIndex];

    this.currentState[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose(matrix) {
    const transposed = [];

    for (let col = 0; col < matrix[0].length; col++) {
      const newRow = [];

      for (let row = 0; row < matrix.length; row++) {
        newRow.push(matrix[row][col]);
      }

      transposed.push(newRow);
    }

    return transposed;
  }

  // src/modules/Game.class.js

checkGameOver() {
  // 1. Se ainda houver zeros, o jogo não acabou
  for (let row = 0; row < 4; row++) {
    if (this.currentState[row].includes(0)) return false;
  }

  // 2. Verificação de movimentos horizontais (em todas as linhas)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) { // col vai até 2 para comparar com col + 1
      if (this.currentState[row][col] === this.currentState[row][col + 1]) {
        return false;
      }
    }
  }

  // 3. Verificação de movimentos verticais (em todas as colunas)
  for (let row = 0; row < 3; row++) { // row vai até 2 para comparar com row + 1
    for (let col = 0; col < 4; col++) {
      if (this.currentState[row][col] === this.currentState[row + 1][col]) {
        return false;
      }
    }
  }

  // Se chegou aqui, não há zeros nem movimentos possíveis
  this.gameStatus = 'over';
  return true;
}
}

module.exports = Game;

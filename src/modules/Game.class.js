'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

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
  constructor(initialState) {
    // eslint-disable-next-line no-console
    console.log(initialState);
    this.initialState = initialState || this.createEmptyBoard();
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
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
    return this.board;
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';
    this.addRandomNumber();
    this.addRandomNumber();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  addRandomNumber() {
    const emptyCells = [];

    this.board.forEach((currentRow, rowIndex) => {
      currentRow.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() > 0.9 ? 4 : 2;
  }

  render() {
    const gameTable = document.querySelector('.game-field');
    const scoreElement = document.querySelector('.game-score');
    const winMessage = document.querySelector('.message-win');
    const loseMessage = document.querySelector('.message-lose');

    if (this.status === 'win') {
      winMessage.classList.remove('hidden');
      winMessage.style.display = 'block';
    } else if (this.status === 'lose') {
      loseMessage.classList.remove('hidden');
      loseMessage.style.display = 'block';
    }

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellElement = gameTable.rows[rowIndex].cells[colIndex];

        cellElement.textContent = cell === 0 ? '' : cell;
        cellElement.className = `field-cell field-cell--${cell || 0}`;
      });
    });

    scoreElement.textContent = this.score;
  }

  slideLeft(row) {
    const filteredRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        this.score += filteredRow[i];
      }
    }

    const resultRow = filteredRow.filter((cell) => cell !== 0);

    while (resultRow.length < 4) {
      resultRow.push(0);
    }

    return resultRow;
  }

  rotateClockwise(matrix) {
    const size = matrix.length;
    const rotate = Array.from({ length: size }, () => Array(size).fill(0));

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        rotate[col][size - row - 1] = matrix[row][col];
      }
    }

    return rotate;
  }

  rotateCounterClockwise(matrix) {
    const size = matrix.length;
    const rotate = Array.from({ length: size }, () => Array(size).fill(0));

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        rotate[size - col - 1][row] = matrix[row][col];
      }
    }

    return rotate;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      const reversed = [...row].reverse();
      const shiftedRow = this.slideLeft(reversed);

      return shiftedRow.reverse();
    });

    const currentState = JSON.stringify(this.board);

    if (currentState !== previousState) {
      this.addRandomNumber();
    }

    if (this.status === 'win') {
      return;
    }
    this.checkWin();
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.slideLeft(row));

    const currentState = JSON.stringify(this.board);

    if (previousState !== currentState) {
      this.addRandomNumber();
    }

    this.checkWin();
    this.checkLose();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.board);

    // поворачиваем матрицу против  часовой стрелки
    this.board = this.rotateCounterClockwise(this.board);

    // сдвигаем каждую строку в лево
    this.board = this.board.map((row) => this.slideLeft(row));

    // возвращаем матрицу в исходное положение
    this.board = this.rotateClockwise(this.board);

    const currentState = JSON.stringify(this.board);

    if (currentState !== previousState) {
      this.addRandomNumber();
    }

    if (this.status === 'win') {
      return;
    }

    this.checkWin();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = JSON.stringify(this.board);

    this.board = this.rotateClockwise(this.board);
    this.board = this.board.map((row) => this.slideLeft(row));
    this.board = this.rotateCounterClockwise(this.board);

    const currentState = JSON.stringify(this.board);

    if (currentState !== previousState) {
      this.addRandomNumber();
    }

    if (this.status === 'win') {
      return;
    }
    this.checkWin();
  }

  checkWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (const row of this.board) {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    const rotated = this.rotateClockwise(this.board);

    for (const row of rotated) {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }
}

module.exports = Game;

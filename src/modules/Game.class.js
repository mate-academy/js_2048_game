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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let totalPoints = 0;

    for (let r = 0; r < 4; r++) {
      const { newRow, points } = this.slideAndMerge(this.board[r]);

      this.board[r] = newRow;
      totalPoints += points;
    }

    this.updateScore(totalPoints);
    this.addRandomTile();
    this.render();

    this.checkGameOver();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let totalPoints = 0;

    for (let r = 0; r < 4; r++) {
      const reversedRow = [...this.board[r]].reverse();
      const { newRow, points } = this.slideAndMerge(reversedRow);

      this.board[r] = newRow.reverse();
      totalPoints += points;
    }

    this.updateScore(totalPoints);
    this.addRandomTile();
    this.render();

    this.checkGameOver();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let totalPoints = 0;
    const transposedBoard = [];

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }
      transposedBoard.push(column);
    }

    for (let col = 0; col < 4; col++) {
      const { newRow, points } = this.slideAndMerge(transposedBoard[col]);

      transposedBoard[col] = newRow;
      totalPoints += points;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.board[row][col] = transposedBoard[col][row];
      }
    }

    this.updateScore(totalPoints);
    this.addRandomTile();
    this.render();

    this.checkGameOver();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let totalPoints = 0;
    const transposedBoard = [];

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }
      transposedBoard.push(column.reverse());
    }

    for (let col = 0; col < 4; col++) {
      const { newRow, points } = this.slideAndMerge(transposedBoard[col]);

      transposedBoard[col] = newRow.reverse();
      totalPoints += points;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.board[row][col] = transposedBoard[col][row];
      }
    }

    this.updateScore(totalPoints);
    this.addRandomTile();
    this.render();

    this.checkGameOver();
  }

  updateScore(points) {
    this.score += points;

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  transposeBoard() {
    const newBoard = [];

    for (let col = 0; col < this.board[0].length; col++) {
      const newRow = [];

      for (let row = 0; row < this.board.length; row++) {
        newRow.push(this.board[row][col]);
      }
      newBoard.push(newRow);
    }
    this.board = newBoard;
  }

  addRandomTile() {
    const emptCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptCells.push([r, c]);
        }
      }
    }

    if (emptCells.length === 0) {
      return;
    }

    const [row, col] = emptCells[Math.floor(Math.random() * emptCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
      this.showMessage('You won!');
    }
    this.checkGameOver();
  }

  slideAndMerge(row) {
    const newRow = row.filter((val) => val !== 0);
    let points = 0;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        points += newRow[i];
        newRow.splice(i + 1, 1);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, points };
  }

  isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }

        if (
          (c < 3 && this.board[r][c] === this.board[r][c + 1]) ||
          (r < 3 && this.board[r][c] === this.board[r + 1][c])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  checkGameOver() {
    if (this.isGameOver() === true) {
      this.status = 'lose';
      this.showMessage('Game Over!');
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
      this.render();

      const button = document.querySelector('.button');

      if (button) {
        button.textContent = 'Restart';
      }
    }
  }

  render() {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = cells[index];
        const value = this.board[r][c];

        cell.innerHTML = value || '';
        cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
        index++;
      }
    }
  }

  showMessage(message) {
    const messageElement = document.querySelector('.game-message');

    if (messageElement) {
      messageElement.textContent = message;
      messageElement.style.display = 'block';
    }
  }

  hideMessage() {
    const messageElement = document.querySelector('.game-message');

    if (messageElement) {
      messageElement.style.display = 'none';
    }
  }

  restart() {
    this.hideMessage();

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }

    this.start();
  }
}

module.exports = Game;

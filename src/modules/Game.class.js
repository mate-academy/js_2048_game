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
    this.board = initialState;
    this.score = 0;
    this.button = document.querySelector('.button');
    this.isStarted = false;
    this.handleClick = this.startOrRestart.bind(this);
    this.button.addEventListener('click', this.handleClick);
    this.tableCells = document.querySelectorAll('.field-cell');
  }

  moveLeft() {
    let boardChanged = false;

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row];

      let newRow = currentRow.filter((value) => value !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] = newRow[i] * 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
          boardChanged = true;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[row] = newRow;

      if (JSON.stringify(currentRow) !== JSON.stringify(newRow)) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.placeRandomNumber(this.board);
      this.renderBoard();
      this.renderScore();
    }

    this.has2048Tile();

    if (this.checkLose()) {
      this.showLoseMessage();
    }
  }

  moveRight() {
    let boardChanged = false;

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row];

      let newRow = currentRow.filter((value) => value !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] = newRow[i] * 2;
          newRow[i - 1] = 0;
          this.score += newRow[i];
          boardChanged = true;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      this.board[row] = newRow;

      if (JSON.stringify(currentRow) !== JSON.stringify(newRow)) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.placeRandomNumber(this.board);
      this.renderBoard();
      this.renderScore();
    }

    this.has2048Tile();

    if (this.checkLose()) {
      this.showLoseMessage();
    }
  }

  moveUp() {
    let boardChanged = false;

    this.board = this.transpose(this.board);

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row];

      let newRow = currentRow.filter((value) => value !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] = newRow[i] * 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
          boardChanged = true;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[row] = newRow;

      if (JSON.stringify(currentRow) !== JSON.stringify(newRow)) {
        boardChanged = true;
      }
    }

    this.board = this.transpose(this.board);

    if (boardChanged) {
      this.placeRandomNumber(this.board);
      this.renderBoard();
      this.renderScore();
    }

    this.has2048Tile();

    if (this.checkLose()) {
      this.showLoseMessage();
    }
  }

  moveDown() {
    let boardChanged = false;

    this.board = this.transpose(this.board);

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row];

      let newRow = currentRow.filter((value) => value !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] = newRow[i] * 2;
          newRow[i - 1] = 0;
          this.score += newRow[i];
          boardChanged = true;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      this.board[row] = newRow;

      if (JSON.stringify(currentRow) !== JSON.stringify(newRow)) {
        boardChanged = true;
      }
    }

    this.board = this.transpose(this.board);

    if (boardChanged) {
      this.placeRandomNumber(this.board);
      this.renderBoard();
      this.renderScore();
    }

    this.has2048Tile();

    if (this.checkLose()) {
      this.showLoseMessage();
    }
  }

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  /**
   * @returns {number}
   */
  getScore() {
    const scoreElement = document.querySelector('.game-score');

    scoreElement.textContent = this.score;

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
   * idle - the game has not started yet (the initial state);
   * playing - the game is in progress;
   * win - the game is won;
   * lose - the game is lost
   */

  getStatus() {
    if (!this.isStarted) {
      return 'idle';
    } else if (this.checkWin()) {
      return 'win';
    } else if (this.checkLose()) {
      return 'lose';
    } else {
      return 'playing';
    }
  }

  startOrRestart() {
    if (this.isStarted) {
      this.restart();
    } else {
      this.start();
    }
  }

  /**
   * Starts the game.
   */
  start() {
    const messageElement = document.querySelector('.message.message-start');

    messageElement.textContent =
      'The game has started! Use the arrow keys to play.';

    this.button.classList.remove('start');
    this.button.classList.add('restart');
    this.button.textContent = 'Restart';
    this.isStarted = true;
    this.placeRandomNumber(this.board);
    this.placeRandomNumber(this.board);
    this.renderBoard();
  }

  /**
   * Resets the game.
   */
  restart() {
    const messageElement = document.querySelector('.message.message-start');
    const messageLoseElement = document.querySelector('.message-lose');
    const gameScore = document.querySelector('.game-score');

    if (!messageLoseElement.classList.contains('hidden')) {
      messageLoseElement.classList.add('hidden');
    }

    messageElement.textContent = 'Press "Start" to begin game. Good luck!';
    messageElement.classList.remove('hidden');
    this.button.classList.remove('restart');
    this.button.classList.add('start');
    this.button.textContent = 'Start';
    this.isStarted = false;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    gameScore.textContent = 0;
    this.renderBoard();
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  placeRandomNumber(board) {
    const emptyCells = [];

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = this.getRandomInt(0, emptyCells.length);
      const [randomRow, randomCol] = emptyCells[randomIndex];

      board[randomRow][randomCol] = Math.random() > 0.1 ? 2 : 4;
    }
  }

  renderBoard() {
    this.tableCells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;

      if (this.board[row][col] !== 0) {
        cell.textContent = this.board[row][col];
        cell.className = `field-cell field-cell--${this.board[row][col]}`;
      } else {
        cell.textContent = '';
        cell.className = 'field-cell';
      }
    });
  }

  renderScore() {
    const scoreElement = document.querySelector('.game-score');

    scoreElement.textContent = this.score;
  }

  has2048Tile() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] >= 2048) {
          return this.showWinMessage();
        }
      }
    }
  }

  showWinMessage() {
    const startMessage = document.querySelector('.message.message-start');
    const winMessage = document.querySelector('.message.message-win');
    const loseMessage = document.querySelector('.message.message-lose');

    startMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');

    winMessage.classList.remove('hidden');
  }

  showLoseMessage() {
    const startMessage = document.querySelector('.message.message-start');
    const winMessage = document.querySelector('.message.message-win');
    const loseMessage = document.querySelector('.message.message-lose');

    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    loseMessage.classList.remove('hidden');
  }

  checkLose() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (
          col < this.board[row].length - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return false;
        }

        if (
          row < this.board.length - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;

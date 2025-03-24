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
    this.firstMove = false;
    this.previousBoard = JSON.parse(JSON.stringify(this.board));
    this.initControls();
    this.getState();
  }

  hasBoardChanged() {
    return JSON.stringify(this.board) !== JSON.stringify(this.previousBoard);
  }

  initControls() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.moveLeft();
      } else if (e.key === 'ArrowRight') {
        this.moveRight();
      } else if (e.key === 'ArrowUp') {
        this.moveUp();
      } else if (e.key === 'ArrowDown') {
        this.moveDown();
      }
    });
  }

  moveLeft() {
    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row].filter((num) => num !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }
      this.board[row] = newRow;
    }

    if (this.hasBoardChanged()) {
      this.previousBoard = JSON.parse(JSON.stringify(this.board));
      this.addNewTile();
      this.getState();
      this.checkFirstMove();
      this.getScore();

      const gameStatus = this.getStatus();
      const messageWin = document.querySelector('.message-win');
      const messageLose = document.querySelector('.message-lose');

      if (gameStatus === 'win') {
        messageWin.classList.remove('hidden');
      } else if (gameStatus === 'lose') {
        messageLose.classList.remove('hidden');
      }
    }
  }
  moveRight() {
    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row].filter((num) => num !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          newRow[i - 1] = 0;
        }
      }
      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }
      this.board[row] = newRow;
    }

    if (this.hasBoardChanged()) {
      this.previousBoard = JSON.parse(JSON.stringify(this.board));
      this.addNewTile();
      this.getState();
      this.checkFirstMove();
      this.getScore();

      const gameStatus = this.getStatus();
      const messageWin = document.querySelector('.message-win');
      const messageLose = document.querySelector('.message-lose');

      if (gameStatus === 'win') {
        messageWin.classList.remove('hidden');
      } else if (gameStatus === 'lose') {
        messageLose.classList.remove('hidden');
      }
    }
  }
  moveUp() {
    for (let col = 0; col < 4; col++) {
      let newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newCol[i + 1] = 0;
        }
      }
      newCol = newCol.filter((num) => num !== 0);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[row];
      }
    }

    if (this.hasBoardChanged()) {
      this.previousBoard = JSON.parse(JSON.stringify(this.board));
      this.addNewTile();
      this.getState();
      this.checkFirstMove();
      this.getScore();

      const gameStatus = this.getStatus();
      const messageWin = document.querySelector('.message-win');
      const messageLose = document.querySelector('.message-lose');

      if (gameStatus === 'win') {
        messageWin.classList.remove('hidden');
      } else if (gameStatus === 'lose') {
        messageLose.classList.remove('hidden');
      }
    }
  }
  moveDown() {
    for (let col = 0; col < 4; col++) {
      let newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = newCol.length - 1; i > 0; i--) {
        if (newCol[i] === newCol[i - 1]) {
          newCol[i] *= 2;
          newCol[i - 1] = 0;
        }
      }
      newCol = newCol.filter((num) => num !== 0);

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[row];
      }
    }

    if (this.hasBoardChanged()) {
      this.previousBoard = JSON.parse(JSON.stringify(this.board));
      this.addNewTile();
      this.getState();
      this.checkFirstMove();
      this.getScore();

      const gameStatus = this.getStatus();
      const messageWin = document.querySelector('.message-win');
      const messageLose = document.querySelector('.message-lose');

      if (gameStatus === 'win') {
        messageWin.classList.remove('hidden');
      } else if (gameStatus === 'lose') {
        messageLose.classList.remove('hidden');
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    let score = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        score += this.board[row][col];
      }
    }

    const gameScore = document.querySelector('.game-score');

    gameScore.textContent = score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = cells[index];

        cell.innerHTML = '';
        cell.className = 'field-cell';

        const value = this.board[row][col];

        if (value !== 0) {
          cell.classList.add(`field-cell--${value}`);

          const tile = document.createElement('div');

          tile.classList.add('tile');
          tile.innerText = value;
          cell.appendChild(tile);
        }
        index++;
      }
    }
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
    const win = this.board.some((row) => row.includes(2048));
    const lose = !this.board.some((row) => row.includes(0)) && !this.canMerge();

    if (win) {
      return 'win';
    } else if (lose) {
      return 'lose';
    } else {
      return 'playing';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    const messageStart = document.querySelector('.message-start');
    const startButton = document.querySelector('.start');

    startButton.addEventListener('click', () => {
      messageStart.classList.add('hidden');
      this.restart();
    });
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addNewTile();
    this.addNewTile();
    this.getState();

    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');

    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    const gameScore = document.querySelector('.game-score');

    gameScore.textContent = '0';
  }

  // Add your own methods here

  addNewTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;

      this.board[randomCell.row][randomCell.col] = value;

      if (this.hasBoardChanged()) {
        this.previousBoard = JSON.parse(JSON.stringify(this.board));
        this.getState();
      }
    }
  }

  canMerge() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (col < 3 && current === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && current === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkFirstMove() {
    if (!this.firstMove) {
      this.firstMove = true;
      this.changeButton();
    }
  }

  changeButton() {
    const startButton = document.querySelector('.start');

    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }
}

module.exports = Game;

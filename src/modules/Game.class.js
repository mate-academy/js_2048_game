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
  buildTable(board) {
    const gameField = document.querySelector('.game-field tbody');

    for (let i = 0; i < gameField.children.length; i++) {
      const row = gameField.children[i];
      const cells = row.children;

      for (let n = 0; n < cells.length; n++) {
        const cellValue = `field-cell--${board[i][n]}`;

        cells[n].className = 'field-cell';

        if (board[i][n] !== 0) {
          cells[n].classList.add(cellValue);
          cells[n].textContent = board[i][n];
        } else {
          cells[n].textContent = '';
        }
      }
    }
  }

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;

    this.buildTable(this.board);
    this.score = 0;
    this.status = 'idle';
    this.getScore();
  }

  moveLeft() {
    const updatedBoard = [];

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i].filter((el) => el > 0);

      for (let j = 0; j < row.length; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
        }
      }

      row = row.filter((el) => el > 0);

      while (row.length < 4) {
        row.push(0);
      }

      updatedBoard.push(row);
    }

    if (JSON.stringify(this.board) !== JSON.stringify(updatedBoard)) {
      this.board = updatedBoard;
      this.spawnDice();
      this.buildTable(this.board);
      this.getScore();
    }

    return updatedBoard;
  }
  moveRight() {
    const updatedBoard = [];

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i].filter((el) => el > 0);

      for (let j = 0; j < row.length; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
        }
      }

      row = row.filter((el) => el > 0);

      while (row.length < 4) {
        row.unshift(0);
      }

      updatedBoard.push(row);
    }

    if (JSON.stringify(this.board) !== JSON.stringify(updatedBoard)) {
      this.board = updatedBoard;
      this.spawnDice();
      this.buildTable(this.board);
      this.getScore();
    }

    return updatedBoard;
  }
  moveUp() {
    const updatedBoard = [[], [], [], []];

    for (let i = 0; i < this.board.length; i++) {
      let column = this.board.map((row) => row[i]).filter((el) => el > 0);

      for (let j = 0; j < column.length - 1; j++) {
        if (column[j] === column[j + 1]) {
          column[j] *= 2;
          column[j + 1] = 0;
        }
      }

      column = column.filter((el) => el > 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let n = 0; n < 4; n++) {
        updatedBoard[n].push(column[n]);
      }
    }

    if (JSON.stringify(this.board) !== JSON.stringify(updatedBoard)) {
      this.board = updatedBoard;
      this.spawnDice();
      this.buildTable(this.board);
      this.getScore();
    }

    return updatedBoard;
  }
  moveDown() {
    const updatedBoard = [[], [], [], []];

    for (let i = 0; i < this.board.length; i++) {
      let column = this.board.map((row) => row[i]).filter((el) => el > 0);

      for (let j = 0; j < column.length - 1; j++) {
        if (column[j] === column[j + 1]) {
          column[j] *= 2;
          column[j + 1] = 0;
        }
      }

      column = column.filter((el) => el > 0);

      while (column.length < 4) {
        column.unshift(0);
      }

      for (let n = 0; n < 4; n++) {
        updatedBoard[n].push(column[n]);
      }
    }

    if (JSON.stringify(this.board) !== JSON.stringify(updatedBoard)) {
      this.board = updatedBoard;
      this.spawnDice();
      this.buildTable(this.board);
      this.getScore();
    }

    return updatedBoard;
  }

  /**
   * @returns {number}
   */
  getScore() {
    const scoreTable = document.querySelector('.game-score');
    let currentScore = 0;

    for (let i = 0; i < this.board.length; i++) {
      currentScore += this.board[i].reduce((prev, el) => prev + el, 0);
    }
    scoreTable.textContent = currentScore;
    this.score = currentScore;

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
    const messageStart = document.querySelector('.message.message-start');
    const messageWin = document.querySelector('.message.message-win');
    const messageLose = document.querySelector('.message.message-lose');

    if (this.status === 'idle') {
      messageStart.classList.remove('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
    }

    if (this.status === 'playing') {
      messageStart.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
    }

    if (this.status === 'win') {
      messageStart.classList.add('hidden');
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
    }

    if (this.status === 'lose') {
      messageStart.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.remove('hidden');
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'playing';
    this.spawnDice();
    this.getStatus();
    this.getScore();
    this.buildTable(this.board);
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

    this.status = 'idle';
    this.score = 0;

    this.buildTable(this.board);
    this.getScore();
    this.getStatus();
  }

  // Add your own methods here
  spawnDice() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const cell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[cell.i][cell.j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkWin() {
    for (let i = 0; i < this.board.length; i++) {
      if (this.board[i].includes(2048)) {
        this.status = 'win';
        this.getStatus();
      }
    }
  }

  checkLose() {
    const beforeCheckBoard = this.board;
    const checkMovesResult = [];

    const movesArr = [
      () => this.moveUp(),
      () => this.moveDown(),
      () => this.moveLeft(),
      () => this.moveRight(),
    ];

    for (let i = 0; i < movesArr.length; i++) {
      const newBoardState = movesArr[i]();

      if (JSON.stringify(newBoardState) !== JSON.stringify(beforeCheckBoard)) {
        checkMovesResult.push(true);
      } else {
        checkMovesResult.push(false);
      }
    }

    if (!checkMovesResult.includes(true)) {
      this.status = 'lose';
      this.getStatus();
    }

    this.board = beforeCheckBoard;
    this.buildTable(this.board);
    this.getScore();
  }
}

module.exports = Game;

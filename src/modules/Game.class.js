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
    this.initializeBoard();
    this.renderBoard();
    this.addKeyboardListeners();
    this.getScore();
    this.start();
    this.isGameOver();
    this.isWinner();
    // this.status();
    this.restart();
    this.boardMessage();
    // this.getStatus();
  }

  initializeBoard() {
    this.rows = 4;
    this.columns = 4;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
  }

  findEmptyCells() {
    const isEmpty = [];

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.board[i][j] === 0) {
          isEmpty.push({ row: i, column: j });
        }
      }
    }

    return isEmpty;
  }

  createCell() {
    const emptyCells = this.findEmptyCells();

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      const randomNumber = this.generateRandomNumber();

      this.board[randomCell.row][randomCell.column] = randomNumber;

      emptyCells.splice(emptyCells.indexOf(randomCell), 1);
    }
  }

  generateRandomNumber() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  renderBoard() {
    const boardElement = document.querySelector('.game-field tbody');

    boardElement.innerHTML = '';

    for (let i = 0; i < this.rows; i++) {
      const row = document.createElement('tr');

      for (let j = 0; j < this.columns; j++) {
        const tile = document.createElement('td');

        tile.classList.add('field-cell');

        const value = this.board[i][j];

        tile.innerText = value || '';

        if (value) {
          tile.classList.add(`field-cell--${value}`);
          tile.classList.add(`field-cell--active`);

          if (!tile.classList.contains(`field-cell--active`)) {
          }
        }

        tile.class = i.toString() + '-' + j.toString();
        row.appendChild(tile);
      }
      boardElement.appendChild(row);
    }

    // this.status();
  }

  addKeyboardListeners() {
    document.addEventListener('keydown', (press) => {
      if (press.key === 'ArrowLeft') {
        this.moveLeft();
      }

      if (press.key === 'ArrowRight') {
        this.moveRight();
      }

      if (press.key === 'ArrowUp') {
        this.moveUp();
      }

      if (press.key === 'ArrowDown') {
        this.moveDown();
      }
      this.boardMessage();
    });
  }

  filterZeroRow(row) {
    return row.filter((num) => num !== 0);
  }

  slideLeft(row) {
    let filteredRow = this.filterZeroRow(row);

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        this.score += filteredRow[i];
      }
    }

    filteredRow = this.filterZeroRow(filteredRow);

    while (filteredRow.length < this.columns) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  moveLeft() {
    const previousBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < this.rows; i++) {
      let row = this.board[i];

      row = this.slideLeft(row);
      this.board[i] = row;
    }

    const boardChanged = !this.areArraysEqual(previousBoard, this.board);

    if (boardChanged) {
      this.createCell();
    }

    this.renderBoard();
    this.updateScore();
  }

  areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (!arr1[i].every((val, index) => val === arr2[i][index])) {
        return false;
      }
    }

    return true;
  }

  slideRight(row) {
    let filteredRow = this.filterZeroRow(row);

    for (let j = filteredRow.length - 1; j > 0; j--) {
      if (filteredRow[j] === filteredRow[j - 1]) {
        filteredRow[j] *= 2;
        filteredRow[j - 1] = 0;
        this.score += filteredRow[j];
      }
    }

    filteredRow = this.filterZeroRow(filteredRow);

    while (filteredRow.length < this.columns) {
      filteredRow.unshift(0);
    }

    return filteredRow;
  }

  moveRight() {
    const previousBoard = this.board.map((row) => [...row]);

    for (let j = 0; j < this.rows; j++) {
      let row = this.board[j];

      row = this.slideRight(row);

      this.board[j] = row;
    }

    const boardChanged = !this.areArraysEqual(previousBoard, this.board);

    if (boardChanged) {
      this.createCell();
    }

    this.renderBoard();
    this.updateScore();
  }

  filterZeroColunms(columns) {
    if (columns && columns.length) {
      return columns.filter((num) => num !== 0);
    } else {
      return [];
    }
  }

  slideUp(columns) {
    let filteredColumns = this.filterZeroColunms(columns);

    for (let i = 0; i < filteredColumns.length; i++) {
      if (filteredColumns[i] === filteredColumns[i + 1]) {
        filteredColumns[i] *= 2;
        filteredColumns[i + 1] = 0;
        this.score += filteredColumns[i];
      }
    }

    filteredColumns = this.filterZeroColunms(filteredColumns);

    while (filteredColumns.length < this.rows) {
      filteredColumns.push(0);
    }

    return filteredColumns;
  }

  transpose(matrix) {
    return matrix[0].map((col, j) => matrix.map((row) => row[j]));
  }

  moveUp() {
    const previousBoard = this.board.map((column) => [...column]);

    const transposedBoard = this.transpose(this.board);

    for (let i = 0; i < this.rows; i++) {
      let column = transposedBoard[i];

      column = this.slideUp(column);
      transposedBoard[i] = column;
    }

    this.board = this.transpose(transposedBoard);

    const boardChanged = !this.areArraysEqual(previousBoard, this.board);

    if (boardChanged) {
      this.createCell();
    }

    this.renderBoard();
    this.updateScore();
  }

  slideDown(columns) {
    let filteredColumns = this.filterZeroColunms(columns);

    for (let j = filteredColumns.length - 1; j > 0; j--) {
      if (filteredColumns[j] === filteredColumns[j - 1]) {
        filteredColumns[j] *= 2;
        filteredColumns[j - 1] = 0;
        this.score += filteredColumns[j];
      }
    }

    filteredColumns = this.filterZeroColunms(filteredColumns);

    while (filteredColumns.length < this.rows) {
      filteredColumns.unshift(0);
    }

    return filteredColumns;
  }

  moveDown() {
    const previousBoard = this.board.map((column) => [...column]);

    const transposedBoard = this.transpose(this.board);

    for (let i = 0; i < this.rows; i++) {
      let column = transposedBoard[i];

      column = this.slideDown(column);
      transposedBoard[i] = column;
    }

    this.board = this.transpose(transposedBoard);

    const boardChanged = !this.areArraysEqual(previousBoard, this.board);

    if (boardChanged) {
      this.createCell();
    }

    this.renderBoard();
    this.updateScore();
  }

  updateScore() {
    const scoreElement = document.querySelector('.game-score');

    scoreElement.innerText = this.score;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return (this.score = 0);
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
    // const statusWin
  }

  boardMessage() {
    const messageStart = document.querySelector('.message-start');
    const messageLose = document.querySelector('.message-lose');
    const messageWin = document.querySelector('.message-win');

    if (this.isGameOver()) {
      messageLose.classList.remove('hidden');
      messageStart.classList.add('hidden');
    }

    if (this.isWinner()) {
      messageStart.classList.add('hidden');
      messageWin.classList.remove('hidden');
    }
  }

  isWinner() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  isGameOver() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (i !== this.rows - 1 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }

        if (
          j !== this.columns - 1 &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  status() {
    // const gameover = this.isGameOver();
    // const isWiner = this.isWinner();
    // if (gameover) {
    //   console.log('game over');
    // }
    // if (isWiner) {
    //   console.log('WINNER');
    // }
  }
  /**
   * Starts the game.
   */
  start() {
    const startButton = document.querySelector('.start');

    startButton.addEventListener('click', () => {
      if (startButton.classList.contains('restart')) {
        startButton.classList.remove('restart');
        startButton.classList.add('start');
        startButton.textContent = 'Start';
        this.restart();

        return;
      }

      // startButton.textContent = 'Restart';
      // startButton.classList.remove('start');
      // startButton.classList.add('restart');

      if (this.isBoardEmpty()) {
        this.createCell();
        this.createCell();
        this.renderBoard();
      }
    });
  }

  isBoardEmpty() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.board[i][j] !== 0) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Resets the game.
   */
  restart() {
    const messageStart = document.querySelector('.message-start');
    const messageLose = document.querySelector('.message-lose');
    const messageWin = document.querySelector('.message-win');

    if (!this.isBoardEmpty()) {
      messageLose.classList.add('hidden');
      messageStart.classList.remove('hidden');
      messageWin.classList.add('hidden');
      this.initializeBoard();
      this.updateScore();
      this.renderBoard();
    }
  }

  // Add your own methods here
}

module.exports = Game;

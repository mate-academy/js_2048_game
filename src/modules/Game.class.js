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
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.canMove()) {
      this.doMove('left');
    }
  }

  moveRight() {
    if (this.canMove()) {
      this.doMove('right');
    }
  }

  moveUp() {
    if (this.canMove()) {
      this.doMove('up');
    }
  }

  moveDown() {
    if (this.canMove()) {
      this.doMove('down');
    }
  }

  doMove(direction) {
    const previousState = JSON.stringify(this.getState());

    let board = JSON.parse(JSON.stringify(this.getState()));

    if (direction === 'up' || direction === 'down') {
      board = this.transposeBoard(board);
    }

    if (direction === 'right' || direction === 'down') {
      board = board.map((row) => row.slice().reverse());
    }

    for (let i = 0; i < 4; i++) {
      const row = board[i].filter((cell) => cell !== 0);

      let j = 0;

      while (j < row.length - 1) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j + 1, 1);
        }
        j++;
      }

      while (row.length < 4) {
        row.push(0);
      }

      board[i] = row;
    }

    if (direction === 'right' || direction === 'down') {
      board = board.map((row) => row.slice().reverse());
    }

    if (direction === 'up' || direction === 'down') {
      board = this.transposeBoard(board);
    }

    this.setState(board);

    if (previousState !== JSON.stringify(this.getState())) {
      this.status = 'playing';
      this.getRandomFreePosition();
      this.checkGameStatus();
    }
  }

  checkGameStatus() {
    if (this.getState().some((row) => row.some((cell) => cell === 2048))) {
      this.status = 'win';

      return;
    }

    const boardFull = this.getState().every(
      (row) => row.every((cell) => cell !== 0),
      // eslint-disable-next-line function-paren-newline
    );

    if (boardFull && !this.canMove()) {
      this.status = 'lose';
    }
  }

  updateGameStatus() {
    const gameStatus = this.getStatus();
    const messageStart = document.querySelector('.message-start');
    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');
    const startButton = document.querySelector('.start');

    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    if (gameStatus === 'idle') {
      messageStart.classList.remove('hidden');
      startButton.classList.remove('restart');
      startButton.textContent = 'Start';
    } else if (gameStatus === 'win') {
      messageWin.classList.remove('hidden');
      startButton.classList.add('restart');
      startButton.textContent = 'Restart';
    } else if (gameStatus === 'lose') {
      messageLose.classList.remove('hidden');
      startButton.classList.add('restart');
      startButton.textContent = 'Restart';
    } else if (gameStatus === 'playing') {
      startButton.classList.add('restart');
      startButton.textContent = 'Restart';
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  getRandomFreePosition() {
    let firstNumber, secondNumber;

    do {
      firstNumber = Math.floor(Math.random() * 4);
      secondNumber = Math.floor(Math.random() * 4);
    } while (this.initialState[firstNumber][secondNumber]);

    this.initialState[firstNumber][secondNumber] = this.generateRandomNumber();
  }

  generateRandomNumber(probOf2 = 0.9) {
    const random = Math.random();

    if (random <= probOf2) {
      return 2;
    } else {
      return 4;
    }
  }
  /**
   * @returns {number[][]}
   */
  getState() {
    return this.initialState;
  }

  setState(newState) {
    this.initialState = newState;
  }

  canMove() {
    const board = this.getState();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === board[i][j + 1]) {
          return true;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  updateView(htmlBoard) {
    const board = this.getState();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = htmlBoard.rows[i].cells[j];

        cell.textContent = '';
        cell.className = 'field-cell';

        if (board[i][j] !== 0) {
          cell.textContent = board[i][j];
          cell.classList.add('field-cell--' + board[i][j]);
        }
      }
    }

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.getScore();
    }

    this.updateGameStatus();
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
    this.status = 'playing';
    this.getRandomFreePosition();
    this.getRandomFreePosition();
  }

  transposeBoard(board) {
    const size = board.length;
    const transposed = Array(size)
      .fill()
      .map(() => Array(size).fill(0));

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        transposed[i][j] = board[j][i];
      }
    }

    return transposed;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;

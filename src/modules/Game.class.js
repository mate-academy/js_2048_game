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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.ROWS_NODE = [...document.querySelectorAll('.field-row')];
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {
    // let score = 0;
    // for (let row = 0; row < this.board.length; row++) {
    //   let scoreRow = 0;
    //   for (let cell = 0; cell < this.board[row].length; cell++) {
    //     scoreRow += this.board[row][cell];
    //     if (cell === this.board[row].length - 1) {
    //       score += scoreRow;
    //     }
    //   }
    // }
    // const GAME_SCORE_NODE = document.querySelector('.game-score');
    // GAME_SCORE_NODE.innerHTML = `${score}`;
  }

  /**
   * @returns {number[][]}
   */
  getState() {}

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    this.clickStartButton();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.clickRestartButton();
    this.resetBoard();
  }

  placeRandomTile() {
    const emptyCells = [];

    // push empty cell coords as {row, cell} in [] (emptyCells)
    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (this.board[row][cell] === 0) {
          emptyCells.push({ row, cell });
        }
      }
    }

    if (emptyCells.length > 0) {
      // choose random number between 0 and emptyCells.length
      const randomCell = Math.floor(
        Math.random() * Math.floor(emptyCells.length + 1),
      );

      // choose random value for cell (2 or 4), 4 probability is 10%
      const randomValue = Math.random() < 0.1 ? 4 : 2;

      // pick randomly chosen number from randomCell
      const RandomTilePosition = emptyCells[randomCell];

      const { row, cell } = RandomTilePosition;

      // add random value to the board
      this.board[row][cell] = randomValue;

      // insert random value inside html
      const changingCell = this.ROWS_NODE[row].childNodes[cell];

      // insert class modificator and append value as text
      if (typeof changingCell.classList !== 'undefined') {
        changingCell.classList.add(`field-cell--${randomValue}`);
        changingCell.innerHTML = randomValue.toString();
      }
    }
  }

  clickStartButton() {
    const START_BUTTON_NODE = document.querySelector('.button.start');
    const START_MESSAGE_NODE = document.querySelector('.message.message-start');

    START_BUTTON_NODE.addEventListener('click', () => {
      this.placeRandomTile();
      this.placeRandomTile();

      START_MESSAGE_NODE.innerHTML = 'Your ad can be here';
      START_MESSAGE_NODE.classList.replace('message-start', 'message-restart');

      START_BUTTON_NODE.innerHTML = 'Restart';
      START_BUTTON_NODE.classList.replace('start', 'restart');

      this.clickRestartButton();
    });
  }

  clickRestartButton() {
    const RESTART_BUTTON_NODE = document.querySelector('.button.restart');
    const RESTART_MESSAGE_NODE = document.querySelector(
      '.message.message-restart',
    );

    if (RESTART_BUTTON_NODE !== null) {
      RESTART_BUTTON_NODE.addEventListener('click', () => {
        this.resetBoard();

        RESTART_MESSAGE_NODE.innerHTML =
          'Press "Start" to begin game. <br> Good luck!';
        RESTART_BUTTON_NODE.innerHTML = 'Start';
        RESTART_BUTTON_NODE.classList.replace('restart', 'start');

        RESTART_MESSAGE_NODE.classList.replace(
          'message-restart',
          'message-start',
        );

        this.clickStartButton();
      });
    }
  }

  resetBoard() {
    // reset board
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    // reset html
    this.ROWS_NODE.forEach((row) => {
      row.childNodes.forEach((cell) => {
        cell.innerHTML = '';
        cell.className = 'field-cell';
      });
    });
  }
}

module.exports = Game;

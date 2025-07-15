'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 *
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
   *
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState = null) {
    this.board = initialState;
    this.status = 'idle';
    this.score = 0;
  }

  addRandomCells(count = 2) {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    for (let i = 0; i < count && emptyCells.length > 0; i++) {
      const idx = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells.splice(idx, 1)[0];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  renderBoard(board) {
    const cells = document.querySelectorAll('.field-cell');

    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;

      cells[i].textContent = board[row][col] === 0 ? '' : board[row][col];

      if (board[row][col] !== 0) {
        cells[i].classList.add(`field-cell--${board[row][col]}`);
      }
    }
  }

  slideAndMerge(row) {
    let arr = row.filter((num) => num !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        this.score += arr[i] *= 2;
        arr[i + 1] = 0;
      }
    }

    arr = arr.filter((num) => num !== 0);

    while (arr.length < 4) {
      arr.push(0);
    }

    return arr;
  }

  applyMove(moveCallback) {
    const oldBoard = this.board.map((row) => [...row]);

    moveCallback();

    const newBoard = this.board;

    let changed = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldBoard[row][col] !== newBoard[row][col]) {
          changed = true;
          break;
        }
      }

      if (changed) {
        break;
      }
    }

    if (changed) {
      this.addRandomCells(1);
    }
  }

  moveLeft() {
    if (this.status === 'playing') {
      this.applyMove(() => {
        for (let i = 0; i < 4; i++) {
          this.board[i] = this.slideAndMerge(this.board[i]);
        }
        this.resetClass();
        this.getScore();
        this.hasWinningTile();
        this.gameOver();
      });
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      this.applyMove(() => {
        for (let i = 0; i < 4; i++) {
          this.board[i] = this.slideAndMerge(
            this.board[i].slice().reverse(),
          ).reverse();
        }
        this.resetClass();
        this.getScore();
        this.hasWinningTile();
        this.gameOver();
      });
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      this.applyMove(() => {
        for (let col = 0; col < 4; col++) {
          let column = [];

          for (let row = 0; row < 4; row++) {
            column.push(this.board[row][col]);
          }

          column = this.slideAndMerge(column);

          for (let row = 0; row < 4; row++) {
            this.board[row][col] = column[row];
          }
        }
        this.resetClass();
        this.getScore();
        this.hasWinningTile();
        this.gameOver();
      });
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      this.applyMove(() => {
        for (let col = 0; col < 4; col++) {
          let column = [];

          for (let row = 0; row < 4; row++) {
            column.push(this.board[row][col]);
          }

          column = this.slideAndMerge(column.reverse()).reverse();

          for (let row = 0; row < 4; row++) {
            this.board[row][col] = column[row];
          }
        }
        this.resetClass();
        this.getScore();
        this.hasWinningTile();
        this.gameOver();
      });
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    const scoreElement = document.querySelector('.game-score');

    scoreElement.textContent = this.score;
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
    this.status = 'playing';

    this.addRandomCells(2);
  }

  /**
   * Resets the game.
   */

  reset() {
    this.score = 0;
    this.status = 'idle';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.resetScore();
    this.resetClass();
    this.messageRestart();
  }

  resetClass() {
    const fieldElement = document.querySelectorAll('.field-cell');

    fieldElement.forEach((el) => {
      el.className = 'field-cell';
    });
  }

  restart() {
    this.reset();
  }

  resetScore() {
    const scoreElement = document.querySelector('.game-score');

    scoreElement.textContent = '0';

    const fieldElement = document.querySelectorAll('.field-cell');

    fieldElement.forEach((el) => {
      el.textContent = '';
    });

    this.toggleMessage('message-start', true);
  }

  messageRestart() {
    this.toggleMessage('message-lose', false);
    this.toggleMessage('message-win', false);
  }

  gameOver() {
    let hasMoves = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.board[row][col];

        if (cell === 0) {
          hasMoves = true;
        }

        if (col < 3 && cell === this.board[row][col + 1]) {
          hasMoves = true;
        }

        if (row < 3 && cell === this.board[row + 1][col]) {
          hasMoves = true;
        }
      }
    }

    if (!hasMoves) {
      this.status = 'lose';
      this.toggleMessage('message-lose', true);
    }
  }

  toggleMessage(type, show) {
    const element = document.querySelector(`.message.${type}`);

    if (!element) {
      return;
    }

    if (show) {
      element.classList.remove('hidden');
    } else {
      element.classList.add('hidden');
    }
  }

  hasWinningTile() {
    const won = this.board.flat().includes(2048);

    if (won) {
      this.status = 'win';
      this.toggleMessage('message-win', true);
    }
  }

  // Add your own methods here
}

module.exports = Game;

'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
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
  gameBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  count = 0;

  name = 'field-cell--';

  num2048 = 2048;

  buttonStart = document.querySelector('button');

  messageLose = document.querySelector('.message-lose');

  messageWin = document.querySelector('.message-win');

  messageStart = document.querySelector('.message-start');

  score = document.querySelector('.game-score');

  board = document.querySelector('tbody');

  constructor(initialState = 'idle') {
    // eslint-disable-next-line no-console
    this.initialState = initialState;
  }

  moveLeft() {
    this.shiftLeft();
    this.shiftLeft();
    this.shiftLeft();
  }

  moveRight() {
    this.shiftRight();
    this.shiftRight();
    this.shiftRight();
  }

  moveUp() {
    this.shiftUp();
    this.shiftUp();
    this.shiftUp();
  }

  moveDown() {
    this.shiftDown();
    this.shiftDown();
    this.shiftDown();
  }

  /**
   * @returns {number}
   */
  getScore() {
    this.score.textContent = this.count;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return `One of: ${this.initialState}`;
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
    this.buttonStart.textContent = 'Start';
    this.buttonStart.classList.toggle('start');
    this.buttonStart.classList.toggle('restart');
    this.initialState = 'idle';
  }

  statusCheck() {
    if (this.initialState === 'lose') {
      this.getStatus();
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.initialState = 'playing';

    if (this.messageStart.className === 'message message-start') {
      this.messageStart.classList.toggle('hidden');
    }

    if (this.messageLose.className === 'message message-lose') {
      this.messageLose.classList.toggle('hidden');
    }

    if (this.messageWin.className === 'message message-win') {
      this.messageWin.classList.toggle('hidden');
    }

    this.count = 0;
    this.getScore();
    this.fieldClearing();

    this.randomChip();
    this.randomChip();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
  randomChip() {
    const index = Math.floor(Math.random() * 16);
    const num = Math.random() > 0.2 ? 2 : 4;
    const x = index % 4;
    const y = Math.floor(index / 4);

    if (this.gameBoard[x][y] === 0) {
      this.gameBoard[x][y] = num;

      this.board.rows[x].cells[y].classList.toggle(this.name + num);
      this.board.rows[x].cells[y].textContent = num;
    } else {
      this.isEmpty();

      if (this.initialState !== 'lose') {
        this.randomChip();
      }
    }
  }

  fieldClearing() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        this.gameBoard[i][j] = 0;

        if (this.board.rows[i].cells[j].textContent === 0) {
          continue;
        } else {
          this.board.rows[i].cells[j].textContent = null;
          this.board.rows[i].cells[j].classList = 'field-cell';
        }
      }
    }
  }

  shiftRight() {
    for (let i = 0; i < 4; i++) {
      for (let j = 2; j >= 0; j--) {
        if (this.gameBoard[i][j] === 0) {
          continue;
        } else {
          const n = this.gameBoard[i][j];

          if (this.gameBoard[i][j + 1] === 0) {
            this.gameBoard[i][j + 1] = n;
            this.gameBoard[i][j] = 0;

            this.board.rows[i].cells[j].textContent = null;
            this.board.rows[i].cells[j].classList = 'field-cell';

            this.board.rows[i].cells[j + 1].textContent = n;
            this.board.rows[i].cells[j + 1].classList.toggle(this.name + n);
          } else if (this.gameBoard[i][j + 1] === n) {
            this.gameBoard[i][j + 1] = n * 2;
            this.gameBoard[i][j] = 0;

            this.board.rows[i].cells[j].textContent = null;
            this.board.rows[i].cells[j].classList = 'field-cell';

            this.board.rows[i].cells[j + 1].textContent = n * 2;
            this.board.rows[i].cells[j + 1].classList.toggle(this.name + n * 2);

            this.count += n * 2;
            this.getScore();

            this.checking2048();
          }
        }
      }
    }
  }

  shiftLeft() {
    for (let i = 0; i < 4; i++) {
      for (let j = 1; j <= 3; j++) {
        if (this.gameBoard[i][j] === 0) {
          continue;
        } else {
          const n = this.gameBoard[i][j];

          if (this.gameBoard[i][j - 1] === 0) {
            this.gameBoard[i][j - 1] = n;
            this.gameBoard[i][j] = 0;

            this.board.rows[i].cells[j].textContent = null;
            this.board.rows[i].cells[j].classList = 'field-cell';

            this.board.rows[i].cells[j - 1].textContent = n;
            this.board.rows[i].cells[j - 1].classList.toggle(this.name + n);
          } else if (this.gameBoard[i][j - 1] === n) {
            this.gameBoard[i][j - 1] = n * 2;
            this.gameBoard[i][j] = 0;

            this.board.rows[i].cells[j].textContent = null;
            this.board.rows[i].cells[j].classList = 'field-cell';

            this.board.rows[i].cells[j - 1].textContent = n * 2;
            this.board.rows[i].cells[j - 1].classList.toggle(this.name + n * 2);

            this.count += n * 2;
            this.getScore();

            this.checking2048();
          }
        }
      }
    }
  }

  shiftUp() {
    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.gameBoard[i][j] === 0) {
          continue;
        } else {
          const n = this.gameBoard[i][j];

          if (this.gameBoard[i - 1][j] === 0) {
            this.gameBoard[i - 1][j] = n;
            this.gameBoard[i][j] = 0;

            this.board.rows[i].cells[j].textContent = null;
            this.board.rows[i].cells[j].classList = 'field-cell';

            this.board.rows[i - 1].cells[j].textContent = n;
            this.board.rows[i - 1].cells[j].classList.toggle(this.name + n);
          } else if (this.gameBoard[i - 1][j] === n) {
            this.gameBoard[i - 1][j] = n * 2;
            this.gameBoard[i][j] = 0;

            this.board.rows[i].cells[j].textContent = null;
            this.board.rows[i].cells[j].classList = 'field-cell';

            this.board.rows[i - 1].cells[j].textContent = n * 2;
            this.board.rows[i - 1].cells[j].classList.toggle(this.name + n * 2);

            this.count += n * 2;
            this.getScore();

            this.checking2048();
          }
        }
      }
    }
  }

  shiftDown() {
    for (let i = 2; i >= 0; i--) {
      for (let j = 0; j < 4; j++) {
        if (this.gameBoard[i][j] === 0) {
          continue;
        } else {
          const n = this.gameBoard[i][j];

          if (this.gameBoard[i + 1][j] === 0) {
            this.gameBoard[i + 1][j] = n;
            this.gameBoard[i][j] = 0;

            this.board.rows[i].cells[j].textContent = null;
            this.board.rows[i].cells[j].classList = 'field-cell';

            this.board.rows[i + 1].cells[j].textContent = n;
            this.board.rows[i + 1].cells[j].classList.toggle(this.name + n);
          } else if (this.gameBoard[i + 1][j] === n) {
            this.gameBoard[i + 1][j] = n * 2;
            this.gameBoard[i][j] = 0;

            this.board.rows[i].cells[j].textContent = null;
            this.board.rows[i].cells[j].classList = 'field-cell';

            this.board.rows[i + 1].cells[j].textContent = n * 2;
            this.board.rows[i + 1].cells[j].classList.toggle(this.name + n * 2);

            this.count += n * 2;
            this.getScore();

            this.checking2048();
          }
        }
      }
    }
  }

  isEmpty() {
    let emptyCell = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.gameBoard[i][j] === 0) {
          emptyCell++;
        }
      }
    }

    if (emptyCell === 0) {
      this.messageLose.classList.toggle('hidden');
      this.messageStart.classList.toggle('hidden');

      this.initialState = 'lose';
    }
  }

  checking2048() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.gameBoard[i][j] < this.num2048) {
          continue;
        } else {
          this.initialState = 'win';
        }
      }
    }
  }
}

module.exports = Game;

'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
import { EMPTY_BOARD, EMPTY_CELL, GAME_STATUSES } from '../constants.js';
import TableColumn from '../scripts/TableColumn.js';
import TableRow from '../scripts/TableRow.js';
import {
  generateRandomIndex,
  isFilledBoard,
  isWinGame,
  rollDie,
} from '../utils.js';
import GameController from './GameController.class.js';
import GameMovement from './GameMovement.class.js';

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

  #score = 0;
  #board = [];
  #isStartGame = false;
  #controller = null;

  constructor(initialState = EMPTY_BOARD) {
    this.tbody = document.querySelector('table tbody');
    this.htmlScore = document.querySelector('.game-score');
    this.messageLose = document.querySelector('.message-lose');
    this.messageWin = document.querySelector('.message-win');
    this.messageStart = document.querySelector('.message-start');
    this.#board = initialState;
    this.#score = 0;
    this.#isStartGame = false;
    this.#controller = null;
  }

  moveLeft() {
    for (let grid = this.#board.length - 1; grid >= 0; grid--) {
      for (let cell = this.#board.length - 1; cell >= 0; cell--) {
        if (this.#board[grid][cell - 1] === this.#board[grid][cell]) {
          this.#board[grid][cell - 1] = this.#board[grid][cell - 1] * 2;
          this.#board[grid][cell] = EMPTY_CELL;
          this.#score += this.#board[grid][cell - 1];
        }

        if (this.#board[grid][cell - 1] === EMPTY_CELL) {
          this.#board[grid][cell - 1] = this.#board[grid][cell];
          this.#board[grid][cell] = EMPTY_CELL;
        }
      }
    }
    this.#getScore();

    this.#updateBoard(this.#board);
  }

  moveRight() {
    for (let grid = 0; grid < this.#board.length; grid++) {
      for (let cell = 0; cell < this.#board.length; cell++) {
        if (this.#board[grid][cell] === this.#board[grid][cell + 1]) {
          this.#board[grid][cell + 1] = this.#board[grid][cell + 1] * 2;
          this.#board[grid][cell] = EMPTY_CELL;
          this.#score += this.#board[grid][cell + 1];
        }

        if (this.#board[grid][cell + 1] === EMPTY_CELL) {
          this.#board[grid][cell + 1] = this.#board[grid][cell];
          this.#board[grid][cell] = EMPTY_CELL;
        }
      }
    }

    this.#getScore();
    this.#updateBoard(this.#board);
  }
  moveUp() {
    for (let grid = this.#board.length - 1; grid >= 1; grid--) {
      for (let cell = this.#board.length - 1; cell >= 0; cell--) {
        if (this.#board[grid][cell] === this.#board[grid - 1][cell]) {
          this.#board[grid - 1][cell] = this.#board[grid - 1][cell] * 2;
          this.#board[grid][cell] = EMPTY_CELL;
          this.#score += this.#board[grid - 1][cell];
        }

        if (this.#board[grid - 1][cell] === EMPTY_CELL) {
          this.#board[grid - 1][cell] = this.#board[grid][cell];
          this.#board[grid][cell] = EMPTY_CELL;
        }
      }
    }

    this.#getScore();
    this.#updateBoard(this.#board);
  }
  moveDown() {
    for (let grid = 0; grid < this.#board.length - 1; grid++) {
      for (let cell = 0; cell < this.#board.length; cell++) {
        if (this.#board[grid][cell] === this.#board[grid + 1][cell]) {
          this.#board[grid + 1][cell] = this.#board[grid + 1][cell] * 2;
          this.#board[grid][cell] = EMPTY_CELL;
          this.#score += this.#board[grid + 1][cell];
        }

        if (this.#board[grid + 1][cell] === EMPTY_CELL) {
          this.#board[grid + 1][cell] = this.#board[grid][cell];
          this.#board[grid][cell] = EMPTY_CELL;
        }
      }
    }

    this.#getScore();
    this.#updateBoard(this.#board);
  }

  /**
   * @returns {number}
   */
  #getScore() {
    this.htmlScore.textContent = this.#score;
  }

  #resetScore() {
    this.#score = 0;
    this.#getScore();
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#board;
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
    const { isMoveLeft, isMoveRight, isMoveDown, isMoveUp } =
      new GameMovement();

    if (!this.#isStartGame) {
      return GAME_STATUSES.idle;
    } else if (
      isFilledBoard(this.#board) &&
      !isMoveLeft(this.#board) &&
      !isMoveRight(this.#board) &&
      !isMoveUp(this.#board) &&
      !isMoveDown(this.#board)
    ) {
      return GAME_STATUSES.lose;
    } else if (isWinGame(this.#board)) {
      return GAME_STATUSES.win;
    } else {
      return GAME_STATUSES.playing;
    }
  }

  showStatus() {
    const gameStatus = this.getStatus();

    if (gameStatus === GAME_STATUSES.win) {
      this.#isStartGame = false;
      this.messageWin.classList.remove('hidden');
    }

    if (gameStatus === GAME_STATUSES.lose) {
      this.#isStartGame = false;
      this.messageLose.classList.remove('hidden');
    }
  }

  /**
   * Starts the game.
   */

  start() {
    this.#isStartGame = true;
    this.messageStart.classList.add('hidden');
    this.#controller = new GameController(this);

    for (let grid = 0; grid < this.#board.length; grid++) {
      for (let cell = 0; cell < this.#board.length; cell++) {
        this.#board[grid][cell] = EMPTY_CELL;
      }
    }

    this.createNewCell();
    this.createNewCell();

    this.#updateBoard(this.#board);
  }

  createNewCell() {
    const emptyCells = [];

    for (let grid = 0; grid < this.#board.length; grid++) {
      for (let cell = 0; cell < this.#board.length; cell++) {
        if (this.#board[grid][cell] === EMPTY_CELL) {
          emptyCells.push({
            x: grid,
            y: cell,
          });
        }
      }
    }

    const randomIndex = generateRandomIndex(emptyCells.length);
    const { x, y } = emptyCells[randomIndex];

    this.#board[x][y] = rollDie() ? 4 : 2;
  }
  /**
   * Resets the game.
   */
  #clearStatus() {
    this.messageLose.classList.add('hidden');
    this.messageWin.classList.add('hidden');
  }

  restart() {
    this.#isStartGame = false;
    this.messageStart.classList.remove('hidden');

    this.#resetScore();
    this.#clearStatus();

    this.#controller.removeController();

    for (let grid = 0; grid < this.#board.length; grid++) {
      for (let cell = 0; cell < this.#board.length; cell++) {
        if (this.#board[grid][cell] !== EMPTY_CELL) {
          this.#board[grid][cell] = EMPTY_CELL;
        }
      }
    }

    this.#updateBoard(this.#board);
  }

  #updateBoard(currentBoard) {
    this.tbody.innerHTML = '';

    for (let grid = 0; grid < currentBoard.length; grid++) {
      const tr = TableRow('field-row');

      for (let cell = 0; cell < currentBoard.length; cell++) {
        const td = TableColumn('field-cell');
        const value = currentBoard[grid][cell];

        td.classList.add('field-cell');

        if (value > EMPTY_CELL) {
          td.classList.add(`field-cell--${value}`);
          td.textContent = value;
        }

        tr.append(td);
      }

      this.tbody.append(tr);
    }
  }
}

export default Game;

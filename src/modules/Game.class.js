'use strict';

// import { getTwoRandom, renderField, resetScore } from './utils.js';
import { Board } from './Board.class.js';
/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = initialState;
    this.board = new Board(); // клас поле
    this.status = 'idle'; // статус гри
    // this.score = 0; // рахунок
    this.start();
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
  getStatus(state) {
    for (let i = 0; i < state.length; i++) {
      const row = [...state[i]];

      for (let j = 0; j < row.length; j++) {
        if (row[j] === 0) {
          this.status = 'playing';

          return 'playing';
        }
      }

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === 2048) {
          this.status = 'win';
          this.board.messageWin.classList.remove('hidden');

          return 'win';
        }
      }
    }

    for (let i = 0; i < state.length - 1; i++) {
      for (let j = 0; j < state[i].length - 1; j++) {
        if (
          state[i][j] === state[i][j + 1] ||
          state[i][j] === state[i + 1][j]
        ) {
          this.status = 'playing';

          return 'playing';
        }
      }
    }

    this.status = 'lose';
    this.board.messageLose.classList.remove('hidden');

    return 'lose';
  }

  updateScore(value) {
    this.score = value;
    this.board.counterInfo.textContent = this.score;
  }
  /**
   * Starts the game.
   */
  start() {
    this.board.startBtn.addEventListener('click', (e) => {
      this.board.score = 0;
      this.board.message.className = 'message-container';
      this.board.startBtn.className = 'button restart';
      this.board.startBtn.textContent = 'Restart';
      this.board.resetMessage();

      if (e.target === this.board.startBtn) {
        this.board.startState();
        this.board.messageStart.classList.add('hidden');
        this.board.counterInfo.textContent = '0';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        this.move(e.key);
      }
    });
  }
  move(direction) {
    switch (direction) {
      case 'ArrowUp':
        this.board.moveUp(this.board.stateMatrix);
        this.getStatus(this.board.stateMatrix);
        this.updateScore(this.board.score);
        break;
      case 'ArrowDown':
        this.board.moveDown(this.board.stateMatrix);
        this.getStatus(this.board.stateMatrix);
        this.updateScore(this.board.score);

        break;
      case 'ArrowLeft':
        this.board.moveLeft(this.board.stateMatrix);
        this.getStatus(this.board.stateMatrix);
        this.updateScore(this.board.score);

        break;
      case 'ArrowRight':
        this.board.moveRight(this.board.stateMatrix);
        this.getStatus(this.board.stateMatrix);
        this.updateScore(this.board.score);

        break;
      default:
        break;
    }
  }
}

module.exports = Game;

'use strict';

import { BOARD_SIZE } from '../scripts/main';

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
    startMsg,
    loseMsgEl,
    winMsgEl,
    backgroundMusic,
    gameOverSound,
    gameVictorySound,
  ) {
    this.startMsg = startMsg;
    this.loseMsgEl = loseMsgEl;
    this.winMsgEl = winMsgEl;
    this.backgroundMusic = backgroundMusic;
    this.gameOverSound = gameOverSound;
    this.gameVictorySound = gameVictorySound;

    // Generate an empty dash board
    this.dash = Array.from({ length: BOARD_SIZE }, () => {
      return Array(BOARD_SIZE).fill(0);
    });
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
    let gameStatus = 'playing';

    if (this.checkLose()) {
      gameStatus = 'lose';
      this.showLoseMsg();
      this.stopBgMusic();
      this.playGameOverSound();
    }

    if (this.checkWin()) {
      gameStatus = 'win';
      this.showWinMsg();
      this.stopBgMusic();
      this.playGameVictorySound();
    }

    return gameStatus;
  }

  /**
   * Checks for win
   * @returns {boolean}
   */
  checkWin() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.dash[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks if the game is still playable or returns true if it is lost.
   * @returns {boolean}
   */
  checkLose() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        // If there's an empty cell, the game isn't lost yet
        if (this.dash[row][col] === 0) {
          return false;
        }

        // Check down (next row, same column)
        if (
          row < BOARD_SIZE - 1 &&
          this.dash[row][col] === this.dash[row + 1][col]
        ) {
          return false;
        }

        // Check right (same row, next column)
        if (
          col < BOARD_SIZE - 1 &&
          this.dash[row][col] === this.dash[row][col + 1]
        ) {
          return false;
        }

        // Check up (previous row, same column)
        if (row > 0 && this.dash[row][col] === this.dash[row - 1][col]) {
          return false;
        }

        // Check left (same row, previous column)
        if (col > 0 && this.dash[row][col] === this.dash[row][col - 1]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Starts the game.
   */
  start() {
    this.startMsg.classList.add('hidden');
    this.playBgMusic();
  }

  /**
   * Shows the lose message by removing the hidden class
   */
  showLoseMsg() {
    if (this.loseMsgEl) {
      this.loseMsgEl.classList.remove('hidden');
    }
  }

  /**
   * Shows the win message by removing the hidden class
   */
  showWinMsg() {
    if (this.winMsgEl) {
      this.winMsgEl.classList.remove('hidden');
    }
  }

  playGameOverSound() {
    if (this.gameOverSound) {
      this.gameOverSound.play();
    }
  }

  playGameVictorySound() {
    if (this.gameVictorySound) {
      this.gameVictorySound.play();
    }
  }

  resetMsgs() {
    if (this.loseMsgEl) {
      this.loseMsgEl.classList.add('hidden');
    }

    if (this.winMsgEl) {
      this.winMsgEl.classList.add('hidden');
    }
  }

  playBgMusic() {
    this.backgroundMusic.play();
  }

  stopBgMusic() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
  }

  setDash(dash) {
    this.dash = dash;
  }
}

module.exports = Game;

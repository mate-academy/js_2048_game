'use strict';

const gameTable = document.querySelector('.game-field');

class Game {
  constructor(initialState) {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {}

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

  start() {
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.updateHtml();

    for (let i = 0; i < 2; i++) {
      let row, col;

      do {
        row = Math.floor(Math.random() * 4);
        col = Math.floor(Math.random() * 4);
      } while (this.state[row][col] !== 0);

      this.state[row][col] = Math.random() < 0.1 ? 4 : 2;

      const cell = gameTable.rows[row].cells[col];

      cell.textContent = this.state[row][col];
    }
  }

  restart() {}

  updateHTML() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = gameTable.rows[row].cells[col];

        cell.textContent = this.state[row][col] || '';
      }
    }
  }
}

// module.exports = Game;

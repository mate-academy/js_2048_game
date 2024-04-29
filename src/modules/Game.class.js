'use strict';

const BOARD_SIZE = 4;

class Game {
  constructor(
    board = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 2],
    ],
  ) {
    this.board = board;
  }

  Slide() {
    // const previosBoard = this.board.forEach((outer) =>
    //   outer.forEach((inner) => inner),
    // );

    for (let row = 0; row < BOARD_SIZE; row++) {
      let MargedTile;

      for (let tile = 1; tile < BOARD_SIZE; tile++) {
        if (this.board[row][tile] > 0) {
          let howFarMove = 0;

          while (this.board[row][tile - howFarMove - 1] === 0) {
            howFarMove++;
          }

          if (
            this.board[row][tile] === this.board[row][tile - howFarMove - 1] &&
            tile - howFarMove - 1 !== MargedTile
          ) {
            howFarMove++;
            MargedTile = tile - howFarMove;

            this.board[row][tile - howFarMove] =
              this.board[row][tile] + this.board[row][tile - howFarMove];
          } else {
            this.board[row][tile - howFarMove] = this.board[row][tile];
          }

          if (tile - howFarMove !== tile) {
            this.board[row][tile] = 0;
          }
        }
      }
    }
  }

  moveLeft() {
    this.Slide();
    this.setBoard();
  }

  moveRight() {
    this.#reverse();
    this.Slide();
    this.#reverse();
    this.setBoard();
  }

  moveUp() {
    this.#rotate();
    this.Slide();
    this.#rotate();
    this.setBoard();
  }

  moveDown() {
    this.#rotate();
    this.moveRight();
    this.#rotate();
    this.setBoard();
  }

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

  /**
   * Starts the game.
   */
  start() {}

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
  }

  canMove() {}

  setBoard() {
    const cells = document.querySelectorAll('.field-cell');
    let cellIndex = 0;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cellValue = this.board[row][col];

        if (cellValue !== 0) {
          cells[cellIndex].textContent = cellValue;
          cells[cellIndex].classList.add(`field-cell--${cellValue}`);
        } else {
          cells[cellIndex].className = 'field-cell';
          cells[cellIndex].textContent = '';
        }

        cellIndex++;
      }
    }
  }

  #reverse() {
    this.board.forEach((row) => row.reverse());
  }

  #rotate() {
    this.board = this.board.map((row, i) => {
      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        newRow.push(this.board[j][i]);
      }

      return newRow;
    });
  }

  // Add your own methods here
}

module.exports = Game;

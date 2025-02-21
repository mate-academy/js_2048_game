'use strict';

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
  static Status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.clear = initialState;
    this.size = 4;
    this.score = 0;
    this.status = Game.Status.idle;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let newRow = this.board[r];

      newRow = this.slide(newRow);

      if (newRow.toString() !== this.board[r].toString()) {
        this.board[r] = newRow;

        moved = true;
      }
    }

    if (moved) {
      this.getRandomTitle();
      this.checkGameOver();
      this.renderBoard();
    }
  }
  moveRight() {
    let moved = false;

    for (let r = 0; r < this.size; r++) {
      let newRow = this.board[r];

      newRow.reverse();

      newRow = this.slide(newRow);
      newRow.reverse();

      if (newRow.toString() !== this.board[r].reverse().toString()) {
        this.board[r] = newRow;

        moved = true;
      }
    }

    if (moved) {
      this.getRandomTitle();
      this.checkGameOver();
      this.renderBoard();
    }
  }
  moveUp() {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      let newRow = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      newRow = this.slide(newRow);

      for (let r = 0; r < this.size; r++) {
        if (newRow[r].toString() !== this.board[r][c].toString()) {
          moved = true;
        }
        this.board[r][c] = newRow[r];
      }
    }

    if (moved) {
      this.getRandomTitle();
      this.checkGameOver();
      this.renderBoard();
    }
  }
  moveDown() {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      let newRow = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      newRow.reverse();
      newRow = this.slide(newRow);
      newRow.reverse();

      for (let r = 0; r < this.size; r++) {
        if (newRow[r].toString() !== this.board[r][c].toString()) {
          moved = true;
        }
        this.board[r][c] = newRow[r];
      }
    }

    if (moved) {
      this.getRandomTitle();
      this.checkGameOver();
      this.renderBoard();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
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
    this.status = Game.Status.playing;
    this.getRandomTitle();
    this.getRandomTitle();
    this.renderBoard();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = Game.Status.idle;
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.renderBoard();
  }

  renderBoard() {
    const table = document.querySelector('.game-field');

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        table.rows[r].cells[c].textContent = '';
        table.rows[r].cells[c].classList.value = '';
        table.rows[r].cells[c].classList.add('field-cell');

        if (this.board[r][c] > 0) {
          table.rows[r].cells[c].textContent = this.board[r][c];

          table.rows[r].cells[c].classList.add(
            `field-cell--${this.board[r][c]}`,
          );
        }
      }
    }
  }

  getRandomTitle() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ x: r, y: c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { x, y } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slide(row) {
    let newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;

        newRow[i + 1] = 0;
        this.score += newRow[i];
      }
    }

    newRow = newRow.filter((val) => val !== 0);

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  checkGameOver() {
    if (!this.hasMoves()) {
      this.status = Game.Status.lose;
    } else if (this.hasWon()) {
      this.status = Game.Status.win;
    }
  }

  hasMoves() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }

        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }
  }

  hasWon() {
    return this.board.some((row) => row.includes(2048));
  }
}

module.exports = Game;

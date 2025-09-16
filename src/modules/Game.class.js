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
    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const result = [];

    for (const cell of this.board) {
      const filtred = cell.filter((num) => num !== 0);

      for (let i = 0; i < filtred.length; i++) {
        if (filtred[i] === filtred[i + 1]) {
          filtred[i] = filtred[i] + filtred[i + 1];
          this.score += filtred[i];
          filtred[i + 1] = 0;
          i++;
        }
      }

      const compacted = filtred.filter((n) => n !== 0);

      while (compacted.length !== 4) {
        compacted.push(0);
      }

      result.push(compacted);
    }

    this.board = result;
  }
  moveRight() {
    const result = [];

    for (const cell of this.board) {
      const filtred = cell.filter((num) => num !== 0);

      for (let i = filtred.length; i > 0; i--) {
        if (filtred[i] === filtred[i - 1]) {
          filtred[i] = filtred[i] + filtred[i - 1];
          this.score += filtred[i];
          filtred[i - 1] = 0;
          i--;
        }
      }

      const compacted = filtred.filter((n) => n !== 0);

      while (compacted.length !== 4) {
        compacted.unshift(0);
      }

      result.push(compacted);
    }

    this.board = result;
  }
  moveUp() {
    // Ітеруємося по кожному стовпцю поля
    for (let col = 0; col < 4; col++) {
      // Створюємо масив для поточного стовпця
      const column = [];

      // Збираємо всі значення з поточного стовпця (від кожного рядка)
      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      // Видаляємо всі нулі зі стовпця (зсуваємо числа вгору)
      const filtred = column.filter((num) => num !== 0);

      for (let i = 0; i < filtred.length; i++) {
        if (filtred[i] === filtred[i + 1]) {
          filtred[i] = filtred[i] + filtred[i + 1];
          this.score += filtred[i];
          filtred[i + 1] = 0;
          i++;
        }
      }

      const compacted = filtred.filter((n) => n !== 0);

      // Додаємо нулі в кінець, щоб довжина стовпця залишалась 4
      while (compacted.length !== 4) {
        compacted.push(0);
      }

      // Записуємо оброблені значення назад у поле
      for (let row = 0; row < 4; row++) {
        this.board[row][col] = compacted[row];
      }
    }
  }
  moveDown() {
    // Ітеруємося по кожному стовпцю поля
    for (let col = 0; col < 4; col++) {
      // Створюємо масив для поточного стовпця
      const column = [];

      // Збираємо всі значення з поточного стовпця (від кожного рядка)
      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      // Видаляємо всі нулі зі стовпця (зсуваємо числа вгору)
      const filtred = column.filter((num) => num !== 0);

      for (let i = filtred.length; i > 0; i--) {
        if (filtred[i] === filtred[i - 1]) {
          filtred[i] = filtred[i] + filtred[i - 1];
          this.score += filtred[i];
          filtred[i - 1] = 0;
          i--;
        }
      }

      const compacted = filtred.filter((n) => n !== 0);

      // Додаємо нулі в початок, щоб довжина стовпця залишалась 4
      while (compacted.length !== 4) {
        compacted.unshift(0);
      }

      // Записуємо оброблені значення назад у поле
      for (let row = 0; row < 4; row++) {
        this.board[row][col] = compacted[row];
      }
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
    const emptyCalls = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let r = 0; r < this.board[i].length; r++) {
        if (this.board[i][r] === 0) {
          emptyCalls.push([i, r]);
        }
      }
    }

    const firstIndex = Math.floor(Math.random() * emptyCalls.length);
    const firstCell = emptyCalls[firstIndex];

    emptyCalls.splice(firstIndex, 1);

    const secondIndex = Math.floor(Math.random() * emptyCalls.length);
    const secondCell = emptyCalls[secondIndex];
    const randomCellFirts = Math.random() < 0.9 ? 2 : 4;
    const randomCellSecond = Math.random() < 0.9 ? 2 : 4;

    this.board[firstCell[0]][firstCell[1]] = randomCellFirts;
    this.board[secondCell[0]][secondCell[1]] = randomCellSecond;
    this.status = 'playing';
  }

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

    this.start();
    this.score = 0;
  }

  addRandomCell() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];
    const randomCell = Math.random() < 0.9 ? 2 : 4;

    this.board[cell[0]][cell[1]] = randomCell;
  }

  isBoardChanged(prev, next) {
    for (let i = 0; i < prev.length; i++) {
      for (let j = 0; j < prev[i].length; j++) {
        if (prev[i][j] !== next[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  hasAvailabelMoves() {
    if (this.board.some((row) => row.includes(0))) {
      return true;
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (
          j + 1 < this.board[i].length &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return true;
        }

        if (
          i + 1 < this.board.length &&
          j < this.board[i + 1].length &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          return true;
        }
      }
    }

    this.status = 'lose';

    return false;
  }

  checkWin() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

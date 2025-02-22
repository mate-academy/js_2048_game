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
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle'; // Гра починається у стані "idle"

    this.board = initialState
      ? initialState.map((row) => [...row]) // Копіюємо передане initialState
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));
    // Створюємо порожню дошку

    // **Прибираємо додавання випадкових плиток!**
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < this.size; row++) {
      let newRow = this.compress(this.board[row]);
      const mergedRow = this.merge(newRow);

      newRow = this.compress(mergedRow);

      if (!this.arraysEqual(this.board[row], newRow)) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const reversedRow = [...this.board[row]].reverse();
      let newRow = this.compress(reversedRow);
      const mergedRow = this.merge(newRow);

      newRow = this.compress(mergedRow).reverse();

      if (!this.arraysEqual(this.board[row], newRow)) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    this.board = this.transpose(this.board);
    this.moveRight();
    this.board = this.transpose(this.board);
  }

  arraysEqual(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((val, index) => val === arr2[index])
    );
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Array.from(
      { length: this.size },
      () => Array(this.size).fill(0),
      // eslint-disable-next-line function-paren-newline
    );
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  compress(row) {
    const filtered = row.filter((v) => v !== 0); // Видаляємо всі 0
    const zeros = Array(this.size - filtered.length).fill(0);
    // Додаємо їх у кінець

    return [...filtered, ...zeros]; // Тепер всі числа зсунуті вліво
  }

  merge(row) {
    for (let i = 0; i < this.size - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    return row;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  checkGameOver() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.board.some((row) => row.includes(0))) {
      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return;
        }
      }
    }

    for (let c = 0; c < this.size; c++) {
      for (let r = 0; r < this.size - 1; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;

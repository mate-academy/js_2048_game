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

  #board;
  #score;
  #status;
  #initialState;

  constructor(initialState) {
    this.#initialState = initialState || this.#createEmptyBoard();
    this.#board = JSON.parse(JSON.stringify(this.#initialState));
    this.#score = 0;
    this.#status = 'idle'; // 'idle' / 'playing' / 'win' / 'lose'
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    this.#move('left');
  }
  moveRight() {
    this.#move('right');
  }
  moveUp() {
    this.#move('up');
  }
  moveDown() {
    this.#move('down');
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return JSON.parse(JSON.stringify(this.#board));
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.#status === 'idle' || this.#status === 'lose') {
      this.#board = JSON.parse(JSON.stringify(this.#initialState));
      this.#addRandomTile();
      this.#addRandomTile();
      this.#score = 0;
      this.#status = 'playing';
    }
  }
  /**
   * Resets the game.
   */
  restart() {
    this.#board = JSON.parse(JSON.stringify(this.#initialState));
    this.#score = 0;
    this.#status = 'playing';
    this.#addRandomTile();
    this.#addRandomTile();
  }

  // Add your own methods here

  #createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  #addRandomTile() {
    const emptyCell = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.#board[r][c] === 0) {
          emptyCell.push([r, c]);
        }
      }
    }

    if (emptyCell.length === 0) {
      return;
    }

    const [row, col] = emptyCell[Math.floor(Math.random() * emptyCell.length)];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.#board[row][col] = value;
  }

  #compressAndMerge(row) {
    const original = [...row];
    const nonZero = row.filter((v) => v !== 0);
    const newRow = [];
    let scoreGained = 0;

    for (let i = 0; i < nonZero.length; i++) {
      if (nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;

        newRow.push(merged);
        scoreGained += merged;
        i++;
      } else {
        newRow.push(nonZero[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    const changed = JSON.stringify(original) !== JSON.stringify(newRow);

    return { newRow, scoreGained, changed };
  }

  #move(direction) {
    if (this.#status !== 'playing') {
      return;
    }

    const clone = (b) => JSON.parse(JSON.stringify(b));
    const reverseRows = (m) => m.map((r) => [...r].reverse());
    const transpose = (m) => m[0].map((_, i) => m.map((r) => r[i]));

    let board = clone(this.#board);
    let moved = false;
    let gainedScore = 0;

    // нормалізація: робимо всі рухи "вліво"
    if (direction === 'right') {
      board = reverseRows(board);
    } else if (direction === 'up') {
      board = transpose(board);
    } else if (direction === 'down') {
      board = transpose(board);
      board = reverseRows(board);
    }

    const newBoard = board.map((row) => {
      const { newRow, scoreGained, changed } = this.#compressAndMerge(row);

      if (changed) {
        moved = true;
      }
      gainedScore += scoreGained;

      return newRow;
    });

    // повертаємо матрицю у початкову орієнтацію
    let result = newBoard;

    if (direction === 'right') {
      result = reverseRows(result);
    } else if (direction === 'up') {
      result = transpose(result);
    } else if (direction === 'down') {
      result = reverseRows(result);
      result = transpose(result);
    }

    const prev = JSON.stringify(this.#board);

    this.#board = result;
    this.#score += gainedScore;

    if (moved && prev !== JSON.stringify(this.#board)) {
      this.#checkWin();

      if (this.#status !== 'win') {
        this.#addRandomTile();
      }

      this.#checkLose();
    }
  }

  #checkWin() {
    for (const row of this.#board) {
      if (row.includes(2048)) {
        this.#status = 'win';

        return;
      }
    }
  }

  #checkLose() {
    if (this.#board.flat().includes(0)) {
      return;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const val = this.#board[row][col];

        if (
          (row < 3 && this.#board[row + 1][col] === val) ||
          (col < 3 && this.#board[row][col + 1] === val)
        ) {
          return;
        }
      }
    }
    this.#status = 'lose';
  }
}

module.exports = Game;

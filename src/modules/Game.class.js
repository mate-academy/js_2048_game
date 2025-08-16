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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    return this.move((board) => board);
  }
  moveRight() {
    return this.move((board) => board.map((row) => row.reverse()), false, true);
  }
  moveUp() {
    return this.move(this.transpose.bind(this), true);
  }
  moveDown() {
    return this.move(this.transpose.bind(this), true, true);
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
    if (this.status === 'playing') {
      return;
    }

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'plaing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  /**
   * Generic move function.
   *
   * @param {Function} transform - how to transform the board before/after
   * @param {boolean} isTranspose - if true, we transpose rows/columns
   * @param {boolean} reverseRows - if true, reverse rows for down/right
   */

  move(transform, isTranspose = false, reverseRows = false) {
    if (this.status !== 'plaing') {
      return false;
    }

    let moved = false;
    let newBoard = isTranspose ? this.transpose(this.board) : this.board;

    if (reverseRows) {
      newBoard = newBoard.map((row) => row.reverse());
    }

    const processed = newBoard.map((row) => {
      const [newRow, gained, rowMoved] = this.slideAndMerge(row);

      if (rowMoved) {
        moved = true;
      }

      this.score += gained;

      return newRow;
    });

    newBoard = processed;

    if (reverseRows) {
      newBoard = newBoard.map((row) => row.reverse());
    }

    if (isTranspose) {
      newBoard = this.transpose(newBoard);
    }

    if (moved) {
      this.board = newBoard;

      this.addRandomTile();
      this.checkGameStatus();
    }

    return moved;
  }

  slideAndMerge(row) {
    let arr = row.filter((v) => v !== 0);
    let scoreGained = 0;
    let moved = false;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        scoreGained += arr[i];
        arr[i + 1] = 0;
        i++;
      }
    }

    arr = arr.filter((v) => v !== 0);

    while (arr.length < this.size) {
      arr.push(0);
    }

    if (arr.toString() !== row.toString()) {
      moved = true;
    }

    return [arr, scoreGained, moved];
  }

  addRandomTile() {
    const empty = [];

    this.board.forEach((row, a) => {
      row.forEach((val, b) => {
        if (val === 0) {
          empty.push([a, b]);
        }
      });
    });

    if (empty.length === 0) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  checkGameStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.hasMoves()) {
      return;
    }

    this.status = 'lose';
  }

  hasMoves() {
    if (this.board.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (
          (r < this.size - 1 && this.board[r + 1][c] === val) ||
          (c < this.size - 1 && this.board[r][c + 1] === val)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(matrix) {
    return matrix[0].map((_, c) => matrix.map((row) => row[c]));
  }
}

export default Game;

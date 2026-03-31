'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
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
    // eslint-disable-next-line no-console
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';

    // console.log(initialState);
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      this.board[r] = this.slide(this.board[r]);
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.addRandomTile();
      this.checkStatus();
    }
  }
  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      let row = [...this.board[r]].reverse();

      row = this.slide(row);
      this.board[r] = row.reverse();
    }

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.addRandomTile();
      this.checkStatus();
    }
  }
  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    this.board = this.transpose(this.board);

    for (let r = 0; r < 4; r++) {
      this.board[r] = this.slide(this.board[r]);
    }

    this.board = this.transpose(this.board);

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.addRandomTile();
      this.checkStatus();
    }
  }
  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    this.board = this.transpose(this.board);

    for (let r = 0; r < 4; r++) {
      let row = [...this.board[r]].reverse();

      row = this.slide(row);
      this.board[r] = row.reverse();
    }

    this.board = this.transpose(this.board);

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.addRandomTile();
      this.checkStatus();
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
    this.status = 'playing';

    const isBoardEmpty = this.board.flat().every((cell) => cell === 0);

    if (isBoardEmpty) {
      this.addRandomTile();
      this.addRandomTile();
    }
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
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  // Add your own methods her
  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.board[rowIndex][colIndex] === 0) {
          emptyCells.push({ r: rowIndex, c: colIndex });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[randomIndex];

    this.board[r][c] = Math.random() > 0.9 ? 4 : 2;
  }

  slide(row) {
    let arr = row.filter((val) => val !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr[i + 1] = 0;
        i++;
      }
    }

    arr = arr.filter((val) => val !== 0);

    while (arr.length < 4) {
      arr.push(0);
    }

    return arr;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  checkStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      this.status = 'playing';

      return;
    }

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        const current = this.board[rowIndex][colIndex];

        if (
          (colIndex < 3 && current === this.board[rowIndex][colIndex + 1]) ||
          (rowIndex < 3 && current === this.board[rowIndex + 1][colIndex])
        ) {
          this.status = 'playing';

          return;
        }
      }
    }
    this.status = 'lose';
  }
}

'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.board = JSON.parse(JSON.stringify(initialState));

    this.status = this.board.reduce((a, b) => [...a, ...b]).includes(2048)
      ? 'win'
      : 'idle';
  }

  score = 0;

  spawnNumber() {
    const emptyCell = [];

    this.board.map((row, rowindex) =>
      row.map((item, index) => {
        if (item === 0) {
          emptyCell.push([rowindex, index]);
        }
        // eslint-disable-next-line prettier/prettier
      }));

    if (emptyCell.length > 0) {
      const randomCell = Math.floor(Math.random() * emptyCell.length);

      const [randRow, randIndex] = emptyCell[randomCell];

      const randomFour = Math.floor(Math.random() * 10);

      this.board[randRow][randIndex] = randomFour === 9 ? 4 : 2;
    }
  }

  rowToColumns(arr) {
    const rotatedArr = [];

    for (let i = 0; i < arr.length; i++) {
      rotatedArr.push([arr[0][i], arr[1][i], arr[2][i], arr[3][i]]);
    }

    return rotatedArr;
  }

  move(reverse = false, vertical = false) {
    let brd = this.board;
    const prevBrd = JSON.parse(JSON.stringify(this.board));

    if (vertical) {
      brd = this.rowToColumns(brd);
    }

    for (let i = 0; i < brd.length; i++) {
      let row = brd[i];

      if (reverse) {
        row = row.filter((item) => item !== 0).reverse();
      } else {
        row = row.filter((item) => item !== 0);
      }

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] += row[j + 1];
          row[j + 1] = 0;

          this.score += row[j];

          if (row[j] === 2048) {
            this.status = 'win';
          }
        }
      }
      row = row.filter((item) => item !== 0);

      for (let j = row.length; j < 4; j++) {
        row.push(0);
      }

      if (reverse) {
        brd[i] = row.reverse();
      } else {
        brd[i] = row;
      }
    }

    if (vertical) {
      brd = this.rowToColumns(brd);
    }

    if (JSON.stringify(brd) === JSON.stringify(prevBrd)) {
      return;
    }

    this.board = brd;

    this.spawnNumber();

    const boardIsFull = !brd
      .reduce((a, b) => [...a, ...b])
      .some((a) => a === 0);

    let hasHorizontalPair = false;
    let hasVerticalPair = false;
    const fullBoardHorizontal = this.board;
    const fullBoardVertical = this.rowToColumns(this.board);

    for (let i = 0; i < fullBoardHorizontal.length; i++) {
      for (let j = 0; j < fullBoardHorizontal[i].length - 1; j++) {
        if (fullBoardHorizontal[i][j] === fullBoardHorizontal[i][j + 1]) {
          hasHorizontalPair = true;
        }
      }
    }

    for (let i = 0; i < fullBoardVertical.length; i++) {
      for (let j = 0; j < fullBoardVertical[i].length - 1; j++) {
        if (fullBoardVertical[i][j] === fullBoardVertical[i][j + 1]) {
          hasVerticalPair = true;
        }
      }
    }

    if (boardIsFull && !hasHorizontalPair && !hasVerticalPair) {
      this.status = 'lose';
    }
  }
  moveLeft() {
    this.move();
  }
  moveRight() {
    this.move(true);
  }
  moveUp() {
    this.move(false, true);
  }
  moveDown() {
    this.move(true, true);
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
    return JSON.parse(JSON.stringify(this.board));
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

    if (this.board.reduce((a, b) => [...a, ...b]).every((a) => a === 0)) {
      this.spawnNumber();
      this.spawnNumber();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.start();
  }
  // Add your own methods here
}

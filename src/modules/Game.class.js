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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    const stateBefore = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.slide(row));

    const stateAfter = JSON.stringify(this.board);

    if (stateBefore !== stateAfter) {
      this.status = 'playing';
      this.addRandomTile();
    }
  }
  moveRight() {
    const stateBefore = JSON.stringify(this.board);

    // eslint-disable-next-line max-len
    this.board = this.board.map((row) =>
      this.slide(row.toReversed()).toReversed(),);

    const stateAfter = JSON.stringify(this.board);

    if (stateBefore !== stateAfter) {
      this.status = 'playing';
      this.addRandomTile();
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, columnIndex) =>
      matrix.map((row) => row[columnIndex]));
  }

  moveUp() {
    const stateBefore = JSON.stringify(this.board);

    let tempBoard = this.transpose(this.board);

    tempBoard = tempBoard.map((row) => this.slide(row));
    this.board = this.transpose(tempBoard);

    const stateAfter = JSON.stringify(this.board);

    if (stateBefore !== stateAfter) {
      this.status = 'playing';
      this.addRandomTile();
    }
  }
  moveDown() {
    const stateBefore = JSON.stringify(this.board);

    let tempBoard = this.transpose(this.board);

    tempBoard = tempBoard.map((row) =>
      this.slide(row.toReversed()).toReversed(),
    );
    this.board = this.transpose(tempBoard);

    const stateAfter = JSON.stringify(this.board);

    if (stateBefore !== stateAfter) {
      this.status = 'playing';
      this.addRandomTile();
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      // eslint-disable-next-line max-len
      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
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
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }

    if (!this.board.flat().includes(0) && !this.canMove()) {
      this.status = 'lose';
    }

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
    this.score = 0;
    this.status = 'playing';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
    this.addRandomTile();
  }

  canMove() {
    if (this.board.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c < 3 && current === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  slide(row) {
    const list = row.filter((x) => x !== 0);

    for (let i = 0; i < list.length - 1; i++) {
      if (list[i] === list[i + 1]) {
        list[i] *= 2;
        this.score += list[i];
        list.splice(i + 1, 1);
      }
    }

    while (list.length < 4) {
      list.push(0);
    }

    return list;
  }
}

export default Game;

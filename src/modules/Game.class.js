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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    // eslint-disable-next-line no-console
    this.board = initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) => this.slideAndMerge(row));

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.spawnRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    this.board = this.board.map((row) => {
      return this.slideAndMerge([...row].reverse()).reverse();
    });

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.spawnRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    let transposedBoard = this.transpose(this.board);

    transposedBoard = transposedBoard.map((row) => this.slideAndMerge(row));

    this.board = this.transpose(transposedBoard);

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.spawnRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    let transposedBoard = this.transpose(this.board);

    transposedBoard = transposedBoard.map((row) => {
      return this.slideAndMerge([...row].reverse()).reverse();
    });

    this.board = this.transpose(transposedBoard);

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this.spawnRandomTile();
      this.updateStatus();
    }
  }

  slideAndMerge(row) {
    let filteredRow = row.filter((cell) => cell > 0);

    for (let cell = 0; cell < filteredRow.length; cell++) {
      if (filteredRow[cell] === filteredRow[cell + 1]) {
        filteredRow[cell] = filteredRow[cell] * 2;
        filteredRow[cell + 1] = 0;

        this.score += filteredRow[cell];
      }
    }

    filteredRow = filteredRow.filter((cell) => cell > 0);

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
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
    this.spawnRandomTile();
    this.spawnRandomTile();
  }

  spawnRandomTile = () => {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      const randomNumber = Math.random() < 0.1 ? 4 : 2;

      this.board[randomCell.r][randomCell.c] = randomNumber;
    }
  };

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
    this.status = 'playing';
    this.spawnRandomTile();
    this.spawnRandomTile();
  }

  updateStatus() {
    const winScore = this.board.flat().find((cell) => cell === 2048);

    if (winScore) {
      this.status = 'win';

      return this.status;
    }

    if (this.board.flat().includes(0)) {
      this.status = 'playing';

      return this.status;
    } else {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
            this.status = 'playing';

            return this.status;
          }

          if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
            this.status = 'playing';

            return this.status;
          }
        }
      }

      this.status = 'lose';

      return this.status;
    }
  }
}

module.exports = Game;

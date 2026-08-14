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
      this.initialState = JSON.parse(JSON.stringify(initialState));
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  slideRowLeft(row) {
    const filtered = row.filter((value) => value !== 0);
    const merged = [];
    let i = 0;
    let points = 0;

    while (i < filtered.length) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        points += filtered[i] * 2;
        i += 2;
      } else {
        merged.push(filtered[i]);
        i += 1;
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return { row: merged, points };
  }

  reverseRow(row) {
    return [...row].reverse();
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const beforeGame = JSON.stringify(this.board);
    let totalPoints = 0;

    for (let row = 0; row < 4; row++) {
      const result = this.slideRowLeft(this.board[row]);

      this.board[row] = result.row;
      totalPoints += result.points;
    }

    this.score += totalPoints;

    const afterGame = JSON.stringify(this.board);

    if (beforeGame !== afterGame) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const beforeGame = JSON.stringify(this.board);
    let totalPoints = 0;

    for (let row = 0; row < 4; row++) {
      const reversedRow = this.reverseRow(this.board[row]);
      const result = this.slideRowLeft(reversedRow);

      this.board[row] = this.reverseRow(result.row);

      totalPoints += result.points;
    }

    this.score += totalPoints;

    const afterGame = JSON.stringify(this.board);

    if (beforeGame !== afterGame) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const beforeGame = JSON.stringify(this.board);
    let totalPoints = 0;

    for (let col = 0; col < 4; col++) {
      const column = this.board.map((row) => row[col]);
      const result = this.slideRowLeft(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = result.row[row];
      }
      totalPoints += result.points;
    }
    this.score += totalPoints;

    const afterGame = JSON.stringify(this.board);

    if (beforeGame !== afterGame) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const beforeGame = JSON.stringify(this.board);
    let totalPoints = 0;

    for (let col = 0; col < 4; col++) {
      const column = this.board.map((row) => row[col]);
      const reversedColumn = this.reverseRow(column);
      const result = this.slideRowLeft(reversedColumn);
      const finalColumn = this.reverseRow(result.row);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = finalColumn[row];
      }
      totalPoints += result.points;
    }
    this.score += totalPoints;

    const afterGame = JSON.stringify(this.board);

    if (beforeGame !== afterGame) {
      this.addRandomTile();
      this.checkWin();
      this.checkGameOver();
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
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row: newRow, col: newCol } = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[newRow][newCol] = value;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (col < 3 && current === this.board[row][col + 1]) {
          return;
        }

        if (row < 3 && current === this.board[row + 1][col]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }
}
module.exports = Game;

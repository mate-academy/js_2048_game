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
    this.boardSize = 4;
    this.initialState = initialState;
    this.restart();
  }

  moveLeft() {
    return this.processMove(() => {
      let gained = 0;

      for (let i = 0; i < this.boardSize; i++) {
        const { newRow, rowScore } = this.slideAndMergeRow(this.board[i]);

        this.board[i] = newRow;
        gained += rowScore;
      }

      return gained;
    });
  }

  moveRight() {
    return this.processMove(() => {
      let gained = 0;

      for (let i = 0; i < this.boardSize; i++) {
        const reversed = [...this.board[i]].reverse();
        const { newRow, rowScore } = this.slideAndMergeRow(reversed);

        this.board[i] = [...newRow].reverse();
        gained += rowScore;
      }

      return gained;
    });
  }

  moveUp() {
    return this.processMove(() => {
      let gained = 0;

      for (let c = 0; c < this.boardSize; c++) {
        const column = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];
        const { newRow, rowScore } = this.slideAndMergeRow(column);

        for (let r = 0; r < this.boardSize; r++) {
          this.board[r][c] = newRow[r];
        }
        gained += rowScore;
      }

      return gained;
    });
  }

  moveDown() {
    return this.processMove(() => {
      let gained = 0;

      for (let c = 0; c < this.boardSize; c++) {
        const column = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];
        const reversed = [...column].reverse();

        const { newRow, rowScore } = this.slideAndMergeRow(reversed);
        const finalColumn = [...newRow].reverse();

        for (let r = 0; r < this.boardSize; r++) {
          this.board[r][c] = finalColumn[r];
        }
        gained += rowScore;
      }

      return gained;
    });
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
    this.score = 0;
    this.status = 'idle';

    this.board = this.initialState
      ? this.initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
  }

  isBoardEmpty() {
    return this.board.every((row) => row.every((cell) => cell === 0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { i, j } = emptyCells[randomIndex];

      this.board[i][j] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  slideAndMergeRow(row) {
    const filtered = row.filter((val) => val !== 0);
    const newRow = [];
    let rowScore = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const newValue = filtered[i] * 2;

        newRow.push(newValue);
        rowScore += newValue;
        i++;
      } else {
        newRow.push(filtered[i]);
      }
    }

    while (newRow.length < this.boardSize) {
      newRow.push(0);
    }

    return { newRow, rowScore };
  }

  boardsEqual(a, b) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (a[i][j] !== b[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  processMove(moveFn) {
    if (this.status !== 'playing') {
      return false;
    }

    const beforeBoard = this.board.map((row) => [...row]);
    const gainedScore = moveFn();

    if (this.boardsEqual(beforeBoard, this.board) === false) {
      this.score += gainedScore;
      this.addRandomTile();
      this.updateGameStatus();

      return true;
    }

    return false;
  }

  updateGameStatus() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;

'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static Status = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };
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
    // deep copy to avoid shared references
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();

    this.board = this.initialState.map((row) => [...row]);

    this.score = 0;
    this.status = Game.Status.IDLE;
  }

  // #region [BOARD SETUP HELPERS] ------------------------->
  createEmptyBoard() {
    return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  }

  getTransposedBoard(board) {
    const transposed = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        transposed[row][col] = board[col][row];
      }
    }

    return transposed;
  }
  // #endregion

  // #region [RANDOM TILE LOGIC] --------------------------->
  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  getRandomEmptyCell() {
    const emptyCells = this.getEmptyCells();
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  getRandomValue() {
    const chance = Math.random();

    return chance <= 0.9 ? 2 : 4;
  }

  addRandomTile() {
    const cell = this.getRandomEmptyCell();

    if (!cell) {
      return;
    }

    const value = this.getRandomValue();

    this.board[cell.row][cell.col] = value;
  }
  // #endregion

  // #region [ROW TRANSFORMATION LOGIC] -------------------->
  mergeRow(row) {
    const merged = [];
    let scoreGained = 0;
    let i = 0;

    while (i < row.length) {
      if (row[i] === row[i + 1]) {
        const mergedValue = row[i] * 2;

        merged.push(mergedValue);
        scoreGained += mergedValue;
        i += 2;
      } else {
        merged.push(row[i]);
        i += 1;
      }
    }

    return { merged, scoreGained };
  }

  transformRow(row) {
    const withoutZeros = row.filter((value) => value !== 0);
    const { merged, scoreGained } = this.mergeRow(withoutZeros);

    const zerosCount = 4 - merged.length;
    const zeros = Array(zerosCount).fill(0);
    const newRow = [...merged, ...zeros];

    return { newRow, scoreGained };
  }
  // #endregion

  // #region [MOVE METHODS] -------------------------------->
  applyMove(newBoard, totalScore) {
    const hasChanged = JSON.stringify(this.board) !== JSON.stringify(newBoard);

    if (hasChanged) {
      this.board = newBoard;
      this.score += totalScore;
      this.addRandomTile();

      if (this.hasWinningTile()) {
        this.status = Game.Status.WIN;
      } else if (this.hasLosingTile()) {
        this.status = Game.Status.LOSE;
      } else {
        this.status = Game.Status.PLAYING;
      }
    } else if (this.hasLosingTile()) {
      this.status = Game.Status.LOSE;
    }
  }

  moveLeft() {
    const { newBoard, totalScore } = this.board.reduce(
      (acc, row) => {
        const { newRow, scoreGained } = this.transformRow(row);

        acc.newBoard.push(newRow);
        acc.totalScore += scoreGained;

        return acc;
      },
      { newBoard: [], totalScore: 0 },
    );

    this.applyMove(newBoard, totalScore);
  }

  moveRight() {
    const { newBoard, totalScore } = this.board.reduce(
      (acc, row) => {
        const reversedRow = [...row].reverse();
        const { newRow, scoreGained } = this.transformRow(reversedRow);
        const finalRow = [...newRow].reverse();

        acc.newBoard.push(finalRow);
        acc.totalScore += scoreGained;

        return acc;
      },
      { newBoard: [], totalScore: 0 },
    );

    this.applyMove(newBoard, totalScore);
  }

  moveUp() {
    const transposedBoard = this.getTransposedBoard(this.board);

    const { newBoard, totalScore } = transposedBoard.reduce(
      (acc, row) => {
        const { newRow, scoreGained } = this.transformRow(row);

        acc.newBoard.push(newRow);
        acc.totalScore += scoreGained;

        return acc;
      },
      { newBoard: [], totalScore: 0 },
    );

    const finalBoard = this.getTransposedBoard(newBoard);

    this.applyMove(finalBoard, totalScore);
  }

  moveDown() {
    const transposedBoard = this.getTransposedBoard(this.board);

    const { newBoard, totalScore } = transposedBoard.reduce(
      (acc, row) => {
        const reversedRow = [...row].reverse();
        const { newRow, scoreGained } = this.transformRow(reversedRow);
        const finalRow = [...newRow].reverse();

        acc.newBoard.push(finalRow);
        acc.totalScore += scoreGained;

        return acc;
      },
      { newBoard: [], totalScore: 0 },
    );

    const finalBoard = this.getTransposedBoard(newBoard);

    this.applyMove(finalBoard, totalScore);
  }
  // #endregion

  // #region [GAME STATE CHECKS] --------------------------->
  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  hasWinningTile() {
    return this.board.some((row) => row.includes(2048));
  }

  hasLosingTile() {
    return !this.canMove();
  }
  // #endregion

  // #region [GAME INFO] ----------------------------------->
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
    return this.board.map((row) => [...row]);
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
    this.status = Game.Status.PLAYING;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.Status.IDLE;
  }
  // #endregion
}

module.exports = Game;

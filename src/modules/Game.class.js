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
    this.score = 0;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  moveLeft() {
    const originalBoard = JSON.parse(JSON.stringify(this.board));

    for (let row = 0; row < 4; row++) {
      this.board[row] = this.moveAndMergeLeft(this.board[row]);
    }

    if (this.isDifferentBoard(originalBoard)) {
      this.addRandomTile();
    }
  }

  moveRight() {
    const originalBoard = JSON.parse(JSON.stringify(this.board));

    for (let row = 0; row < 4; row++) {
      this.board[row] = this.moveAndMergeRight(this.board[row]);
    }

    if (this.isDifferentBoard(originalBoard)) {
      this.addRandomTile();
    }
  }

  moveUp() {
    const originalBoard = JSON.parse(JSON.stringify(this.board));
    const transposedBoard = this.transposeBoard(this.board);

    for (let row = 0; row < 4; row++) {
      transposedBoard[row] = this.moveAndMergeLeft(transposedBoard[row]);
    }

    this.board = this.transposeBoard(transposedBoard);

    if (this.isDifferentBoard(originalBoard)) {
      this.addRandomTile();
    }
  }

  moveDown() {
    const originalBoard = JSON.parse(JSON.stringify(this.board));
    const transposedBoard = this.transposeBoard(this.board);

    for (let row = 0; row < 4; row++) {
      transposedBoard[row] = this.moveAndMergeRight(transposedBoard[row]);
    }
    this.board = this.transposeBoard(transposedBoard);

    if (this.isDifferentBoard(originalBoard)) {
      this.addRandomTile();
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
    let allZeros = true;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          return 'win';
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== 0) {
          allZeros = false;
          break;
        }
      }

      if (!allZeros) {
        break;
      }
    }

    if (allZeros) {
      return 'idle';
    }

    if (this.hasPossibleMoves()) {
      return 'playing';
    } else {
      return 'lose';
    }
  }

  /**
   * Starts the game.
   */

  start() {
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        this.board[row][col] = 0;
      }
    }
    this.start();
  }

  // Add your own methods here

  moveAndMergeLeft(line) {
    const currentRow = line;
    const nonZero = currentRow.filter((cell) => cell !== 0);
    const mergedFlags = new Array(nonZero.length).fill(false);

    for (let i = 0; i < nonZero.length - 1; i++) {
      if (
        nonZero[i] === nonZero[i + 1] &&
        !mergedFlags[i] &&
        !mergedFlags[i + 1]
      ) {
        nonZero[i] *= 2;
        this.score += nonZero[i];
        nonZero.splice(i + 1, 1);
        mergedFlags.splice(i + 1, 1);
        mergedFlags[i] = true;
        i--;
      }
    }

    const zerosToAdd = 4 - nonZero.length;
    const newRow = [...nonZero];

    for (let i = 0; i < zerosToAdd; i++) {
      newRow.push(0);
    }

    return newRow;
  }

  moveAndMergeRight(line) {
    const currentRow = line;
    const nonZero = currentRow.filter((cell) => cell !== 0);
    const mergedFlags = new Array(nonZero.length).fill(false);

    for (let i = nonZero.length - 1; i > 0; i--) {
      if (
        nonZero[i] === nonZero[i - 1] &&
        !mergedFlags[i] &&
        !mergedFlags[i - 1]
      ) {
        nonZero[i] *= 2;
        this.score += nonZero[i];
        nonZero.splice(i - 1, 1);
        mergedFlags.splice(i - 1, 1);
        mergedFlags[i] = true;
      }
    }

    const zerosToAdd = 4 - nonZero.length;
    const newRow = [];

    for (let i = 0; i < zerosToAdd; i++) {
      newRow.push(0);
    }

    newRow.push(...nonZero);

    return newRow;
  }

  moveAndMergeLeftSimulate(line) {
    const currentRow = line;
    const nonZero = currentRow.filter((cell) => cell !== 0);
    const mergedFlags = new Array(nonZero.length).fill(false);

    for (let i = 0; i < nonZero.length - 1; i++) {
      if (
        nonZero[i] === nonZero[i + 1] &&
        !mergedFlags[i] &&
        !mergedFlags[i + 1]
      ) {
        nonZero[i] *= 2;
        nonZero.splice(i + 1, 1);
        mergedFlags.splice(i + 1, 1);
        mergedFlags[i] = true;
        i--;
      }
    }

    const zerosToAdd = 4 - nonZero.length;
    const newRow = [...nonZero];

    for (let i = 0; i < zerosToAdd; i++) {
      newRow.push(0);
    }

    return newRow;
  }

  moveAndMergeRightSimulate(line) {
    const currentRow = line;
    const nonZero = currentRow.filter((cell) => cell !== 0);
    const mergedFlags = new Array(nonZero.length).fill(false);

    for (let i = nonZero.length - 1; i > 0; i--) {
      if (
        nonZero[i] === nonZero[i - 1] &&
        !mergedFlags[i] &&
        !mergedFlags[i - 1]
      ) {
        nonZero[i] *= 2;
        nonZero.splice(i - 1, 1);
        mergedFlags.splice(i - 1, 1);
        mergedFlags[i] = true;
      }
    }

    const zerosToAdd = 4 - nonZero.length;
    const newRow = [...nonZero];

    for (let i = 0; i < zerosToAdd; i++) {
      newRow.push(0);
    }

    return newRow;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      if (Math.random() < 0.9) {
        this.board[row][col] = 2;
      } else {
        this.board[row][col] = 4;
      }
    }
  }

  hasPossibleMoves() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    const simulatedBordLeft = JSON.parse(JSON.stringify(this.board));

    for (let row = 0; row < 4; row++) {
      simulatedBordLeft[row] = this.moveAndMergeLeftSimulate(
        simulatedBordLeft[row],
      );
    }

    if (this.isDifferentBoard(simulatedBordLeft)) {
      return true;
    }

    const simulatedBordRight = JSON.parse(JSON.stringify(this.board));

    for (let row = 0; row < 4; row++) {
      simulatedBordRight[row] = this.moveAndMergeRightSimulate(
        simulatedBordRight[row],
      );
    }

    if (this.isDifferentBoard(simulatedBordRight)) {
      return true;
    }

    const simulatedBordTop = this.transposeBoard(
      JSON.parse(JSON.stringify(this.board)),
    );

    for (let row = 0; row < 4; row++) {
      simulatedBordTop[row] = this.moveAndMergeLeftSimulate(
        simulatedBordTop[row],
      );
    }

    if (this.isDifferentBoard(this.transposeBoard(simulatedBordTop))) {
      return true;
    }

    const simulatedBordDown = this.transposeBoard(
      JSON.parse(JSON.stringify(this.board)),
    );

    for (let row = 0; row < 4; row++) {
      simulatedBordDown[row] = this.moveAndMergeRightSimulate(
        simulatedBordDown[row],
      );
    }

    if (this.isDifferentBoard(this.transposeBoard(simulatedBordDown))) {
      return true;
    }

    return false;
  }

  isDifferentBoard(boardToCompare) {
    const board = boardToCompare;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] !== this.board[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  transposeBoard(board) {
    const newBoard = [];

    for (let i = 0; i < 4; i++) {
      newBoard.push([]);
    }

    for (let row = 0; row < newBoard.length; row++) {
      for (let col = 0; col < newBoard.length; col++) {
        newBoard[col].push(board[row][col]);
      }
    }

    return newBoard;
  }
}

export default Game;

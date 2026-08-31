'use strict';

const BOARD_SIZE = 4;
const FOUR_PROBABILITY = 0.1;
const WINNING_VALUE = 2048;

const createEmptyBoard = () => {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
};

const copyBoard = (board) => {
  return board.map((row) => [...row]);
};

const boardsAreEqual = (boardBefore, boardAfter) => {
  return JSON.stringify(boardBefore) === JSON.stringify(boardAfter);
};

const compressRow = (row) => {
  return row.filter((cell) => cell !== 0);
};

const mergeRow = (row) => {
  const result = [];
  let score = 0;

  for (let i = 0; i < row.length; i++) {
    if (row[i] === row[i + 1]) {
      const merged = row[i] + row[i + 1];

      result.push(merged);
      score += merged;

      i++;
    } else {
      result.push(row[i]);
    }
  }

  return { row: result, score };
};

const padRow = (row) => {
  const result = [...row];

  while (result.length < BOARD_SIZE) {
    result.push(0);
  }

  return result;
};

const moveRowLeft = (row) => {
  const compressed = compressRow(row);
  const { row: merged, score } = mergeRow(compressed);

  return {
    row: padRow(merged),
    score,
  };
};

const transposeBoard = (board) => {
  const result = createEmptyBoard();

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      result[i][j] = board[j][i];
    }
  }

  return result;
};

const reverseBoard = (board) => {
  return board.map((row) => [...row].reverse());
};

const moveBoardLeft = (board) => {
  let totalScore = 0;

  const newBoard = board.map((row) => {
    const result = moveRowLeft(row);

    totalScore += result.score;

    return result.row;
  });

  return {
    board: newBoard,
    score: totalScore,
  };
};

const moveBoardRight = (board) => {
  const reversed = reverseBoard(board);
  const result = moveBoardLeft(reversed);

  return {
    board: reverseBoard(result.board),
    score: result.score,
  };
};

const moveBoardUp = (board) => {
  const transposed = transposeBoard(board);
  const result = moveBoardLeft(transposed);

  return {
    board: transposeBoard(result.board),
    score: result.score,
  };
};

const moveBoardDown = (board) => {
  const transposed = transposeBoard(board);
  const reversed = reverseBoard(transposed);
  const result = moveBoardLeft(reversed);

  return {
    board: transposeBoard(reverseBoard(result.board)),
    score: result.score,
  };
};

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
  constructor(initialState = createEmptyBoard()) {
    this.score = 0;
    this.status = 'idle';
    this.initialState = copyBoard(initialState);
    this.board = copyBoard(initialState);
  }

  moveLeft() {
    this.makeMove(moveBoardLeft);
  }

  moveRight() {
    this.makeMove(moveBoardRight);
  }

  moveUp() {
    this.makeMove(moveBoardUp);
  }

  moveDown() {
    this.makeMove(moveBoardDown);
  }

  makeMove(moveFn) {
    if (this.status !== 'playing') {
      return;
    }

    const { board, score } = moveFn(this.board);

    if (boardsAreEqual(this.board, board)) {
      return;
    }

    this.board = board;
    this.score += score;
    this.addRandomCell();

    if (this.hasWon()) {
      this.status = 'win';
    } else if (this.hasLose()) {
      this.status = 'lose';
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
    return copyBoard(this.board);
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

  hasWon() {
    return this.board.flat().some((el) => el === WINNING_VALUE);
  }

  hasPossibleMerges() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = this.board[row][col];

        if (
          cell !== 0 &&
          (cell === this.board[row][col + 1] ||
            cell === this.board[row + 1]?.[col])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  hasLose() {
    return this.getEmptyCells().length === 0 && !this.hasPossibleMerges();
  }

  getEmptyCells() {
    const result = [];

    for (const [row, cells] of this.board.entries()) {
      for (const [col, cell] of cells.entries()) {
        if (cell === 0) {
          result.push({
            row,
            col,
          });
        }
      }
    }

    return result;
  }

  addRandomCell() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const value = Math.random() < FOUR_PROBABILITY ? 4 : 2;
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = value;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.board = copyBoard(this.initialState);
  }
}

module.exports = Game;

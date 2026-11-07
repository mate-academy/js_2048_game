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
    this.initialState = Game.#_createClone(initialState);
    this.score = 0;
    this.status = 'idle';
    this.state = Game.#_createClone(this.initialState);
    this.winningValue = 2048;
    this.boardSize = 4;
  }

  moveLeft() {
    this.#_move('left');
  }

  moveRight() {
    this.#_move('right');
  }

  moveUp() {
    this.#_move('up');
  }

  moveDown() {
    this.#_move('down');
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
    return Game.#_createClone(this.state);
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
    this.#_addRandomTile();
    this.#_addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = Game.#_createClone(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  static #_createClone(state) {
    return state.map((row) => [...row]);
  }

  #_addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [cellRow, cellCol] = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[cellRow][cellCol] = value;
  }

  #_slideRowLeft(row) {
    const compressed = row.filter((cell) => cell !== 0);
    const merged = [];
    let points = 0;

    for (let i = 0; i < compressed.length; i++) {
      if (compressed[i] === compressed[i + 1]) {
        const value = compressed[i] * 2;

        merged.push(value);
        points += value;
        i += 1;
      } else {
        merged.push(compressed[i]);
      }
    }

    while (merged.length < this.boardSize) {
      merged.push(0);
    }

    return { row: merged, points };
  }

  #_move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const { board, points } = this.#_computeMovedBoard(direction);

    if (this.#_areBoardsEqual(this.state, board)) {
      return;
    }

    this.state = board;
    this.score += points;
    this.#_addRandomTile();

    if (this.#_hasWinningTile()) {
      this.status = 'win';

      return;
    }

    if (!this.#_canMove()) {
      this.status = 'lose';
    }
  }

  #_areBoardsEqual(boardA, boardB) {
    return boardA.every((row, rowIndex) => {
      return row.every((cell, colIndex) => {
        return cell === boardB[rowIndex][colIndex];
      });
    });
  }

  #_hasWinningTile() {
    return this.state.some((row) => row.includes(this.winningValue));
  }

  #_canMove() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (
          col < this.boardSize - 1 &&
          this.state[row][col] === this.state[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.boardSize - 1 &&
          this.state[row][col] === this.state[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  #_slideBoardLeft(board) {
    let points = 0;
    const nextBoard = board.map((row) => {
      const result = this.#_slideRowLeft(row);

      points += result.points;

      return result.row;
    });

    return { board: nextBoard, points };
  }

  #_computeMovedBoard(direction) {
    let board = Game.#_createClone(this.state);

    if (direction === 'right') {
      board = this.#_reverseRows(board);
    } else if (direction === 'up') {
      board = this.#_transposeBoard(board);
    } else if (direction === 'down') {
      board = this.#_reverseRows(this.#_transposeBoard(board));
    }

    const slid = this.#_slideBoardLeft(board);

    board = slid.board;

    if (direction === 'right') {
      board = this.#_reverseRows(board);
    } else if (direction === 'up') {
      board = this.#_transposeBoard(board);
    } else if (direction === 'down') {
      board = this.#_transposeBoard(this.#_reverseRows(board));
    }

    return { board, points: slid.points };
  }

  #_reverseRows(board) {
    return board.map((row) => [...row].reverse());
  }

  #_transposeBoard(board) {
    return board.map((_, index) => board.map((row) => row[index]));
  }
}

module.exports = Game;

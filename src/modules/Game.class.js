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
    this.initialState = initialState
      ? this.cloneState(initialState)
      : this.getEmptyBoard();

    this.board = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
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
    return this.cloneState(this.board);
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
    this.board = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  getEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [randomRow, randomCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[randomRow][randomCol] = Math.random() < 0.1 ? 4 : 2;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const rotated = this.rotateForMove(direction);
    let moved = false;
    let scoreGain = 0;

    const newRotated = rotated.map((row) => {
      const result = this.slideAndMergeRow(row);

      if (result.moved) {
        moved = true;
      }
      scoreGain += result.scoreGain;

      return result.row;
    });

    if (!moved) {
      return;
    }

    this.board = this.rotateBack(newRotated, direction);
    this.score += scoreGain;
    this.addRandomTile();
    this.updateStatus();
  }

  slideAndMergeRow(row) {
    const original = [...row];
    const filtered = row.filter((v) => v !== 0);
    let scoreGain = 0;

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        scoreGain += filtered[i];
        filtered.splice(i + 1, 1);
        filtered.push(0);
      }
    }

    while (filtered.length < 4) {
      filtered.push(0);
    }

    const moved = !original.every((v, i) => v === filtered[i]);

    return { row: filtered, moved, scoreGain };
  }

  rotateForMove(direction) {
    const board = this.board;

    switch (direction) {
      case 'left':
        return board.map((row) => [...row]);
      case 'right':
        return board.map((row) => [...row].reverse());
      case 'up':
        return this.transpose(board);
      case 'down':
        return this.transpose(board).map((row) => [...row].reverse());
      default:
        return board.map((row) => [...row]);
    }
  }

  rotateBack(rotated, direction) {
    switch (direction) {
      case 'left':
        return rotated;
      case 'right':
        return rotated.map((row) => [...row].reverse());
      case 'up':
        return this.transpose(rotated);
      case 'down':
        return this.transpose(rotated.map((row) => [...row].reverse()));
      default:
        return rotated;
    }
  }

  transpose(board) {
    const result = this.getEmptyBoard();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        result[c][r] = board[r][c];
      }
    }

    return result;
  }

  updateStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

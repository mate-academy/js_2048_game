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
    this.state = initialState ?? [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
    this.score = 0;
    this.size = 4;
  }

  addRandomTile() {
    const board = this.state;
    const emptyTileCoords = [];

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (!board[y][x]) {
          emptyTileCoords.push([y, x]);
        }
      }
    }

    if (!emptyTileCoords.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyTileCoords.length);
    const [row, cell] = emptyTileCoords[randomIndex];

    board[row][cell] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose(board) {
    const transposedBoard = [[], [], [], []];

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        transposedBoard[i].push(board[j][i]);
      }
    }

    return transposedBoard;
  }

  noMovesCheck() {
    const board = this.state;

    const allTiles = board.flat();

    if (allTiles.includes(0)) {
      return false;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (
          (j < 3 && board[i][j] === board[i][j + 1]) ||
          (i < 3 && board[i][j] === board[i + 1][j])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  postMoveCheck(isMoved) {
    const victory = this.state.flat().includes(2048);

    if (victory) {
      this.status = 'win';
    }

    if (isMoved && !victory) {
      this.addRandomTile();
    }

    if (this.noMovesCheck()) {
      this.status = 'lose';
    }
  }

  movement(direction, transpose = false) {
    const board = transpose ? this.transpose(this.state) : this.state;
    let moved = false;

    for (let i = 0; i < board.length; i++) {
      const initialRow = board[i].slice();
      const row = initialRow.filter((n) => n);

      if (direction === 'right' || direction === 'down') {
        row.reverse();
      }

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row.splice(j + 1, 1);
        }
      }

      while (row.length < 4) {
        row.push(0);
      }

      if (direction === 'right' || direction === 'down') {
        row.reverse();
      }

      board[i] = row;

      if (!moved && JSON.stringify(initialRow) !== JSON.stringify(row)) {
        moved = true;
      }
    }

    this.state = transpose ? this.transpose(board) : board;
    this.postMoveCheck(moved);
  }

  moveLeft() {
    this.movement('left', false);
  }

  moveRight() {
    this.movement('right', false);
  }

  moveUp() {
    this.movement('up', true);
  }

  moveDown() {
    this.movement('down', true);
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
    return this.state;
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
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'playing';

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
    this.addRandomTile();
  }
}

export default Game;

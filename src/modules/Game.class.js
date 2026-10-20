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
    // eslint-disable-next-line no-console
    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);

    this.zeroRemove();
    this.mergeTiles();
    this.zeroRemove();

    // Add random tiles if board is changed

    if (this.compareBoards(oldBoard, this.board)) {
      this.checkAfterMove();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < 4; i++) {
      this.reverseTiles(i);
    }

    this.zeroRemove();
    this.mergeTiles();
    this.zeroRemove();

    for (let i = 0; i < 4; i++) {
      this.reverseTiles(i);
    }

    // Add random tiles if board is changed

    if (this.compareBoards(oldBoard, this.board)) {
      this.checkAfterMove();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < 4; i++) {
      const verticalTiles = [];

      for (let j = 0; j < 4; j++) {
        verticalTiles.push(this.board[j][i]);
      }

      // Remove zeros from the vertical tiles and add zeros at the end

      const tiles = verticalTiles.filter((value) => value !== 0);

      while (tiles.length < 4) {
        tiles.push(0);
      }

      // Merge the vertical tiles

      for (let j = 0; j < 3; j++) {
        if (tiles[j] === tiles[j + 1] && tiles[j] !== 0) {
          tiles[j] *= 2;
          tiles[j + 1] = 0;
          this.score += tiles[j];
        }
      }

      // Remove zeros from the vertical tiles and add zeros at the end

      const newTiles = tiles.filter((value) => value !== 0);

      while (newTiles.length < 4) {
        newTiles.push(0);
      }

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = newTiles[j];
      }
    }

    // Add random tiles if board is changed

    if (this.compareBoards(oldBoard, this.board)) {
      this.checkAfterMove();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < 4; i++) {
      const verticalTiles = [];

      for (let j = 0; j < 4; j++) {
        verticalTiles.push(this.board[j][i]);
      }
      verticalTiles.reverse();

      // Remove zeros from the vertical tiles and add zeros at the end

      const tiles = verticalTiles.filter((value) => value !== 0);

      while (tiles.length < 4) {
        tiles.push(0);
      }

      // Merge the vertical tiles

      for (let j = 0; j < 3; j++) {
        if (tiles[j] === tiles[j + 1] && tiles[j] !== 0) {
          tiles[j] *= 2;
          tiles[j + 1] = 0;
          this.score += tiles[j];
        }
      }

      // Remove zeros from the vertical tiles and add zeros at the end

      const newTiles = tiles.filter((value) => value !== 0);

      while (newTiles.length < 4) {
        newTiles.push(0);
      }

      newTiles.reverse();

      for (let j = 0; j < 4; j++) {
        this.board[j][i] = newTiles[j];
      }
    }

    // Add random tiles if board is changed

    if (this.compareBoards(oldBoard, this.board)) {
      this.checkAfterMove();
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
    this.status = 'idle';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCell = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCell.push([i, j]);
        }
      }
    }

    if (emptyCell.length === 0) {
      return;
    }

    const random = Math.random();
    let value = 2;

    if (random < 0.1) {
      value = 4;
    }

    const randomIndex = Math.floor(Math.random() * emptyCell.length);
    const randomCell = emptyCell[randomIndex];

    this.board[randomCell[0]][randomCell[1]] = value;
  }

  zeroRemove() {
    for (let i = 0; i < 4; i++) {
      const tiles = this.board[i].filter((value) => value !== 0);

      while (tiles.length < 4) {
        tiles.push(0);
      }
      this.board[i] = tiles;
    }
  }

  compareBoards(oldBoard, currentBoard) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (oldBoard[i][j] !== currentBoard[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  mergeTiles() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.board[i][j] === this.board[i][j + 1] &&
          this.board[i][j] !== 0
        ) {
          this.board[i][j] *= 2;
          this.board[i][j + 1] = 0;
          this.score += this.board[i][j];
        }
      }
    }
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }
      }

      for (let j = 0; j < 3; j++) {
        if (
          this.board[i][j] === this.board[i][j + 1] &&
          this.board[i][j] !== 0
        ) {
          return false;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          this.board[i][j] === this.board[i + 1][j] &&
          this.board[i][j] !== 0
        ) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  reverseTiles(row) {
    return this.board[row].reverse();
  }

  checkAfterMove() {
    if (this.checkWin()) {
      return;
    }
    this.addRandomTile();
    this.checkLose();
  }
}

module.exports = Game;

'use strict';

/**
 * This class represents the game.
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
    this.board =
      initialState !== undefined
        ? initialState.map((row) => [...row])
        : this.generateEmptyBoard();
    /* this.board = [...initialState] ?? this.generateEmptyBoard(); */
    this.score = 0;
    this.status = 'idle';
  }

  /**
   * Returns a new board for new games.
   */
  generateEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  /**
   * Inputs the board as is, for a movement to the left.
   */
  moveLeft() {
    this.performMove(this.board);
  }

  /**
   * Inputs a mirrored copy of the board, does a movement to the left,
   * then transforms it back.
   */
  moveRight() {
    const reversed = this.board.map((row) => [...row].reverse());

    this.performMove(reversed, true);
  }

  /**
   * Inputs a transposed copy of the board (rotates it 90 degrees),
   * does a movement to the left, * then transforms it back.
   */
  moveUp() {
    const transposed = this.transpose(this.board);

    this.performMove(transposed, false, true);
  }

  /**
   * Inputs a transposed and mirrored copy of the board, does a movement to
   * the left, then transforms it back.
   */
  moveDown() {
    const transposed = this.transpose(this.board);
    const reversed = transposed.map((row) => [...row].reverse());

    this.performMove(reversed, true, true);
  }

  /**
   * Performs the move to the left, with parameters to transforms the board
   * back if needed.
   */
  performMove(inputBoard, reReverse = false, transposed = false) {
    if (this.status === 'playing') {
      const newBoard = [];
      let moved = false;
      let scoreToAdd = 0;

      for (const row of inputBoard) {
        const { newRow, mergedScore, changed } = this.slideRow(row);

        scoreToAdd += mergedScore;

        if (changed) {
          moved = true;
        }

        newBoard.push(newRow);
      }

      if (moved) {
        let resultBoard = newBoard;

        if (reReverse) {
          resultBoard = resultBoard.map((row) => row.reverse());
        }

        if (transposed) {
          resultBoard = this.transpose(resultBoard);
        }

        this.board = resultBoard;
        this.score += scoreToAdd;

        this.addTile();
        this.updateStatus();
      }
    }
  }

  /**
   *  Slides an individual row to the left.
   */
  slideRow(row) {
    const nonZero = row.filter((val) => val !== 0);
    const newRow = [];
    let score = 0;
    let skip = false;

    for (let i = 0; i < nonZero.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const merged = nonZero[i] * 2;

        newRow.push(merged);
        score += merged;
        skip = true;
      } else {
        newRow.push(nonZero[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    const changed = !this.arraysEqual(row, newRow);

    return { newRow, mergedScore: score, changed };
  }

  /**
   * Compares two arrays. Returns true if they're exactly equal.
   */
  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  /**
   * Transposes an array of arrays.
   */
  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
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
    this.board = this.generateEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addTile();
    this.addTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  /**
   * Adds a random tile.
   */
  addTile() {
    const availableTiles = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          availableTiles.push({ x: i, y: j });
        }
      }
    }

    if (availableTiles.length > 0) {
      const newTilePositionRoll = Math.floor(
        Math.random() * availableTiles.length,
      );
      const chosenTile = availableTiles[newTilePositionRoll];
      const newTileValueRoll = Math.random();

      if (newTileValueRoll > 0.1) {
        this.board[chosenTile.x][chosenTile.y] = 2;

        return true;
      }
      this.board[chosenTile.x][chosenTile.y] = 4;

      return true;
    }

    return false;
  }

  /**
   * Checks if there are any empty tiles or movements that would merge tiles.
   */
  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks for at least one tile with 2048.
   */
  has2048() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Uses has2048 to update the game status.
   */
  updateStatus() {
    if (this.has2048()) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }
}

export default Game;

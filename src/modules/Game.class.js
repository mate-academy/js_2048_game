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
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.lastMove = this._createEmptyMoveMeta();
  }

  moveLeft() {
    this._performMove('left');
  }

  moveRight() {
    this._performMove('right');
  }

  moveUp() {
    this._performMove('up');
  }

  moveDown() {
    this._performMove('down');
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

  getLastMove() {
    return JSON.parse(JSON.stringify(this.lastMove));
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }

    const firstTile = this._addRandomTile();
    const secondTile = this._addRandomTile();

    this.lastMove = {
      changed: true,
      moved: [],
      merged: [],
      spawned: [firstTile, secondTile].filter(Boolean),
    };

    this._updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.lastMove = this._createEmptyMoveMeta();
  }

  _performMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldScore = this.score;
    const moveMeta = this._buildMove(direction);

    if (this._boardsEqual(moveMeta.board, this.board)) {
      this.score = oldScore;
      this.lastMove = this._createEmptyMoveMeta();
      this._updateStatus();

      return;
    }

    this.board = moveMeta.board;

    const spawnedTile = this._addRandomTile();

    this.lastMove = {
      changed: true,
      moved: moveMeta.moved,
      merged: moveMeta.merged,
      spawned: spawnedTile ? [spawnedTile] : [],
    };

    this._updateStatus();
  }

  _buildMove(direction) {
    const board = Array.from({ length: 4 }, () => Array(4).fill(0));
    const moved = [];
    const merged = [];

    for (let index = 0; index < 4; index++) {
      const positions = this._getLinePositions(direction, index);
      const tiles = positions
        .map(({ row, col }) => ({
          row,
          col,
          value: this.board[row][col],
        }))
        .filter((tile) => tile.value !== 0);

      let targetIndex = 0;

      for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
        const currentTile = tiles[tileIndex];
        const nextTile = tiles[tileIndex + 1];
        const target = positions[targetIndex];

        if (nextTile && currentTile.value === nextTile.value) {
          const mergedValue = currentTile.value * 2;

          board[target.row][target.col] = mergedValue;
          this.score += mergedValue;

          moved.push({
            from: { row: currentTile.row, col: currentTile.col },
            to: { row: target.row, col: target.col },
            value: currentTile.value,
          });

          moved.push({
            from: { row: nextTile.row, col: nextTile.col },
            to: { row: target.row, col: target.col },
            value: nextTile.value,
          });

          merged.push({
            row: target.row,
            col: target.col,
            value: mergedValue,
          });

          tileIndex++;
        } else {
          board[target.row][target.col] = currentTile.value;

          moved.push({
            from: { row: currentTile.row, col: currentTile.col },
            to: { row: target.row, col: target.col },
            value: currentTile.value,
          });
        }

        targetIndex++;
      }
    }

    return {
      board,
      moved,
      merged,
    };
  }

  _getLinePositions(direction, index) {
    const positions = [];

    for (let step = 0; step < 4; step++) {
      if (direction === 'left') {
        positions.push({ row: index, col: step });
      }

      if (direction === 'right') {
        positions.push({ row: index, col: 3 - step });
      }

      if (direction === 'up') {
        positions.push({ row: step, col: index });
      }

      if (direction === 'down') {
        positions.push({ row: 3 - step, col: index });
      }
    }

    return positions;
  }

  _createEmptyMoveMeta() {
    return {
      changed: false,
      moved: [],
      merged: [],
      spawned: [],
    };
  }

  _boardsEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    for (let row = 0; row < a.length; row++) {
      if (a[row].length !== b[row].length) {
        return false;
      }

      for (let col = 0; col < a[row].length; col++) {
        if (a[row][col] !== b[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  _transpose(board) {
    const result = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        result[col][row] = board[row][col];
      }
    }

    return result;
  }

  _updateStatus() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          this.status = 'playing';

          return;
        }
      }
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const value = this.board[row][col];

        if (
          col + 1 < this.board[row].length &&
          value === this.board[row][col + 1]
        ) {
          this.status = 'playing';

          return;
        }

        if (row + 1 < this.board.length && value === this.board[row + 1][col]) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }

  _getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  _addRandomTile() {
    const emptyCells = this._getEmptyCells();

    if (emptyCells.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = value;

    return { row, col, value };
  }
}

export default Game;

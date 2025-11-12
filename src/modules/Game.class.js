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
    this.size = 4;
    this.board = initialState || this._getEmptyBoard();
    this.score = 0;
    this.status = 'playing';
  }

  _getEmptyBoard() {
    // return new Array(this.size * this.size).fill(0);
    return new Array(this.size * this.size).fill(0);
  }

  _getEmptyTiles() {
    return this.board
      .map((val, index) => {
        if (val === 0) {
          return index;
        } else {
          return -1;
        }
      })
      .filter((index) => index !== -1);
  }

  _addNewTile() {
    const emptyTiles = this._getEmptyTiles();

    if (emptyTiles.length === 0) {
      return;
    }

    const randomIndex =
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[randomIndex] = newValue;
  }

  _updateStatus() {
    if (this.board.includes(2048)) {
      this.status = 'won';

      return;
    }

    if (this._getEmptyTiles().length > 0) {
      this.status = 'playing';

      return;
    }

    const isMovePossible = this._checkPossibleMoves();

    if (!isMovePossible) {
      this.status = 'lost';

      return;
    }

    this.status = 'playing';
  }

  _checkPossibleMoves() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const index = r * this.size + c;
        const value = this.board[index];

        // Check horizontal neighbor
        if (c < this.size - 1) {
          const rightIndex = r * this.size + (c + 1);

          if (this.board[rightIndex] === value) {
            return true;
          }
        }

        // Check vertical neighbor
        if (r < this.size - 1) {
          const downIndex = (r + 1) * this.size + c;

          if (this.board[downIndex] === value) {
            return true;
          }
        }
      }
    }

    return false;
  }

  _slideAndMerge(line) {
    let scoreIncrease = 0;
    let moved = false;

    let filteredLine = line.filter((val) => val !== 0);

    for (let i = 0; i < filteredLine.length; i++) {
      if (filteredLine[i] !== 0 && filteredLine[i] === filteredLine[i + 1]) {
        const mergedValue = filteredLine[i] * 2;

        scoreIncrease += mergedValue;
        filteredLine[i] = mergedValue;
        filteredLine[i + 1] = 0;
        moved = true;
      }
    }

    filteredLine = filteredLine.filter((val) => val !== 0);

    const newLine = filteredLine.concat(
      new Array(line.length - filteredLine.length),
    );

    if (
      line.filter((val) => val !== 0).length !== filteredLine.length ||
      JSON.stringify(line) !== JSON.stringify(newLine)
    ) {
      moved = true;
    }

    return { newLine, moved, scoreIncrease };
  }

  _handleMove(direction) {
    let boardChanged = false;
    let totalScoreIncrease = 0;
    const newBoard = new Array(this.size * this.size);

    for (let i = 0; i < this.size; i++) {
      let line = [];

      if (direction === 'left' || direction === 'right') {
        line = this.board.slice(i * this.size, i * this.size + this.size);
      } else {
        for (let j = 0; j < this.size; j++) {
          line.push(this.board[j * this.size + i]);
        }
      }

      if (direction === 'right' || direction === 'down') {
        line.reverse();
      }

      const { newLine, moved, scoreIncrease } = this._slideAndMerge(line);

      if (moved) {
        boardChanged = true;
      }

      totalScoreIncrease += scoreIncrease;

      if (direction === 'right' || direction === 'down') {
        newLine.reverse();
      }

      if (direction === 'left' || direction === 'up') {
        newBoard.splice(i * this.size, this.size, ...newLine);
      } else {
        for (let j = 0; j < this.size; j++) {
          newBoard[j * this.size + i] = newLine[j];
        }
      }
    }

    if (!boardChanged) {
      return false;
    }

    this.board = newBoard;
    this.score += totalScoreIncrease;

    this._addNewTile();
    this._updateStatus();

    return true;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    return this._handleMove('left');
  }
  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    return this._handleMove('right');
  }
  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    return this._handleMove('up');
  }
  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    return this._handleMove('down');
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
    return [...this.board];
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
    this.board = this._getEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this._addNewTile();
    this._addNewTile();

    this._updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }
}

module.exports = Game;

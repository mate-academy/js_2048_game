'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
    this.status = 'idle'; // One of: 'idle', 'playing', 'win', 'lose'

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  _spawnNewTile() {
    const zeroPos = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          zeroPos.push({ rowIndex: row, colIndex: col });
        }
      }
    }

    if (zeroPos.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * zeroPos.length);

    const randomCell = zeroPos[randomIndex];
    const startValue = Math.random() < 0.1 ? 4 : 2;

    this.board[randomCell.rowIndex][randomCell.colIndex] = startValue;
  }

  _processRow(row) {
    const slidRow = row.filter((cell) => cell !== 0);
    const mergedRow = [];

    for (let i = 0; i < slidRow.length; i++) {
      if (i + 1 < slidRow.length && slidRow[i] === slidRow[i + 1]) {
        const mergedValue = slidRow[i] * 2;

        if (mergedValue === 2048) {
          this.status = 'win';
        }

        mergedRow.push(mergedValue);
        this.score += mergedValue;

        i++;
      } else {
        mergedRow.push(slidRow[i]);
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  _transposeBoard() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < newBoard.length; i++) {
      for (let j = 0; j < newBoard[i].length; j++) {
        newBoard[j][i] = this.board[i][j];
      }
    }

    return newBoard;
  }

  _checkForGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return;
        }
      }
    }
    this.status = 'game over';
  }

  _handleMove(logic) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    logic();

    const newBoard = JSON.stringify(this.board);

    if (oldBoard !== newBoard) {
      this._spawnNewTile();
      this._checkForGameOver();
    }
  }

  move(direction) {
    if (this.status === 'game over') {
      return false;
    }

    const oldBoard = JSON.stringify(this.board);

    switch (direction) {
      case 'Up':
        this.board = this._transposeBoard();
        this.board = this.board.map((row) => this._processRow(row));
        this.board = this._transposeBoard();
        break;
      case 'Down':
        this.board = this._transposeBoard();

        this.board = this.board.map((row) => {
          return this._processRow([...row].reverse()).reverse();
        });

        this.board = this._transposeBoard();
        break;
      case 'Left':
        this.board = this.board.map((row) => this._processRow(row));
        break;
      case 'Right':
        this.board = this.board.map((row) => {
          return this._processRow([...row].reverse()).reverse();
        });
        break;
    }

    const moved = JSON.stringify(this.board) !== oldBoard;

    if (moved) {
      this._spawnNewTile();
      this._checkForGameOver();
    }

    return moved;
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
    this.restart();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'playing';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this._spawnNewTile();
    this._spawnNewTile();
  }

  continuePlaying() {
    if (this.status === 'win') {
      this.status = 'playing';
    }
  }
}

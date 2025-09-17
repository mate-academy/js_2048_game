'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  board = [];
  score = 0;
  statusGame = '';
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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.statusGame = 'idle';
  }

  _transpose() {
    const newBoard = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[j][i] = this.board[i][j];
      }
    }
    this.board = newBoard;
  }

  _hasWon() {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  }

  _canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  _updateStatus() {
    if (this._hasWon() && this.statusGame !== 'win') {
      this.statusGame = 'win';
    } else if (!this._canMove() && this.statusGame !== 'lose') {
      this.statusGame = 'lose';
    }
  }

  _processRow(row) {
    const shiftedRow = row.filter((cell) => cell !== 0);
    const mergedRow = [];

    for (let i = 0; i < shiftedRow.length; i++) {
      if (shiftedRow[i] !== shiftedRow[i + 1]) {
        mergedRow.push(shiftedRow[i]);
        continue;
      }

      const sumCells = shiftedRow[i] + shiftedRow[i + 1];

      mergedRow.push(sumCells);
      this.score += sumCells;
      i++;
    }

    const newRow = Array(4).fill(0);

    mergedRow.forEach((value, index) => {
      newRow[index] = value;
    });

    return newRow;
  }

  _move(getNewBoard) {
    const originalBoard = JSON.stringify(this.board);
    const newBoard = getNewBoard();

    if (JSON.stringify(newBoard) !== originalBoard) {
      this.board = newBoard;
      this._updateStatus();

      return true;
    }

    return false;
  }

  moveLeft() {
    return this._move(() => this.board.map((row) => this._processRow(row)));
  }
  moveRight() {
    return this._move(() => {
      return this.board.map((row) => {
        return this._processRow([...row].reverse()).reverse();
      });
    });
  }
  moveUp() {
    return this._move(() => {
      this._transpose();

      const newBoard = this.board.map((row) => this._processRow(row));

      this.board = newBoard;
      this._transpose();

      return this.board;
    });
  }
  moveDown() {
    return this._move(() => {
      this._transpose();

      const newBoard = this.board.map((row) => {
        return this._processRow([...row].reverse()).reverse();
      });

      this.board = newBoard;
      this._transpose();

      return this.board;
    });
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
    return this.statusGame;
  }

  /**
   * Starts the game.
   */
  start() {
    this.addRandomTile();
    this.addRandomTile();
    this.statusGame = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.statusGame = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({
            row: i,
            col: j,
          });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomValue = Math.random() < 0.9 ? 2 : 4;

    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = randomValue;
  }
}

export default Game;

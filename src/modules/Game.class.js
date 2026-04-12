'use strict';

/**
 * This class represents the game
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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status === 'win' || this.status === 'lose') {
      return false;
    }

    const row = this._processMove(this.board);

    if (row.moved) {
      this.board = row.newBoard;
      this.spawnTile();
      this._updateStatus();
    }

    return row.moved;
  }

  moveRight() {
    if (this.status === 'win' || this.status === 'lose') {
      return false;
    }

    const reversedBoard = this.board.map((row) => [...row].reverse());

    const result = this._processMove(reversedBoard);

    if (result.moved) {
      this.board = result.newBoard.map((row) => row.reverse());
      this.spawnTile();
      this._updateStatus();
    }

    return result.moved;
  }

  moveUp() {
    if (this.status === 'win' || this.status === 'lose') {
      return false;
    }

    const transposed = this._transpose(this.board);
    const result = this._processMove(transposed);

    if (result.moved) {
      this.board = this._transpose(result.newBoard);
      this.spawnTile();
      this._updateStatus();
    }

    return result.moved;
  }

  _transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  moveDown() {
    if (this.status === 'win' || this.status === 'lose') {
      return false;
    }

    const transposed = this._transpose(this.board);
    const reversed = transposed.map((row) => [...row].reverse());

    const result = this._processMove(reversed);

    if (result.moved) {
      const backReversed = result.newBoard.map((row) => row.reverse());

      this.board = this._transpose(backReversed);
      this.spawnTile();
      this._updateStatus();
    }

    return result.moved;
  }

  _updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this._canMove()) {
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
    this.status = 'playing';
    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'playing';
    this.score = 0;
    this.spawnTile();
    this.spawnTile();
  }

  _processMove(matrix) {
    let moved = false;

    const newBoard = matrix.map((row) => {
      const oldRow = [...row];
      let tempRow = row.filter((num) => num !== 0);

      for (let i = 0; i < tempRow.length - 1; i++) {
        if (tempRow[i] === tempRow[i + 1]) {
          tempRow[i] *= 2;
          this.score += tempRow[i];
          tempRow[i + 1] = 0;
          i++;
        }
      }

      tempRow = tempRow.filter((num) => num !== 0);

      while (tempRow.length < 4) {
        tempRow.push(0);
      }

      if (JSON.stringify(oldRow) !== JSON.stringify(tempRow)) {
        moved = true;
      }

      return tempRow;
    });

    return { newBoard, moved };
  }

  spawnTile() {
    const emptyCells = this.board.reduce((acc, row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          acc.push({ x: rowIndex, y: colIndex });
        }
      });

      return acc;
    }, []);

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { x, y } = emptyCells[randomIndex];

      const newValue = Math.random() < 0.1 ? 4 : 2;

      this.board[x][y] = newValue;
    }
  }

  _canMove() {
    if (this.board.some((row) => row.includes(0))) {
      return true;
    }

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        const current = this.board[x][y];

        if (y < 3 && current === this.board[x][y + 1]) {
          return true;
        }

        if (x < 3 && current === this.board[x + 1][y]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

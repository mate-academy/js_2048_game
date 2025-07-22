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
      this.state = initialState.map((row) => row.slice());
    } else {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move({});
  }
  moveRight() {
    this.move({ reversed: true });
  }
  moveUp() {
    this.move({ transpose: true });
  }
  moveDown() {
    this.move({ reversed: true, transpose: true });
  }

  compressAndMergeRow(row) {
    let moved = false;

    let cells = row.filter((cell) => cell !== 0);

    for (let i = 0; i < cells.length - 1; i++) {
      if (cells[i] === cells[i + 1]) {
        cells[i] *= 2;
        this.score += cells[i];
        cells[i + 1] = 0;
        moved = true;
      }
    }

    cells = cells.filter((cell) => cell !== 0);

    while (cells.length < 4) {
      cells.push(0);
    }

    return { row: cells, moved };
  }

  updateStatus() {
    for (const row of this.state) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';

          return;
        } else if (cell === 0) {
          this.status = 'playing';

          return;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const currentCell = this.state[row][col];

        if (
          (col < 3 && this.state[row][col + 1] === currentCell) ||
          (row < 3 && this.state[row + 1][col] === currentCell)
        ) {
          this.status = 'playing';

          return;
        }
      }
    }
    this.status = 'lose';
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => {
      return matrix.map((row) => row[colIndex]);
    });
  }

  move({ transpose = false, reversed = false }) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;
    let board = this.state;

    if (transpose) {
      board = this.transpose(board);
    }

    board = board.map((row) => {
      let workingRow;

      if (reversed) {
        workingRow = row.slice().reverse();
      } else {
        workingRow = row.slice();
      }

      const { row: newRow, moved: rowMoved } =
        this.compressAndMergeRow(workingRow);

      if (rowMoved || newRow.some((val, i) => val !== workingRow[i])) {
        moved = true;
      }

      if (reversed) {
        return newRow.reverse();
      } else {
        return newRow;
      }
    });

    if (transpose) {
      board = this.transpose(board);
    }

    if (moved) {
      this.state = board;
      this.addRandomTile();
      this.updateStatus();
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
    return this.state.map((row) => row.slice());
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

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;

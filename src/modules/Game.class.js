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
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'gameover'

    this.board =
      initialState ||
      Array(this.size)
        .fill()
        .map(() => Array(this.size).fill(0));
    this.won = false;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    switch (direction) {
      case 'left':
        moved = this.moveLeft();
        break;
      case 'right':
        moved = this.moveRight();
        break;
      case 'up':
        moved = this.moveUp();
        break;
      case 'down':
        moved = this.moveDown();
        break;
    }

    if (moved) {
      this.addNewTile();
      this.checkGameStatus();
    }

    return moved;
  }

  moveLeft() {
    return this.moveHorizontal('left');
  }
  moveRight() {
    return this.moveHorizontal('right');
  }
  moveUp() {
    return this.moveVertical('up');
  }
  moveDown() {
    return this.moveVertical('down');
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

    if (this.isBoardEmpty()) {
      this.addNewTile();
      this.addNewTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.won = false;
    this.addNewTile();
    this.addNewTile();
  }

  isBoardEmpty() {
    return this.board.every((row) => row.every((cell) => cell === 0));
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  addNewTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveHorizontal(direction) {
    let moved = false;

    for (let i = 0; i < this.size; i++) {
      const row =
        direction === 'left'
          ? this.board[i].filter((x) => x !== 0)
          : this.board[i].filter((x) => x !== 0).reverse();

      const merged = this.mergeTiles(row);
      const newRow =
        direction === 'left'
          ? [...merged, ...Array(this.size - merged.length).fill(0)]
          : [...Array(this.size - merged.length).fill(0), ...merged.reverse()];

      if (JSON.stringify(this.board[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      this.board[i] = newRow;
    }

    return moved;
  }

  moveVertical(direction) {
    let moved = false;

    for (let j = 0; j < this.size; j++) {
      const column = this.board.map((row) => row[j]).filter((x) => x !== 0);

      if (direction === 'down') {
        column.reverse();
      }

      const merged = this.mergeTiles(column);
      const newColumn =
        direction === 'up'
          ? [...merged, ...Array(this.size - merged.length).fill(0)]
          : [...Array(this.size - merged.length).fill(0), ...merged.reverse()];

      if (
        JSON.stringify(this.board.map((row) => row[j])) !==
        JSON.stringify(newColumn)
      ) {
        moved = true;
      }

      for (let i = 0; i < this.size; i++) {
        this.board[i][j] = newColumn[i];
      }
    }

    return moved;
  }

  mergeTiles(tiles) {
    const merged = [];

    for (let i = 0; i < tiles.length; i++) {
      if (i < tiles.length - 1 && tiles[i] === tiles[i + 1]) {
        const mergedValue = tiles[i] * 2;

        merged.push(mergedValue);
        this.score += mergedValue;

        if (mergedValue === 2048 && !this.won) {
          this.won = true;
          this.status = 'win';
        }
        i++;
      } else {
        merged.push(tiles[i]);
      }
    }

    return merged;
  }

  checkGameStatus() {
    if (this.won) {
      return;
    }

    // Check if there are any empty cells
    if (this.getEmptyCells().length > 0) {
      return;
    }

    // Check if any moves are possible
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.board[i][j];
        const neighbors = [
          [i - 1, j],
          [i + 1, j],
          [i, j - 1],
          [i, j + 1],
        ];

        for (const [ni, nj] of neighbors) {
          if (ni >= 0 && ni < this.size && nj >= 0 && nj < this.size) {
            if (this.board[ni][nj] === current) {
              return;
            }
          }
        }
      }
    }

    this.status = 'gameover';
  }
}
module.exports = Game;

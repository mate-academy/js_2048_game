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
    console.log(initialState);

    if (
      !Array.isArray(initialState) ||
      initialState.length !== 4 ||
      !initialState.every(
        (row) =>
          Array.isArray(row) &&
          row.length === 4 &&
          row.every((cell) => typeof cell === 'number'),
      )
    ) {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    } else {
      this.board = initialState.map((row) => [...row]);
    }

    this.board.forEach((el) => {
      el.forEach((element) => {
        if (element !== 0) {
          this.status = 'playing';
        }
      });
    });

    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    let hasChanged = false;

    for (let i = 0; i < this.board.length; i++) {
      const currentRow = [...this.board[i]];
      const proccesedRow = this.proccesRow(this.board[i]);

      const isRowChanged = proccesedRow.some(
        (val, index) => val !== currentRow[index],
      );

      if (isRowChanged) {
        hasChanged = true;
      }

      this.board[i] = proccesedRow;
    }

    if (hasChanged) {
      this.setupRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    let hasChanged = false;

    for (let i = 0; i < this.board.length; i++) {
      const rowBefore = [...this.board[i]];
      const reversed = [...this.board[i]].reverse();
      const proccesed = this.proccesRow(reversed);
      const finalRow = proccesed.reverse();

      const isRowChanged = finalRow.some(
        (val, index) => val !== rowBefore[index],
      );

      if (isRowChanged) {
        hasChanged = true;
      }

      this.board[i] = finalRow;
    }

    if (hasChanged) {
      this.setupRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      const cloumn = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      const proccesed = this.proccesRow(cloumn);

      const isColumnChanged = proccesed.some(
        (val, index) => val !== cloumn[index],
      );

      if (isColumnChanged) {
        hasChanged = true;
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = proccesed[row];
      }
    }

    if (hasChanged) {
      this.setupRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      const cloumn = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      const proccesed = this.proccesRow([...cloumn].reverse());
      const finalColumn = proccesed.reverse();

      const isColumnChanged = finalColumn.some(
        (val, index) => val !== cloumn[index],
      );

      if (isColumnChanged) {
        hasChanged = true;
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = finalColumn[row];
      }
    }

    if (hasChanged) {
      this.setupRandomTile();
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.setupRandomTile();
      this.setupRandomTile();
    }
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
    this.status = 'idle';

    this.start();
  }

  // Add your own methods here

  setupRandomTile() {
    const emptyCells = [];

    this.board.forEach((r, rIndex) => {
      r.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCells.push([rIndex, cellIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [row, col] = emptyCells[randomIndex];

    const tileValue = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = tileValue;
  }

  proccesRow(row) {
    const list = row.filter((x) => x !== 0);

    for (let i = 0; i < list.length - 1; i++) {
      if (list[i] === list[i + 1]) {
        list[i] *= 2;

        this.score += list[i];

        list.splice(i + 1, 1);
      }
    }

    while (list.length < 4) {
      list.push(0);
    }

    return list;
  }

  updateStatus() {
    let hasEmptyCells = false;
    let canMerge = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (current === 2048) {
          this.status = 'win';

          return;
        }

        if (current === 0) {
          hasEmptyCells = true;
        }

        if (c < 3 && current === this.board[r][c + 1]) {
          canMerge = true;
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          canMerge = true;
        }
      }
    }

    if (hasEmptyCells || canMerge) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }
}

module.exports = Game;

'use strict';

const Status = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Status.idle;
  }

  moveLeft() {
    if (this.status !== Status.playing) {
      return;
    }

    this.applyMove((row) => this.transformRow(row));
  }

  moveRight() {
    if (this.status !== Status.playing) {
      return;
    }

    this.applyMove((row) => this.transformRow([...row].reverse()).reverse());
  }

  moveUp() {
    if (this.status !== Status.playing) {
      return;
    }

    this.applyMoveVertical((column) => this.transformRow(column));
  }

  moveDown() {
    if (this.status !== Status.playing) {
      return;
    }

    this.applyMoveVertical((column) =>
      this.transformRow([...column].reverse()).reverse(),
    );
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

  /**
   * Starts the game.
   */
  start() {
    this.status = Status.playing;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Status.idle;
  }

  // ---------- Add your own methods here ----------

  applyMove(transformRowFn) {
    const newBoard = this.board.map((row) => transformRowFn(row));

    if (this.boardsAreEqual(this.board, newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
  }

  applyMoveVertical(transformColumnFn) {
    const columns = this.getColumns();
    const newColumns = columns.map((column) => transformColumnFn(column));
    const newBoard = this.columnsToBoard(newColumns);

    if (this.boardsAreEqual(this.board, newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
  }

  transformRow(row) {
    const filtered = row.filter((cell) => cell !== 0);
    const merged = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        merged.push(mergedValue);
        this.score += mergedValue;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < row.length) {
      merged.push(0);
    }

    return merged;
  }

  getColumns() {
    const columns = [];

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }
      columns.push(column);
    }

    return columns;
  }

  columnsToBoard(columns) {
    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        board[row][col] = columns[col][row];
      }
    }

    return board;
  }

  boardsAreEqual(boardA, boardB) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (boardA[row][col] !== boardB[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [tileRow, tileCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[tileRow][tileCol] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    const hasWinningTile = this.board.some((row) => row.includes(2048));

    if (hasWinningTile) {
      this.status = Status.win;

      return;
    }

    if (!this.canMove()) {
      this.status = Status.lose;
    }
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        const right = this.board[row][col + 1];
        const down = row < 3 ? this.board[row + 1][col] : undefined;

        if (this.board[row][col] === right || this.board[row][col] === down) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

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
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';

    if (this.getEmptyCells().length === 0) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = this.compressAndMergeRow(this.board[i]);
    }

    if (!this.areBoardsEqual(oldBoard, this.board)) {
      this.addRandomTile();
      this.checkWin();
    }
    this.checkLose();
  }

  moveRight() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < this.board.length; i++) {
      const original = this.board[i];
      const reversed = this.reverseRow(original);
      const compressed = this.compressAndMergeRow(reversed);
      const final = this.reverseRow(compressed);

      this.board[i] = final;
    }

    if (!this.areBoardsEqual(oldBoard, this.board)) {
      this.addRandomTile();
      this.checkWin();
    }
    this.checkLose();
  }

  moveUp() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < 4; i++) {
      const column = this.getColumn(i);
      const compresed = this.compressAndMergeRow(column);

      this.setColumn(i, compresed);
    }

    if (!this.areBoardsEqual(oldBoard, this.board)) {
      this.addRandomTile();
      this.checkWin();
    }
    this.checkLose();
  }

  moveDown() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let i = 0; i < 4; i++) {
      const original = this.getColumn(i);
      const reversed = this.reverseRow(original);
      const compressed = this.compressAndMergeRow(reversed);
      const final = this.reverseRow(compressed);

      this.setColumn(i, final);
    }

    if (!this.areBoardsEqual(oldBoard, this.board)) {
      this.addRandomTile();
      this.checkWin();
    }
    this.checkLose();
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

    if (this.getEmptyCells().length === 16) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'playing';

    if (this.getEmptyCells().length === 16) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const empty = this.getEmptyCells();

    if (empty.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * empty.length);
    const [row, col] = empty[index];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  }

  compressAndMergeRow(row) {
    let newRow = row.filter((num) => num !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] = newRow[i] * 2;

        if (newRow[i] >= 2048) {
          this.status = 'win';
        }
        this.score += newRow[i];
        newRow[i + 1] = null;
      }
    }

    newRow = newRow.filter((num) => num !== null);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  reverseRow(row) {
    return [...row].reverse();
  }

  getColumn(index) {
    const column = [];

    for (let i = 0; i < 4; i++) {
      column.push(this.board[i][index]);
    }

    return column;
  }

  setColumn(index, newColumn) {
    for (let i = 0; i < 4; i++) {
      this.board[i][index] = newColumn[i];
    }
  }

  checkWin() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] >= 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkLose() {
    if (this.getEmptyCells().length > 0) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.board[i][j];
        // sprawdź prawo

        if (j < 3 && this.board[i][j + 1] === current) {
          return;
        }
        // sprawdź dół

        if (i < 3 && this.board[i + 1][j] === current) {
          return;
        }
      }
    }
    // Jeśli tu doszliśmy – nie ma pustych i nie da się nic połączyć
    this.status = 'lose';
  }

  areBoardsEqual(board1, board2) {
    for (let i = 0; i < board1.length; i++) {
      for (let j = 0; j < board1.length; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Game;

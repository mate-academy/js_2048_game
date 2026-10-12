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
      : null;

    this.score = 0;
    this.status = 'idle';

    this.board = this.initialState
      ? this.initialState.map((row) => [...row])
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
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

    if (!this.initialState) {
      this.board = this.createEmptyBoard();
      this.score = 0;
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';

    if (this.initialState) {
      this.board = this.initialState.map((row) => [...row]);
    } else {
      this.board = this.createEmptyBoard();
    }

    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const targetCell = emptyCells[randomIndex];

    this.board[targetCell.row][targetCell.col] = Math.random() < 0.1 ? 4 : 2;
  }

  slideAndMergeRow(row) {
    const nonZeros = row.filter((val) => val !== 0);
    const newRow = [];
    let scoreGain = 0;

    for (let i = 0; i < nonZeros.length; i++) {
      if (nonZeros[i] === nonZeros[i + 1]) {
        const mergedValue = nonZeros[i] * 2;

        newRow.push(mergedValue);
        scoreGain += mergedValue;
        i++;
      } else {
        newRow.push(nonZeros[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { row: newRow, scoreGain };
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    let turnScore = 0;

    const newBoard = this.board.map((row) => {
      const { row: newRow, scoreGain } = this.slideAndMergeRow(row);

      turnScore += scoreGain;

      if (row.some((val, idx) => val !== newRow[idx])) {
        boardChanged = true;
      }

      return newRow;
    });

    if (boardChanged) {
      this.board = newBoard;
      this.score += turnScore;
      this.afterMove();
    }

    return boardChanged;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    let turnScore = 0;

    const newBoard = this.board.map((row) => {
      const reversed = [...row].reverse();
      const { row: mergedRow, scoreGain } = this.slideAndMergeRow(reversed);
      const newRow = mergedRow.reverse();

      turnScore += scoreGain;

      if (row.some((val, idx) => val !== newRow[idx])) {
        boardChanged = true;
      }

      return newRow;
    });

    if (boardChanged) {
      this.board = newBoard;
      this.score += turnScore;
      this.afterMove();
    }

    return boardChanged;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    let turnScore = 0;
    const newBoard = this.createEmptyBoard();

    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      const { row: newColumn, scoreGain } = this.slideAndMergeRow(column);

      turnScore += scoreGain;

      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = newColumn[row];

        if (this.board[row][col] !== newColumn[row]) {
          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.board = newBoard;
      this.score += turnScore;
      this.afterMove();
    }

    return boardChanged;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    let turnScore = 0;
    const newBoard = this.createEmptyBoard();

    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ].reverse();

      const { row: mergedColumn, scoreGain } = this.slideAndMergeRow(column);
      const newColumn = mergedColumn.reverse();

      turnScore += scoreGain;

      for (let row = 0; row < 4; row++) {
        newBoard[row][col] = newColumn[row];

        if (this.board[row][col] !== newColumn[row]) {
          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.board = newBoard;
      this.score += turnScore;
      this.afterMove();
    }

    return boardChanged;
  }

  afterMove() {
    this.addRandomTile();

    if (this.checkWin()) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c < 3 && current === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

export { Game };

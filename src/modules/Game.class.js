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
    this.boardSize = 4;
    this.winningTile = 2048;
    this.board = [];
    this.score = 0;
    this.status = 'pending';
    this.hasWon = false;

    if (
      initialState &&
      initialState.length === this.boardSize &&
      initialState.every((row) => row.length === this.boardSize)
    ) {
      this.board = JSON.parse(JSON.stringify(initialState));

      if (this.checkWinCondition()) {
        this.hasWon = true;
        this.status = 'win';
      }
    } else {
      this.resetBoard();
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    const oldBoard = this.getState();

    for (let r = 0; r < this.boardSize; r++) {
      const { newLine, changed } = this._slideAndMerge(this.board[r]);

      if (changed) {
        this.board[r] = newLine;
        boardChanged = true;
      }

      if (!boardChanged && !this._compareBoards(oldBoard, this.board)) {
        boardChanged = true;
      }
    }

    this._handleMoveEnd(boardChanged);

    return boardChanged;
  }
  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    const oldBoard = this.getState();

    for (let r = 0; r < this.boardSize; r++) {
      const line = [...this.board[r]].reverse();
      const { newLine, changed } = this._slideAndMerge(line);

      if (changed) {
        this.board[r] = newLine.reverse();
        boardChanged = true;
      }

      if (!boardChanged && !this._compareBoards(oldBoard, this.board)) {
        boardChanged = true;
      }
    }

    this._handleMoveEnd(boardChanged);

    return boardChanged;
  }
  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    const oldBoard = this.getState();

    for (let c = 0; c < this.boardSize; c++) {
      const column = [];

      for (let r = 0; r < this.boardSize; r++) {
        column.push(this.board[r][c]);
      }

      const { newLine, changed } = this._slideAndMerge(column);

      if (changed) {
        for (let r = 0; r < this.boardSize; r++) {
          this.board[r][c] = newLine[r];
        }

        boardChanged = true;
      }
    }

    if (!boardChanged && !this._compareBoards(oldBoard, this.board)) {
      boardChanged = true;
    }

    this._handleMoveEnd(boardChanged);

    return boardChanged;
  }
  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    const oldBoard = this.getState();

    for (let c = 0; c < this.boardSize; c++) {
      const column = [];

      for (let r = 0; r < this.boardSize; r++) {
        column.push(this.board[r][c]);
      }

      const reversedColumn = [...column].reverse();
      const { newLine, changed } = this._slideAndMerge(reversedColumn);

      if (changed) {
        const finalColumn = newLine.reverse();

        for (let r = 0; r < this.boardSize; r++) {
          this.board[r][c] = finalColumn[r];
        }

        boardChanged = true;
      }
    }

    if (!boardChanged && !this._compareBoards(oldBoard, this.board)) {
      boardChanged = true;
    }

    this._handleMoveEnd(boardChanged);

    return boardChanged;
  }

  resetBoard() {
    this.board = [];

    for (let r = 0; r < this.boardSize; r++) {
      const row = [];

      for (let c = 0; c < this.boardSize; c++) {
        row.push(0);
      }

      this.board.push(row);
    }
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[randomIndex];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[r][c] = newValue;
  }

  checkWinCondition() {
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (this.board[r][c] === this.winningTile) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameOver() {
    if (this.getEmptyCells().length > 0) {
      return false;
    }

    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize - 1; c++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r][c + 1]
        ) {
          return false;
        }
      }
    }

    for (let c = 0; c < this.boardSize; c++) {
      for (let r = 0; r < this.boardSize - 1; r++) {
        if (
          this.board[r][c] !== 0 &&
          this.board[r][c] === this.board[r + 1][c]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  _slideAndMerge(line) {
    let changed = false;
    let newScoreAdded = 0;

    const filteredLine = line.filter((val) => val !== 0);
    const mergedLine = [];

    for (let i = 0; i < filteredLine.length; i++) {
      if (
        i + 1 < filteredLine.length &&
        filteredLine[i] === filteredLine[i + 1]
      ) {
        const mergedValue = filteredLine[i] * 2;

        mergedLine.push(mergedValue);
        newScoreAdded += mergedValue;
        changed = true;
        i++;
      } else {
        mergedLine.push(filteredLine[i]);
      }
    }

    while (mergedLine.length < this.boardSize) {
      mergedLine.push(0);
    }

    if (!changed) {
      for (let i = 0; i < this.boardSize; i++) {
        if (line[i] !== mergedLine[i]) {
          changed = true;
          break;
        }
      }
    }

    this.score += newScoreAdded;

    return { newLine: mergedLine, changed: changed };
  }

  _handleMoveEnd(boardChanged) {
    if (boardChanged) {
      this.addRandomTile();
    }

    this.getStatus();
  }

  _compareBoards(board1, board2) {
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        if (board1[r][c] !== board2[r][c]) {
          return false;
        }
      }
    }

    return true;
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
    return JSON.parse(JSON.stringify(this.board));
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
    if (this.hasWon) {
      return 'win';
    }

    if (this.checkWinCondition()) {
      this.hasWon = true;
      this.status = 'win';

      return 'win';
    }

    if (this.checkGameOver()) {
      this.status = 'lose';

      return 'lose';
    }

    return this.status;
  }

  start() {
    this.resetBoard();
    this.score = 0;
    this.status = 'playing';
    this.hasWon = false;

    this.addRandomTile();
    this.addRandomTile();

    return this.getState();
  }

  restart() {
    return this.start();
  }
}

export default Game;

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
  constructor(initialState = Game.createEmptyBoard()) {
    this.initialState = Game.cloneBoard(initialState);
    this.board = Game.cloneBoard(initialState);
    this.score = 0;
    this.status = Game.isBoardEmpty(this.board) ? 'idle' : 'playing';
  }

  moveLeft() {
    return this.makeMove('left');
  }

  moveRight() {
    return this.makeMove('right');
  }

  moveUp() {
    return this.makeMove('up');
  }

  moveDown() {
    return this.makeMove('down');
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
    return Game.cloneBoard(this.board);
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

    this.board = Game.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();

    this.updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Game.cloneBoard(this.initialState);
    this.score = 0;
    this.status = Game.isBoardEmpty(this.board) ? 'idle' : 'playing';
  }

  makeMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = Game.cloneBoard(this.board);
    let movedBoard = [];
    let moveScore = 0;

    switch (direction) {
      case 'left':
        ({ board: movedBoard, score: moveScore } = this.moveBoardLeft(
          this.board,
        ));
        break;

      case 'right':
        ({ board: movedBoard, score: moveScore } = this.moveBoardRight(
          this.board,
        ));
        break;

      case 'up':
        ({ board: movedBoard, score: moveScore } = this.moveBoardUp(
          this.board,
        ));
        break;

      case 'down':
        ({ board: movedBoard, score: moveScore } = this.moveBoardDown(
          this.board,
        ));
        break;

      default:
        return false;
    }

    if (Game.areBoardsEqual(oldBoard, movedBoard)) {
      return false;
    }

    this.board = movedBoard;
    this.score += moveScore;
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  moveBoardLeft(board) {
    const newBoard = [];
    let totalScore = 0;

    for (const row of board) {
      const { line, score } = this.processLine(row);

      newBoard.push(line);
      totalScore += score;
    }

    return {
      board: newBoard,
      score: totalScore,
    };
  }

  moveBoardRight(board) {
    const reversedBoard = board.map((row) => [...row].reverse());
    const moved = this.moveBoardLeft(reversedBoard);

    return {
      board: moved.board.map((row) => row.reverse()),
      score: moved.score,
    };
  }

  moveBoardUp(board) {
    const transposed = Game.transpose(board);
    const moved = this.moveBoardLeft(transposed);

    return {
      board: Game.transpose(moved.board),
      score: moved.score,
    };
  }

  moveBoardDown(board) {
    const transposed = Game.transpose(board);
    const moved = this.moveBoardRight(transposed);

    return {
      board: Game.transpose(moved.board),
      score: moved.score,
    };
  }

  processLine(line) {
    const filtered = line.filter((value) => value !== 0);
    const merged = [];
    let score = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const doubled = filtered[i] * 2;

        merged.push(doubled);
        score += doubled;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return {
      line: merged,
      score,
    };
  }

  addRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let row = 0; row < this.board.length; row++) {
      // eslint-disable-next-line no-shadow
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = value;
  }

  updateStatus() {
    if (this.hasWon()) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  hasWon() {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];

        if (value === 0) {
          return true;
        }

        if (col < 3 && value === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && value === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  static createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  static cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  static transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  static areBoardsEqual(boardA, boardB) {
    for (let row = 0; row < boardA.length; row++) {
      for (let col = 0; col < boardA[row].length; col++) {
        if (boardA[row][col] !== boardB[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  static isBoardEmpty(board) {
    return board.every((row) => row.every((cell) => cell === 0));
  }
}

module.exports = Game;

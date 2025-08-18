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
   * @defaulta
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

    if (!initialState) {
      this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    } else {
      this.board = initialState;
    }

    this.score = 0;
    this.status = 'idle';
  }

  // Moves
  moveLeft() {
    const oldBoard = this.cloneBoard();

    this.moveProcess(this.board);
    this.moveFinal(oldBoard);
  }
  moveRight() {
    const oldBoard = this.cloneBoard();

    this.reverseRows();
    this.moveProcess(this.board);
    this.reverseRows();
    this.moveFinal(oldBoard);
  }
  moveUp() {
    const oldBoard = this.cloneBoard();

    this.board = this.transpose(this.board);
    this.moveProcess(this.board);
    this.board = this.transpose(this.board);
    this.moveFinal(oldBoard);
  }
  moveDown() {
    const oldBoard = this.cloneBoard();

    this.board = this.transpose(this.board);
    this.reverseRows();
    this.moveProcess(this.board);
    this.reverseRows();
    this.board = this.transpose(this.board);
    this.moveFinal(oldBoard);
  }

  // Clone board
  cloneBoard() {
    return this.board.map((row) => [...row]);
  }

  // Shift cells left
  leftShift(currentBoard) {
    return currentBoard.forEach((row) => {
      let currentEmptyCell = 0;

      for (let i = 0; i < 4; i++) {
        if (row[i] !== 0) {
          if (i !== currentEmptyCell) {
            row[currentEmptyCell] = row[i];
            row[i] = 0;
            currentEmptyCell++;
          } else {
            currentEmptyCell++;
          }
        }
      }
    });
  }

  // Reverse rows
  reverseRows() {
    return this.board.forEach((row) => row.reverse());
  }

  // Transpose board
  transpose() {
    return this.board[0].map((_, columnIndex) => {
      return this.board.map((row) => row[columnIndex]);
    });
  }

  // Process move (shift + merge)
  moveProcess(board) {
    this.leftShift(board);

    board.forEach((row) => {
      for (let i = 1; i < 4; i++) {
        if (row[i - 1] === row[i]) {
          row[i - 1] += row[i];
          this.score += row[i - 1];
          row[i] = 0;
        }
      }
    });
    this.leftShift(board);
  }

  // Finish move (add tile, update status)
  moveFinal(oldBoard) {
    const boardChanged = !this.boardsEqual(oldBoard, this.board);

    if (boardChanged) {
      this.addNewTile();
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
    this.restart();
    this.status = 'playing';
    this.addNewTile();
    this.addNewTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
  }

  // Find random empty cell
  findEmptyCell() {
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

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  // Place new tile (2 or 4)
  addNewTile() {
    const emptyCellCoords = this.findEmptyCell();

    if (emptyCellCoords) {
      this.board[emptyCellCoords.row][emptyCellCoords.col] =
        Math.random() < 0.9 ? 2 : 4;
    }
  }

  // Compare boards
  boardsEqual(board1, board2) {
    return JSON.stringify(board1) === JSON.stringify(board2);
  }

  // Update game status
  updateStatus() {
    this.checkWin();
    this.checkGameOver();
  }

  // Check win (tile 2048)
  checkWin() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }
  }

  // Check lose (no empty cells)
  checkGameOver() {
    const hasEmptyCell = this.findEmptyCell() !== undefined;

    if (!hasEmptyCell && !this.hasPossibleMerge()) {
      this.status = 'lose';
    }
  }

  // Check possible merge
  hasPossibleMerge() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          (row < 3 && this.board[row][col] === this.board[row + 1][col]) ||
          (col < 3 && this.board[row][col] === this.board[row][col + 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;

// src/modules/Game.class.js
export class Game {
  constructor(initialState) {
    // 4x4 board, 0 = empty cell
    this.size = 4;
    this.score = 0;
    this.status = 'start'; // 'start' | 'playing' | 'won' | 'gameover'

    if (initialState) {
      this.board = initialState.map((row) => row.slice());
    } else {
      this.board = this.createEmptyBoard();
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  createEmptyBoard() {
    return Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(0));
  }

  getState() {
    return this.board.map((row) => row.slice());
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
  }

  restart() {
    this.score = 0;
    this.status = 'start';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  // =================== MOVES ===================
  moveLeft() {
    return this.move(this.board, 'left');
  }

  moveRight() {
    return this.move(this.board, 'right');
  }

  moveUp() {
    // transpose board, move left, transpose back
    this.board = this.transpose(this.board);

    const moved = this.moveLeft();

    this.board = this.transpose(this.board);

    return moved;
  }

  moveDown() {
    this.board = this.transpose(this.board);

    const moved = this.moveRight();

    this.board = this.transpose(this.board);

    return moved;
  }

  // =================== CORE MOVE LOGIC ===================
  move(board, direction) {
    // direction is 'left' or 'right'
    let moved = false;
    let totalMergedScore = 0;

    for (let i = 0; i < this.size; i++) {
      const row = board[i].slice();

      const { newRow, mergedScore, changed } = this.slideAndMergeRow(
        row,
        direction,
      );

      if (changed) {
        moved = true;
      }
      totalMergedScore += mergedScore;

      board[i] = newRow;
    }

    if (moved) {
      this.score += totalMergedScore;
      this.addRandomTile();

      // Check for win
      if (this.hasValue(2048)) {
        this.status = 'won';
      } else if (!this.canMove()) {
        this.status = 'gameover';
      } else {
        this.status = 'playing';
      }
    }

    return moved;
  }

  slideAndMergeRow(row, direction) {
    // Slide all numbers to the left/right and merge equal adjacent tiles
    let changed = false;
    let mergedScore = 0;

    // If moving right, reverse row to reuse left logic
    let arr = direction === 'right' ? row.slice().reverse() : row.slice();

    // Slide non-zero to left
    arr = arr.filter((x) => x !== 0);

    // Merge adjacent equals
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        mergedScore += arr[i];
        arr[i + 1] = 0;
        i++; // skip next
      }
    }

    // Remove zeros after merge
    arr = arr.filter((x) => x !== 0);

    // Fill the rest with zeros
    while (arr.length < this.size) {
      arr.push(0);
    }

    // Reverse back if needed
    if (direction === 'right') {
      arr.reverse();
    }

    // Detect if row changed
    for (let i = 0; i < this.size; i++) {
      if (arr[i] !== row[i]) {
        changed = true;
        break;
      }
    }

    return { newRow: arr, mergedScore, changed };
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // 10% chance for 4, otherwise 2
    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;

    return true;
  }

  hasValue(value) {
    return this.board.some((row) => row.includes(value));
  }

  canMove() {
    // Check if any move is possible (empty cells or merges possible)
    if (this.board.some((row) => row.includes(0))) {
      return true;
    }

    // Check horizontally for merges
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    // Check vertically for merges
    for (let c = 0; c < this.size; c++) {
      for (let r = 0; r < this.size - 1; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }
}

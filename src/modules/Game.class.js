'use strict';

/**
 * This class represents the game logic.
 * It tracks tile identities with unique IDs to enable smooth animations.
 */
class Game {
  constructor(initialState = null) {
    this.tileIdCounter = 0;
    this.score = 0;
    this.status = 'idle';
    this.board = this.createBoard();

    if (initialState) {
      initialState.forEach((row, r) => {
        row.forEach((val, c) => {
          if (val > 0) {
            this.board[r][c] = { value: val, id: ++this.tileIdCounter };
          }
        });
      });
    }
  }

  // ---------- Public API ----------
  moveLeft() {
    return this.move('left');
  }
  moveRight() {
    return this.move('right');
  }
  moveUp() {
    return this.move('up');
  }
  moveDown() {
    return this.move('down');
  }

  getScore() {
    return this.score;
  }

  /**
   * Returns a 2D array of numbers for compatibility with tests.
   */
  getState() {
    return this.board.map((row) => row.map((tile) => (tile ? tile.value : 0)));
  }

  /**
   * Returns the board with full tile objects (value, id, flags) for the UI.
   */
  getDetailedState() {
    return this.board.map((r) => r.map((t) => (t ? { ...t } : null)));
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.createBoard();
    this.score = 0;
    this.status = 'idle';
    this.tileIdCounter = 0;
  }

  // ---------- Private helper methods ----------
  createBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(null));
  }

  clone(board) {
    return board.map((row) => row.map((tile) => (tile ? { ...tile } : null)));
  }

  addRandomTile() {
    const empty = [];

    this.board.forEach((row, r) => {
      row.forEach((tile, c) => {
        if (!tile) {
          empty.push([r, c]);
        }
      });
    });

    if (empty.length === 0) {
      return;
    }

    const [randRow, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[randRow][col] = {
      value: Math.random() < 0.1 ? 4 : 2,
      id: ++this.tileIdCounter,
      isNew: true,
    };
  }

  rotateBoard(board, times = 1) {
    let result = this.clone(board);

    for (let t = 0; t < times; t++) {
      result = result[0].map((_, i) => result.map((row) => row[3 - i]));
    }

    return result;
  }

  compress(row) {
    const newRow = row.filter((tile) => tile !== null);

    while (newRow.length < 4) {
      newRow.push(null);
    }

    return newRow;
  }

  merge(row) {
    const mergedValues = [];

    for (let i = 0; i < 3; i++) {
      if (row[i] && row[i + 1] && row[i].value === row[i + 1].value) {
        const newValue = row[i].value * 2;

        row[i] = {
          value: newValue,
          id: ++this.tileIdCounter,
          mergedFrom: [row[i].id, row[i + 1].id],
        };
        row[i + 1] = null;
        mergedValues.push(newValue);
      }
    }

    return { row, mergedValues };
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    // Clear temporary animation flags
    this.board.forEach((row) => {
      row.forEach((tile) => {
        if (tile) {
          delete tile.isNew;
          delete tile.mergedFrom;
        }
      });
    });

    const rotationMap = {
      left: 0,
      up: 1,
      right: 2,
      down: 3,
    };
    const rotations = rotationMap[direction];
    let board = this.rotateBoard(this.board, rotations);
    let moved = false;
    const allMerged = [];

    for (let r = 0; r < 4; r++) {
      const originalValues = board[r].map((t) => (t ? t.value : 0));
      let row = this.compress(board[r]);
      const { row: mergedRow, mergedValues } = this.merge(row);

      allMerged.push(...mergedValues);
      row = this.compress(mergedRow);
      board[r] = row;

      const currentValues = row.map((t) => (t ? t.value : 0));

      if (!moved && !this.arraysEqual(originalValues, currentValues)) {
        moved = true;
      }
    }

    board = this.rotateBoard(board, (4 - rotations) % 4);

    if (moved) {
      this.board = board;
      this.score += allMerged.reduce((sum, v) => sum + v, 0);
      this.addRandomTile();
      this.checkWin();

      if (!this.canMove()) {
        this.status = 'lose';
      }
    }

    return moved;
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  canMove() {
    if (this.board.some((row) => row.includes(null))) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.board[r][c].value;

        if (c < 3 && val === this.board[r][c + 1].value) {
          return true;
        }

        if (r < 3 && val === this.board[r + 1][c].value) {
          return true;
        }
      }
    }

    return false;
  }

  checkWin() {
    if (
      this.board.some((row) => row.some((tile) => tile && tile.value === 2048))
    ) {
      this.status = 'win';
    }
  }
}

module.exports = Game;

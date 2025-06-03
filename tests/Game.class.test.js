'use strict';

class Game {
  constructor(initialState = null) {
    // Initialize board: use provided state or empty 4x4 board
    this.board = initialState
      ? initialState.map((row) => [...row]) // Deep copy
      : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.board.map((row) => [...row]); // Return a deep copy
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      // Add two random tiles (2 or 4)
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    // Reset to initial state (empty or custom)
    this.board = this.board.map((row) => row.map(() => 0)); // Reset to empty
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }
    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      this.board[row][col] = Math.random() < 0.9 ? 2 : 4; // 90% chance of 2, 10% chance of 4
    }
  }

  moveLeft() {
    if (this.status !== 'playing') return;
    let changed = false;
    let scoreDelta = 0;

    for (let i = 0; i < 4; i++) {
      let row = this.board[i].filter((val) => val !== 0); // Remove zeros
      let newRow = [];
      let j = 0;
      while (j < row.length) {
        if (j + 1 < row.length && row[j] === row[j + 1]) {
          // Merge equal tiles
          newRow.push(row[j] * 2);
          scoreDelta += row[j] * 2;
          j += 2;
          changed = true;
        } else {
          newRow.push(row[j]);
          j++;
        }
      }
      // Pad with zeros
      while (newRow.length < 4) newRow.push(0);
      if (newRow.join() !== this.board[i].join()) changed = true;
      this.board[i] = newRow;
    }

    if (changed) {
      this.score += scoreDelta;
      this.addRandomTile();
    }
    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') return;
    let changed = false;
    let scoreDelta = 0;

    for (let i = 0; i < 4; i++) {
      let row = this.board[i].filter((val) => val !== 0).reverse(); // Remove zeros and reverse
      let newRow = [];
      let j = 0;
      while (j < row.length) {
        if (j + 1 < row.length && row[j] === row[j + 1]) {
          newRow.push(row[j] * 2);
          scoreDelta += row[j] * 2;
          j += 2;
          changed = true;
        } else {
          newRow.push(row[j]);
          j++;
        }
      }
      // Pad with zeros and reverse back
      while (newRow.length < 4) newRow.unshift(0);
      newRow = newRow.reverse();
      if (newRow.join() !== this.board[i].join()) changed = true;
      this.board[i] = newRow;
    }

    if (changed) {
      this.score += scoreDelta;
      this.addRandomTile();
    }
    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') return;
    let changed = false;
    let scoreDelta = 0;

    // Transpose board to treat columns as rows
    let transposed = this.transpose();
    for (let i = 0; i < 4; i++) {
      let col = transposed[i].filter((val) => val !== 0);
      let newCol = [];
      let j = 0;
      while (j < col.length) {
        if (j + 1 < col.length && col[j] === col[j + 1]) {
          newCol.push(col[j] * 2);
          scoreDelta += col[j] * 2;
          j += 2;
          changed = true;
        } else {
          newCol.push(col[j]);
          j++;
        }
      }
      while (newCol.length < 4) newCol.push(0);
      if (newCol.join() !== transposed[i].join()) changed = true;
      transposed[i] = newCol;
    }

    // Transpose back
    this.board = this.transpose(transposed);
    if (changed) {
      this.score += scoreDelta;
      this.addRandomTile();
    }
    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') return;
    let changed = false;
    let scoreDelta = 0;

    let transposed = this.transpose();
    for (let i = 0; i < 4; i++) {
      let col = transposed[i].filter((val) => val !== 0).reverse();
      let newCol = [];
      let j = 0;
      while (j < col.length) {
        if (j + 1 < col.length && col[j] === col[j + 1]) {
          newCol.push(col[j] * 2);
          scoreDelta += col[j] * 2;
          j += 2;
          changed = true;
        } else {
          newCol.push(col[j]);
          j++;
        }
      }
      while (newCol.length < 4) newCol.unshift(0);
      newCol = newCol.reverse();
      if (newCol.join() !== transposed[i].join()) changed = true;
      transposed[i] = newCol;
    }

    this.board = this.transpose(transposed);
    if (changed) {
      this.score += scoreDelta;
      this.addRandomTile();
    }
    this.updateStatus();
  }

  transpose(board = this.board) {
    const result = [];
    for (let col = 0; col < 4; col++) {
      result[col] = [];
      for (let row = 0; row < 4; row++) {
        result[col][row] = board[row][col];
      }
    }
    return result;
  }

  updateStatus() {
    // Check for win (2048 tile)
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
      return;
    }

    // Check for lose (no moves possible)
    const hasEmpty = this.board.flat().includes(0);
    let hasMerge = false;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.board[i][j] === this.board[i][j + 1] &&
          this.board[i][j] !== 0
        ) {
          hasMerge = true;
        }
        if (
          i < 3 &&
          this.board[i][j] === this.board[i + 1][j] &&
          this.board[i][j] !== 0
        ) {
          hasMerge = true;
          }
        }
      }
      if (!hasEmpty && !hasMerge) {
        this.status = 'lose';
      } else if (this.status === 'playing') {
        this.status = 'idle'; // Reset to idle if no win/lose
      }
    }
    toString() {
      return this.board.map((row) => row.join(' ')).join('\n');
    }
  }
  
  // Move your test code outside the class definition
  describe('Game', () => {
    test('should create a new game', () => {
      // algum código aqui
    });
  });

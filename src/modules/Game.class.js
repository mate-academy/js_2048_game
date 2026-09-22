'use strict';

class Game {
  constructor(initialState) {
    if (initialState) {
      this.initialState = this._copyBoard(initialState);
      this.board = this._copyBoard(initialState);
    } else {
      this.initialState = null;
      this.board = this._getEmptyBoard();
    }

    this.score = 0;
    this.status = 'idle';
  }

  _getEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  _copyBoard(board) {
    return board.map((row) => [...row]);
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  _compress(row) {
    const newRow = row.filter((value) => value !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  _merge(row) {
    for (let i = 0; i < 3; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row[i + 1] = 0;

        if (row[i] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  _moveRow(row) {
    const compressedRow = this._compress(row);

    this._merge(compressedRow);

    return this._compress(compressedRow);
  }

  _rotateLeft(board) {
    const newBoard = this._getEmptyBoard();

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newBoard[3 - col][row] = board[row][col];
      }
    }

    return newBoard;
  }

  _rotateRight(board) {
    const newBoard = this._getEmptyBoard();

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newBoard[col][3 - row] = board[row][col];
      }
    }

    return newBoard;
  }

  _checkMove(oldBoard, newBoard) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldBoard[row][col] !== newBoard[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  _updateStatus() {
    if (this.status === 'win') {
      return;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  _move(transform) {
    if (this.status !== 'playing') {
      return false;
    }

    const newBoard = transform(this._copyBoard(this.board));

    if (!this._checkMove(this.board, newBoard)) {
      return false;
    }

    this.board = newBoard;

    if (this.status !== 'win') {
      this._addRandomTile();
      this._updateStatus();
    }

    return true;
  }

  moveLeft() {
    return this._move((board) => {
      return board.map((row) => this._moveRow(row));
    });
  }

  moveRight() {
    return this._move((board) => {
      return board.map((row) => {
        const reversedRow = [...row].reverse();

        return this._moveRow(reversedRow).reverse();
      });
    });
  }

  moveUp() {
    return this._move((board) => {
      const rotated = this._rotateLeft(board);
      const moved = rotated.map((row) => this._moveRow(row));

      return this._rotateRight(moved);
    });
  }

  moveDown() {
    return this._move((board) => {
      const rotated = this._rotateRight(board);
      const moved = rotated.map((row) => this._moveRow(row));

      return this._rotateLeft(moved);
    });
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    if (!this.initialState) {
      this._addRandomTile();
      this._addRandomTile();
    }
  }

  restart() {
    if (this.initialState) {
      this.board = this._copyBoard(this.initialState);
    } else {
      this.board = this._getEmptyBoard();
    }

    this.score = 0;
    this.status = 'idle';

    this.start();
  }
}

export default Game;

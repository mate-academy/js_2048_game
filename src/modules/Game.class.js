'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = initialState.map((row) => [...row]);
      this.size = this.board.length;
    } else {
      this.board = Array.from(
        { length: this.size },
        () => Array(this.size).fill(0), //
      );
    }
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = Array.from(
      { length: this.size },
      () =>
        //
        Array(this.size).fill(0), //
    );
    this.score = 0;
    this.status = 'playing';
    this._addRandomTile();
    this._addRandomTile();
  }

  restart() {
    this.board = Array.from(
      { length: this.size },
      () =>
        //
        Array(this.size).fill(0), //
    );
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  moveLeft() {
    return this._move('left');
  }

  moveRight() {
    return this._move('right');
  }

  moveUp() {
    return this._move('up');
  }

  moveDown() {
    return this._move('down');
  }

  _move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    let boardChanged = false;
    let currentBoard = this.board.map((row) => [...row]);

    if (direction === 'up' || direction === 'down') {
      currentBoard = this._transpose(currentBoard);
    }

    if (direction === 'right' || direction === 'down') {
      currentBoard = currentBoard.map((row) => [...row].reverse());
    }

    const newBoard = [];

    for (let r = 0; r < this.size; r++) {
      const processedRow = this._processRowLeftInternal(currentBoard[r]);

      newBoard.push(processedRow);
    }
    currentBoard = newBoard;

    if (direction === 'right' || direction === 'down') {
      currentBoard = currentBoard.map((row) => [...row].reverse());
    }

    if (direction === 'up' || direction === 'down') {
      currentBoard = this._transpose(currentBoard);
    }

    boardChanged =
      this.board.map((row) => row.join(',')).join('|') !==
      currentBoard.map((row) => row.join(',')).join('|');

    this.board = currentBoard;

    if (boardChanged) {
      this._addRandomTile();
      this._checkGameStatus();
    }

    return boardChanged;
  }

  _processRowLeftInternal(inputRow) {
    const nonZeroElements = inputRow.filter((cellValue) => cellValue !== 0);
    const shiftedRow = [...nonZeroElements];

    while (shiftedRow.length < this.size) {
      shiftedRow.push(0);
    }

    const finalProcessedRow = [];
    let i = 0;

    while (i < this.size) {
      const currentTile = shiftedRow[i];

      if (currentTile === 0) {
        break;
      }

      if (i + 1 < this.size && currentTile === shiftedRow[i + 1]) {
        const mergedValue = currentTile * 2;

        finalProcessedRow.push(mergedValue);
        this.score += mergedValue;
        i += 2;
      } else {
        finalProcessedRow.push(currentTile);
        i += 1;
      }
    }

    while (finalProcessedRow.length < this.size) {
      finalProcessedRow.push(0);
    }

    return finalProcessedRow;
  }

  _transpose(boardToTranspose) {
    const newBoard = Array.from(
      { length: this.size },
      () =>
        //
        Array(this.size).fill(0), //
    );

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        newBoard[c][r] = boardToTranspose[r][c];
      }
    }

    return newBoard;
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let rowIdx = 0; rowIdx < this.size; rowIdx++) {
      for (let colIdx = 0; colIdx < this.size; colIdx++) {
        if (this.board[rowIdx][colIdx] === 0) {
          emptyCells.push([rowIdx, colIdx]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [r, c] = emptyCells[randomIndex];
    const newTileValue = Math.random() < 0.1 ? 4 : 2;

    this.board[r][c] = newTileValue;

    return true;
  }

  _checkForWin() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  _canMove() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    for (let r2 = 0; r2 < this.size; r2++) {
      for (let c2 = 0; c2 < this.size; c2++) {
        const current = this.board[r2][c2];

        if (c2 + 1 < this.size && current === this.board[r2][c2 + 1]) {
          return true;
        }

        if (r2 + 1 < this.size && current === this.board[r2 + 1][c2]) {
          return true;
        }
      }
    }

    return false;
  }

  _checkGameStatus() {
    if (this.status !== 'playing') {
      return;
    }

    if (this._checkForWin()) {
      this.status = 'win';
    } else if (!this._canMove()) {
      this.status = 'lose';
    }
  }
}

export default Game;

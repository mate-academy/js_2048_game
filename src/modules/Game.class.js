'use strict';
class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.initialBoard = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.board = this.initialBoard.map((row) => [...row]);
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
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
    this.board = this.initialBoard.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const availablePositions = [];

    for (let gridRow = 0; gridRow < this.size; gridRow++) {
      for (let gridColumn = 0; gridColumn < this.size; gridColumn++) {
        if (this.board[gridRow][gridColumn] === 0) {
          availablePositions.push([gridRow, gridColumn]);
        }
      }
    }

    if (availablePositions.length === 0) {
      return false;
    }

    const selectedPositionIndex = Math.floor(
      Math.random() * availablePositions.length,
    );

    const [targetRow, targetColumn] = availablePositions[selectedPositionIndex];

    this.board[targetRow][targetColumn] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }

  processRow(gridRow) {
    const nonEmptyTiles = gridRow.filter((tileValue) => tileValue !== 0);
    const mergedRow = [];

    for (let tileIndex = 0; tileIndex < nonEmptyTiles.length; tileIndex++) {
      if (nonEmptyTiles[tileIndex] === nonEmptyTiles[tileIndex + 1]) {
        const doubledTile = nonEmptyTiles[tileIndex] * 2;

        mergedRow.push(doubledTile);
        this.score += doubledTile;
        tileIndex++;
      } else {
        mergedRow.push(nonEmptyTiles[tileIndex]);
      }
    }

    while (mergedRow.length < this.size) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  moveLeft() {
    this.makeMove((board) => board.map((row) => this.processRow(row)));
  }

  moveRight() {
    // eslint-disable-next-line
    this.makeMove((board) => board.map((row) => this.processRow([...row].reverse()).reverse()));
  }

  moveUp() {
    this.makeMove((board) => {
      const transposed = this.transpose(board);
      const moved = transposed.map((row) => this.processRow(row));

      return this.transpose(moved);
    });
  }

  moveDown() {
    this.makeMove((board) => {
      const transposed = this.transpose(board);
      // eslint-disable-next-line
      const moved = transposed.map((row) => this.processRow([...row].reverse()).reverse());

      return this.transpose(moved);
    });
  }

  makeMove(transform) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.getState();
    const newBoard = transform(this.getState());

    const changed = JSON.stringify(oldBoard) !== JSON.stringify(newBoard);

    if (!changed) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
  }

  transpose(board) {
    return board[0].map((_, col) => board.map((row) => row[col]));
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = this.board[row][col];

        if (value === 0) {
          return true;
        }

        if (col < this.size - 1 && value === this.board[row][col + 1]) {
          return true;
        }

        if (row < this.size - 1 && value === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

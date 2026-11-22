'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.status = 'idle';
    this.board = initialState.map((row) => [...row]);
    this.initialState = initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = Array.from({ length: 4 }, () => [0, 0, 0, 0]);

    for (let row = 0; row < 4; row++) {
      const tiles = [];

      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];

        if (value !== 0) {
          tiles.push(value);
        }
      }

      let targetCol = 0;

      for (let i = 0; i < tiles.length; i++) {
        let value = tiles[i];

        if (value === tiles[i + 1]) {
          value *= 2;
          this.score += value;
          i++;
        }

        newBoard[row][targetCol] = value;
        targetCol++;
      }
    }

    if (!this.isBoardChanged(newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = Array.from({ length: 4 }, () => [0, 0, 0, 0]);

    for (let row = 0; row < 4; row++) {
      const tiles = [];

      for (let col = 3; col >= 0; col--) {
        const value = this.board[row][col];

        if (value !== 0) {
          tiles.push(value);
        }
      }

      let targetCol = 3;

      for (let i = 0; i < tiles.length; i++) {
        let value = tiles[i];

        if (value === tiles[i + 1]) {
          value *= 2;
          this.score += value;
          i++;
        }

        newBoard[row][targetCol] = value;
        targetCol--;
      }
    }

    if (!this.isBoardChanged(newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = Array.from({ length: 4 }, () => [0, 0, 0, 0]);

    for (let col = 0; col < 4; col++) {
      const tiles = [];

      for (let row = 0; row < 4; row++) {
        const value = this.board[row][col];

        if (value !== 0) {
          tiles.push(value);
        }
      }

      let targetRow = 0;

      for (let i = 0; i < tiles.length; i++) {
        let value = tiles[i];

        if (value === tiles[i + 1]) {
          value *= 2;
          this.score += value;
          i++;
        }

        newBoard[targetRow][col] = value;
        targetRow++;
      }
    }

    if (!this.isBoardChanged(newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = Array.from({ length: 4 }, () => [0, 0, 0, 0]);

    for (let col = 0; col < 4; col++) {
      const tiles = [];

      for (let row = 3; row >= 0; row--) {
        const value = this.board[row][col];

        if (value !== 0) {
          tiles.push(value);
        }
      }

      let targetRow = 3;

      for (let i = 0; i < tiles.length; i++) {
        let value = tiles[i];

        if (value === tiles[i + 1]) {
          value *= 2;
          this.score += value;
          i++;
        }

        newBoard[targetRow][col] = value;
        targetRow--;
      }
    }

    if (!this.isBoardChanged(newBoard)) {
      return;
    }

    this.board = newBoard;
    this.addRandomTile();
    this.updateStatus();
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';
    this.board = this.initialState.map((row) => [...row]);
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
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
    const randomCell = emptyCells[randomIndex];
    const [row, col] = randomCell;

    if (Math.random() >= 0.1) {
      this.board[row][col] = 2;
    } else {
      this.board[row][col] = 4;
    }
  }

  isBoardChanged(newBoard) {
    return newBoard.some((row, indexRow) => {
      const oldRow = this.board[indexRow];

      return row.some((cel, indexCol) => cel !== oldRow[indexCol]);
    });
  }

  updateStatus() {
    const allCells = this.board.flat();
    const isWinGame = allCells.includes(2048);

    if (isWinGame) {
      this.status = 'win';

      return;
    }

    if (!allCells.includes(0) && !this.canMerge()) {
      this.status = 'lose';
    }
  }

  canMerge() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

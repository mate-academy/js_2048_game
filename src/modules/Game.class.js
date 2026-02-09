'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState
      ? structuredClone(initialState)
      : this.getEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  getEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[randomCell[0]][randomCell[1]] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slide(row) {
    const nonZeroTiles = row.filter((value) => value !== 0);
    const mergedRow = [];
    let rowScore = 0;

    for (let i = 0; i < nonZeroTiles.length; i++) {
      if (nonZeroTiles[i] === nonZeroTiles[i + 1]) {
        const mergedValue = nonZeroTiles[i] * 2;

        mergedRow.push(mergedValue);
        rowScore += mergedValue;
        i++;
      } else {
        mergedRow.push(nonZeroTiles[i]);
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return { mergedRow, score: rowScore };
  }

  handleMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = structuredClone(this.board);
    let moveScore = 0;

    switch (direction) {
      case 'left':
        for (let r = 0; r < 4; r++) {
          const { mergedRow, score } = this.slide(this.board[r]);

          this.board[r] = mergedRow;
          moveScore += score;
        }
        break;
      case 'right':
        for (let r = 0; r < 4; r++) {
          const row = [...this.board[r]].reverse();
          const { mergedRow, score } = this.slide(row);

          this.board[r] = mergedRow.reverse();
          moveScore += score;
        }
        break;
      case 'up':
        for (let c = 0; c < 4; c++) {
          const column = [];

          for (let r = 0; r < 4; r++) {
            column.push(this.board[r][c]);
          }

          const { mergedRow, score } = this.slide(column);

          moveScore += score;

          for (let r = 0; r < 4; r++) {
            this.board[r][c] = mergedRow[r];
          }
        }
        break;
      case 'down':
        for (let c = 0; c < 4; c++) {
          const column = [];

          for (let r = 3; r >= 0; r--) {
            column.push(this.board[r][c]);
          }

          const { mergedRow, score } = this.slide(column);

          moveScore += score;

          for (let r = 3; r >= 0; r--) {
            this.board[r][c] = mergedRow[3 - r];
          }
        }
        break;
    }

    if (this.isBoardChanged(oldBoard)) {
      this.score += moveScore;
      this.addRandomTile();

      if (this.isWin()) {
        this.status = 'win';
      } else if (this.isGameOver()) {
        this.status = 'lose';
      }
    }
  }

  isBoardChanged(oldBoard) {
    return JSON.stringify(this.board) !== JSON.stringify(oldBoard);
  }

  isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return false;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  isWin() {
    return this.board.flat().includes(2048);
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
  moveLeft() {
    this.handleMove('left');
  }
  moveRight() {
    this.handleMove('right');
  }
  moveUp() {
    this.handleMove('up');
  }
  moveDown() {
    this.handleMove('down');
  }
  start() {
    this.board = this.getEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }
  restart() {
    this.start();
  }
}

module.exports = Game;

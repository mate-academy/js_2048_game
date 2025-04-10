'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    initialScore = 0,
  ) {
    this.board = initialState;
    this.currentBoard = [...initialState];
    this.initialScore = initialScore;
    this.currentScore = initialScore;
    this.status = 'idle';
    this.hasWon = false;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slideTiles(columns) {
    for (let col = 0; col < 4; col++) {
      let column = columns[col];

      column = this.combineTiles(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }
  }

  combineTiles(tiles) {
    const result = tiles.filter((tile) => tile !== 0);
    let scoreChange = 0;

    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === result[i + 1]) {
        result[i] *= 2;
        result[i + 1] = 0;
        scoreChange += result[i];
      }
    }

    const newTiles = result
      .filter((tile) => tile !== 0)
      .concat([0, 0, 0, 0])
      .slice(0, 4);

    this.currentScore += scoreChange;

    return newTiles;
  }

  cellsGroupedByColumn() {
    const groupedColumns = [[], [], [], []];

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        groupedColumns[col].push(this.board[row][col]);
      }
    }

    return groupedColumns;
  }

  cellsGroupedByRow() {
    const groupedRows = [[], [], [], []];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        groupedRows[row].push(this.board[row][col]);
      }
    }

    return groupedRows;
  }

  moveLeft() {
    const previousState = JSON.stringify(this.board);
    const rows = this.cellsGroupedByRow();

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      let row = rows[rowIdx];

      row = this.combineTiles(row);
      this.board[rowIdx] = row;
    }

    if (JSON.stringify(this.board) !== previousState) {
      this.addRandomTile();
    }
  }

  moveRight() {
    const previousState = JSON.stringify(this.board);
    const rows = this.cellsGroupedByRow();

    for (let rowIdx = 0; rowIdx < 4; rowIdx++) {
      let row = rows[rowIdx].reverse();

      row = this.combineTiles(row);
      row.reverse();
      this.board[rowIdx] = row;
    }

    if (JSON.stringify(this.board) !== previousState) {
      this.addRandomTile();
    }
  }

  moveUp() {
    const previousState = JSON.stringify(this.board);
    const columns = this.cellsGroupedByColumn();

    for (let col = 0; col < 4; col++) {
      let column = columns[col];

      column = this.combineTiles(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }

    if (JSON.stringify(this.board) !== previousState) {
      this.addRandomTile();
    }
  }

  moveDown() {
    const previousState = JSON.stringify(this.board);
    const columns = this.cellsGroupedByColumn();

    for (let col = 0; col < 4; col++) {
      let column = columns[col].reverse();

      column = this.combineTiles(column);
      column.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }

    if (JSON.stringify(this.board) !== previousState) {
      this.addRandomTile();
    }
  }

  win() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.hasWon = true;

          return true;
        }
      }
    }

    return false;
  }
  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    return false;
  }
  getScore() {
    return this.currentScore;
  }
  getState() {
    return this.board;
  }
  getStatus() {
    return this.status;
  }
  start() {
    this.currentBoard = JSON.parse(JSON.stringify(this.board));
    this.currentScore = this.initialScore;
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
  }
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.currentBoard = JSON.parse(JSON.stringify(this.board));
    this.currentScore = this.initialScore;
    this.status = 'idle';
    this.hasWon = false;
  }
}

module.exports = Game;

'use strict';
export const statuses = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

const defaultState = {
  board: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  score: 0,
  status: statuses.idle,
};

const boardSize = 4;

export class Game {
  constructor(initialState) {
    this.board = initialState ?? defaultState.board;
    this.score = defaultState.score;
    this.status = defaultState.status;
  }

  cloneBoard(data) {
    return [...data.map((row) => [...row])];
  }

  hasBoardChanged(oldBoard, newBoard) {
    for (let i = 0; i < oldBoard.length; i += 1) {
      for (let j = 0; j < oldBoard[i].length; j += 1) {
        if (oldBoard[i][j] !== newBoard[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameStatus() {
    for (let row = 0; row < boardSize; row += 1) {
      for (let col = 0; col < boardSize; col += 1) {
        if (this.board[row][col] === 2048) {
          this.status = statuses.win;

          return;
        }
      }
    }

    for (let row = 0; row < boardSize; row += 1) {
      for (let col = 0; col < boardSize; col += 1) {
        if (
          this.board[row][col] === 0 ||
          (col < boardSize - 1 &&
            this.board[row][col] === this.board[row][col + 1]) ||
          (row < boardSize - 1 &&
            this.board[row][col] === this.board[row + 1][col])
        ) {
          return;
        }
      }
    }
    this.status = statuses.lose;
  }

  shiftRowLeft(row) {
    const nonZeroTiles = row.filter((tile) => tile !== 0);

    for (let i = 0; i < nonZeroTiles.length - 1; i += 1) {
      if (nonZeroTiles[i] === nonZeroTiles[i + 1]) {
        nonZeroTiles[i] *= 2;
        this.score += nonZeroTiles[i];
        nonZeroTiles[i + 1] = 0;
      }
    }

    const mergedRow = nonZeroTiles.filter((tile) => tile !== 0);

    for (let i = mergedRow.length; i < boardSize; i += 1) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  moveLeft() {
    const oldBoard = this.cloneBoard(this.board);

    for (let row = 0; row < boardSize; row += 1) {
      this.board[row] = this.shiftRowLeft(this.board[row]);
    }

    if (this.hasBoardChanged(oldBoard, this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveRight() {
    const oldBoard = this.cloneBoard(this.board);

    for (let row = 0; row < boardSize; row += 1) {
      const reversedRow = this.board[row].slice().reverse();
      const shiftedRow = this.shiftRowLeft(reversedRow);

      this.board[row] = shiftedRow.reverse();
    }

    if (this.hasBoardChanged(oldBoard, this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveUp() {
    const oldBoard = this.cloneBoard(this.board);

    for (let col = 0; col < boardSize; col += 1) {
      const column = this.board.map((row) => row[col]);
      const shiftedColumn = this.shiftRowLeft(column);

      for (let row = 0; row < boardSize; row += 1) {
        this.board[row][col] = shiftedColumn[row];
      }
    }

    if (this.hasBoardChanged(oldBoard, this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  moveDown() {
    const oldBoard = this.cloneBoard(this.board);

    for (let col = 0; col < boardSize; col += 1) {
      const column = this.board.map((row) => row[col]).reverse();
      const shiftedColumn = this.shiftRowLeft(column);

      const finalColumn = shiftedColumn.reverse();

      for (let row = 0; row < boardSize; row += 1) {
        this.board[row][col] = finalColumn[row];
      }
    }

    if (this.hasBoardChanged(oldBoard, this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
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
    this.addRandomTile();
    this.addRandomTile();
    this.status = statuses.playing;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < boardSize; r += 1) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  restart() {
    this.board = this.cloneBoard(defaultState.board);
    this.score = defaultState.score;
    this.status = defaultState.status;
    this.start();
  }
}

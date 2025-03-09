'use strict';

class Game {
  static STATUSES = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  static MOVE_DIRECTIONS = {
    left: 'left',
    right: 'right',
    up: 'up',
    down: 'down',
  };

  constructor(initialState) {
    this.initialState =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.status = Game.STATUSES.idle;
    this.score = 0;
  }

  start() {
    this.status = Game.STATUSES.playing;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.status = Game.STATUSES.idle;
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
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
    this.move(Game.MOVE_DIRECTIONS.left);
  }

  moveRight() {
    this.move(Game.MOVE_DIRECTIONS.right);
  }

  moveUp() {
    this.move(Game.MOVE_DIRECTIONS.up);
  }

  moveDown() {
    this.move(Game.MOVE_DIRECTIONS.down);
  }

  move(direction) {
    const oldBoard = structuredClone(this.board);

    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    if (
      direction === Game.MOVE_DIRECTIONS.up ||
      direction === Game.MOVE_DIRECTIONS.down
    ) {
      for (let c = 0; c < 4; c++) {
        const column = this.board.map((row) => row[c]);
        const combineColumn =
          direction === Game.MOVE_DIRECTIONS.up
            ? this.combineTiles(column)
            : this.combineTiles(column.reverse()).reverse();

        for (let r = 0; r < 4; r++) {
          this.board[r][c] = combineColumn[r];
        }
      }
    }

    if (
      direction === Game.MOVE_DIRECTIONS.left ||
      direction === Game.MOVE_DIRECTIONS.right
    ) {
      for (let r = 0; r < 4; r++) {
        if (direction === Game.MOVE_DIRECTIONS.left) {
          this.board[r] = this.combineTiles(this.board[r]);
        }

        if (direction === Game.MOVE_DIRECTIONS.right) {
          this.board[r] = this.combineTiles(this.board[r].reverse()).reverse();
        }
      }
    }

    this.endGame();

    if (!this.areBoardsEqual(this.board, oldBoard)) {
      this.addRandomTile();
    }
  }

  combineTiles(row) {
    const newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow.splice(i + 1, 1);
        this.score += newRow[i];
      }
    }

    return [...newRow, ...Array(4 - newRow.length).fill(0)];
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
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

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  endGame() {
    let gameOver = true;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] >= 2048) {
          this.status = Game.STATUSES.win;
        }

        if (
          (r < 3 && this.board[r][c] === this.board[r + 1][c]) ||
          (c < 3 && this.board[r][c] === this.board[r][c + 1])
        ) {
          gameOver = false;
        }
      }
    }

    if (this.getEmptyCells().length === 0 && gameOver) {
      this.status = Game.STATUSES.lose;
    }
  }

  areBoardsEqual(boardA, boardB) {
    return boardA.every((row, r) => {
      return row.every((val, c) => val === boardB[r][c]);
    });
  }
}

module.exports = Game;

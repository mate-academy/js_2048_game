'use strict';

export default class Game {
  static WINNING_TILE = 2048;

  static Status = {
    Idle: 'idle',
    Playing: 'playing',
    Win: 'win',
    GameOver: 'game over',
  };

  static Direction = {
    Up: 'Up',
    Down: 'Down',
    Left: 'Left',
    Right: 'Right',
  };

  constructor(size = 4) {
    this.size = size;
    this._score = 0;
    this._moves = 0;
    this._status = Game.Status.Idle;
    this._board = this._createEmptyBoard();
  }

  get score() {
    return this._score;
  }

  get state() {
    return this._board;
  }

  get status() {
    return this._status;
  }

  get moves() {
    return this._moves;
  }

  _createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  _spawnNewTile() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this._board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this._board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  _processRow(row) {
    const slid = row.filter((val) => val);
    const merged = [];

    for (let i = 0; i < slid.length; i++) {
      if (i + 1 < slid.length && slid[i] === slid[i + 1]) {
        const mergedValue = slid[i] * 2;

        merged.push(mergedValue);
        this._score += mergedValue;

        if (mergedValue === Game.WINNING_TILE) {
          this._status = Game.Status.Win;
        }

        i++;
      } else {
        merged.push(slid[i]);
      }
    }

    while (merged.length < this.size) {
      merged.push(0);
    }

    return merged;
  }

  _transposeBoard() {
    const newBoard = this._createEmptyBoard();

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        newBoard[j][i] = this._board[i][j];
      }
    }

    return newBoard;
  }

  _checkForGameOver() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this._board[i][j] === 0) {
          return;
        }

        if (j < this.size - 1 && this._board[i][j] === this._board[i][j + 1]) {
          return;
        }

        if (i < this.size - 1 && this._board[i][j] === this._board[i + 1][j]) {
          return;
        }
      }
    }
    this._status = Game.Status.GameOver;
  }

  move(direction) {
    if (this.status === Game.Status.GameOver) {
      return false;
    }

    const oldBoard = JSON.stringify(this._board);

    switch (direction) {
      case Game.Direction.Up:
        this._board = this._transposeBoard();
        this._board = this._board.map((row) => this._processRow(row));
        this._board = this._transposeBoard();
        break;
      case Game.Direction.Down:
        this._board = this._transposeBoard();

        this._board = this._board.map((row) => {
          return this._processRow([...row].reverse()).reverse();
        });

        this._board = this._transposeBoard();
        break;
      case Game.Direction.Left:
        this._board = this._board.map((row) => this._processRow(row));
        break;
      case Game.Direction.Right:
        this._board = this._board.map((row) => {
          return this._processRow([...row].reverse()).reverse();
        });
        break;
    }

    const moved = JSON.stringify(this._board) !== oldBoard;

    if (moved) {
      this._moves++;
      this._spawnNewTile();
      this._checkForGameOver();
    }

    return moved;
  }

  start() {
    this.restart();
  }

  restart() {
    this._score = 0;
    this._moves = 0;
    this._status = Game.Status.Playing;
    this._board = this._createEmptyBoard();
    this._spawnNewTile();
    this._spawnNewTile();
  }

  continuePlaying() {
    if (this.status === Game.Status.Win) {
      this._status = Game.Status.Playing;
    }
  }
}

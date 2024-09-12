'use strict';

class Game {
  static FIELD_SIZE = 4;

  static STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  static INITIAL_STATE = Array(Game.FIELD_SIZE).fill(
    Array(Game.FIELD_SIZE).fill(0),
  );

  constructor(initialState = Game.INITIAL_STATE.map((row) => [...row])) {
    this.status = Game.STATUS.idle;
    this.board = initialState;
    this.score = 0;
  }

  moveLeft() {
    this.board = this.board.map((row) => this.#merge(row));

    this.#addRandomTile();
  }

  moveRight() {
    this.board = this.board.map((row) => this.#merge(row.reverse()).reverse());

    this.#addRandomTile();
  }

  moveUp() {
    this.board = this.#transpose(this.board).map((row) => this.#merge(row));

    this.board = this.#transpose(this.board);

    this.#addRandomTile();
  }

  moveDown() {
    this.board = this.#transpose(this.board).map((row) => {
      return this.#merge(row.reverse()).reverse();
    });

    this.board = this.#transpose(this.board);

    this.#addRandomTile();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.board.flat().includes(2048)) {
      return Game.STATUS.win;
    }

    if (!this.board.flat().includes(0) && !this.#canMove()) {
      return Game.STATUS.lose;
    }

    return this.status;
  }

  start() {
    this.status = Game.STATUS.playing;

    this.#addRandomTile();
    this.#addRandomTile();
  }

  restart() {
    this.board = Game.INITIAL_STATE.map((row) => [...row]);
    this.status = Game.STATUS.idle;
    this.score = 0;

    this.start();
  }

  #merge(row) {
    // eslint-disable-next-line no-param-reassign
    row = row.filter((val) => val);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;

        this.score += row[i];
      }
    }

    return row
      .filter((val) => val)
      .concat(Array(Game.FIELD_SIZE - row.filter((val) => val).length).fill(0));
  }

  #transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  #addRandomTile() {
    const emptyTiles = this.board.flatMap((row, i) => {
      return row
        .map((val, j) => (val === 0 ? [i, j] : null))
        .filter((val) => val);
    });

    if (emptyTiles.length > 0) {
      const [i, j] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  #canMove() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (
          i < this.board.length - 1 &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          return true;
        }

        if (
          j < this.board[i].length - 1 &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

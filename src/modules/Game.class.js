'use strict';

import {
  BOARD_SIZE,
  WIN_VALUE,
  INITIAL_RANDOMS_TILES,
  PROBABILITY_OF_4,
  DIRECTIONS,
} from './constants';

class Game {
  static STATUS = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(initialState) {
    this.size = BOARD_SIZE;

    this.initialState = initialState
      ? initialState.map((r) => r.slice())
      : this._empty();

    this.state = this.initialState.map((r) => r.slice());
    this.score = 0;
    this.status = Game.STATUS.IDLE;
  }

  moveLeft() {
    return this._move(DIRECTIONS.LEFT);
  }

  moveRight() {
    return this._move(DIRECTIONS.RIGHT);
  }

  moveUp() {
    return this._move(DIRECTIONS.UP);
  }

  moveDown() {
    return this._move(DIRECTIONS.DOWN);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((r) => r.slice());
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== Game.STATUS.IDLE) {
      return;
    }

    for (let i = 0; i < INITIAL_RANDOMS_TILES; i++) {
      this._addRandom();
    }

    this.status = Game.STATUS.PLAYING;
  }

  restart() {
    this.state = this.initialState.map((r) => r.slice());
    this.score = 0;
    this.status = Game.STATUS.PLAYING;

    for (let i = 0; i < INITIAL_RANDOMS_TILES; i++) {
      this._addRandom();
    }
  }
  _move(dir) {
    if (this.status !== Game.STATUS.PLAYING) {
      return false;
    }

    const prevState = JSON.stringify(this.state);
    let gained = 0;

    if (dir === DIRECTIONS.LEFT || dir === DIRECTIONS.RIGHT) {
      for (let r = 0; r < this.size; r++) {
        const { line, score } = this._mergeLine(
          this.state[r],
          dir === DIRECTIONS.RIGHT,
        );

        this.state[r] = line;
        gained += score;
      }
    } else {
      for (let c = 0; c < this.size; c++) {
        const col = [];

        for (let r = 0; r < this.size; r++) {
          col.push(this.state[r][c]);
        }

        const { line, score } = this._mergeLine(col, dir === DIRECTIONS.DOWN);

        for (let r = 0; r < this.size; r++) {
          this.state[r][c] = line[r];
        }
        gained += score;
      }
    }

    const nextState = JSON.stringify(this.state);

    if (prevState === nextState) {
      return false;
    }

    this.score += gained;
    this._addRandom();

    if (this._has2048()) {
      this.status = Game.STATUS.WIN;
    } else if (!this._hasMoves()) {
      this.status = Game.STATUS.LOSE;
    }

    return true;
  }

  _mergeLine(line, reverse) {
    let arr = reverse ? line.slice().reverse() : line.slice();

    arr = arr.filter((v) => v !== 0);

    let score = 0;
    const result = [];

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === arr[i + 1]) {
        const v = arr[i] * 2;

        result.push(v);
        score += v;
        i++;
      } else {
        result.push(arr[i]);
      }
    }

    while (result.length < this.size) {
      result.push(0);
    }

    if (reverse) {
      result.reverse();
    }

    return { line: result, score };
  }

  _addRandom() {
    const empties = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (!this.state[row][col]) {
          empties.push([row, col]);
        }
      }
    }

    if (!empties.length) {
      return;
    }

    const [r, c] = empties[Math.floor(Math.random() * empties.length)];

    this.state[r][c] = Math.random() < PROBABILITY_OF_4 ? 4 : 2;
  }

  _has2048() {
    return this.state.some((row) => row.includes(WIN_VALUE));
  }

  _hasMoves() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const v = this.state[r][c];

        if (!v) {
          return true;
        }

        if (c < this.size - 1 && this.state[r][c + 1] === v) {
          return true;
        }

        if (r < this.size - 1 && this.state[r + 1][c] === v) {
          return true;
        }
      }
    }

    return false;
  }

  _empty() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }
}

export default Game;

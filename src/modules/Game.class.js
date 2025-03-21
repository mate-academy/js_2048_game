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
    this.state = Game.copyState(initialState);
    this.initialState = Game.copyState(initialState);
    this.score = 0;
    this.status = 'idle';
  }

  static copyState(state) {
    return state.map((row) => row.slice());
  }

  static moveRowLeft(row, game) {
    let filteredRow = row.filter((value) => value !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        game.score += filteredRow[i];

        if (filteredRow[i] === 2048) {
          game.status = 'win';
        }
      }
    }
    filteredRow = filteredRow.filter((value) => value !== 0);

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  move(direction) {
    if (this.status === 'playing') {
      let changed = false;

      for (let i = 0; i < 4; i++) {
        const original = [...this.state[i]];

        const newRow =
          direction === 'left'
            ? Game.moveRowLeft(original, this)
            : Game.moveRowRight(original, this);

        if (!changed && newRow.toString() !== original.toString()) {
          changed = true;
        }

        this.state[i] = newRow;
      }

      if (changed) {
        this.addRandomTile();

        if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  static moveRowRight(row, game) {
    let filteredRow = row.filter((value) => value !== 0);

    for (let i = filteredRow.length - 1; i > 0; i--) {
      if (filteredRow[i] === filteredRow[i - 1]) {
        filteredRow[i] *= 2;
        filteredRow[i - 1] = 0;
        game.score += filteredRow[i];

        if (filteredRow[i] === 2048) {
          game.status = 'win';
        }
      }
    }

    filteredRow = filteredRow.filter((value) => value !== 0);

    while (filteredRow.length < 4) {
      filteredRow.unshift(0);
    }

    return filteredRow;
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const value = this.state[r][c];

        if (value === 0) {
          return true;
        }

        if (c < 3 && value === this.state[r][c + 1]) {
          return true;
        }

        if (r < 3 && value === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  static moveColumnUp(col, game) {
    let filteredColumn = col.filter((value) => value !== 0);

    for (let i = 0; i < filteredColumn.length - 1; i++) {
      if (filteredColumn[i] === filteredColumn[i + 1]) {
        filteredColumn[i] *= 2;
        filteredColumn[i + 1] = 0;
        game.score += filteredColumn[i];

        if (filteredColumn[i] === 2048) {
          game.status = 'win';
        }
      }
    }
    filteredColumn = filteredColumn.filter((value) => value !== 0);

    while (filteredColumn.length < 4) {
      filteredColumn.push(0);
    }

    return filteredColumn;
  }

  moveUp() {
    if (this.status === 'playing') {
      let changed = false;

      for (let c = 0; c < 4; c++) {
        const originalColumn = [
          this.state[0][c],
          this.state[1][c],
          this.state[2][c],
          this.state[3][c],
        ];
        const newColumn = Game.moveColumnUp(originalColumn, this);

        if (!changed && newColumn.toString() !== originalColumn.toString()) {
          changed = true;
        }

        for (let r = 0; r < 4; r++) {
          this.state[r][c] = newColumn[r];
        }
      }

      if (changed) {
        this.addRandomTile();

        if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
  }

  static moveColumnDown(col, game) {
    let filteredColumn = col.filter((value) => value !== 0);

    for (let i = filteredColumn.length - 1; i > 0; i--) {
      if (filteredColumn[i] === filteredColumn[i - 1]) {
        filteredColumn[i] *= 2;
        filteredColumn[i - 1] = 0;
        game.score += filteredColumn[i];

        if (filteredColumn[i] === 2048) {
          game.status = 'win';
        }
      }
    }
    filteredColumn = filteredColumn.filter((value) => value !== 0);

    while (filteredColumn.length < 4) {
      filteredColumn.unshift(0);
    }

    return filteredColumn;
  }

  moveDown() {
    if (this.status === 'playing') {
      let changed = false;

      for (let c = 0; c < 4; c++) {
        const originalColumn = [
          this.state[0][c],
          this.state[1][c],
          this.state[2][c],
          this.state[3][c],
        ];
        const newColumn = Game.moveColumnDown(originalColumn, this);

        if (!changed && newColumn.toString() !== originalColumn.toString()) {
          changed = true;
        }

        for (let r = 0; r < 4; r++) {
          this.state[r][c] = newColumn[r];
        }
      }

      if (changed) {
        this.addRandomTile();

        if (!this.canMove()) {
          this.status = 'lose';
        }
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return Game.copyState(this.state);
  }

  getStatus() {
    return this.status;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];

      const newValue = Math.random() < 0.9 ? 2 : 4;

      this.state[row][col] = newValue;
    }
  }

  start() {
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile(2);
    this.addRandomTile(2);
  }

  restart() {
    this.state = Game.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;

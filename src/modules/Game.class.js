'use strict';

class Game {
  static Status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.status = Game.Status.idle;
    this.score = 0;
    this.state = JSON.parse(JSON.stringify(initialState));
    this.rows = 4;
    this.columns = 4;
  }

  hasEmptyTile() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  setTwo() {
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;
    const rows = document.querySelectorAll('.field-row');
    // console.log(document.querySelectorAll('tr')[0]);

    while (!found) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.columns);

      if (this.state[r][c] === 0) {
        this.state[r][c] = 2;

        const row = rows[r];
        // console.log(r, rows, rows[r]);
        const tile = row.querySelectorAll('.field-cell')[c];

        tile.innerHTML = '2';
        tile.classList.add('field-cell--2');
        found = true;
      }
    }
  }

  updateTile(tile, num) {
    tile.innerText = '';
    tile.removeAttribute('class');
    tile.classList.add('field-cell');

    if (num > 0) {
      tile.classList.add(`field-cell--${num}`);
      tile.innerText = num;
    }

    if (num >= 2048) {
      this.status = Game.Status.win;
    }

    this.checkGameOver();
  }

  checkGameOver() {
    if (this.hasEmptyTile()) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (
          (r < 3 && this.state[r][c] === this.state[r + 1][c]) ||
          (c < 3 && this.state[r][c] === this.state[r][c + 1])
        ) {
          return;
        }
      }
    }

    this.status = Game.Status.lose;
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  slide(orow) {
    let row = this.filterZero(orow);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.score += row[i];
      }
    }

    row = this.filterZero(row);

    while (row.length < this.columns) {
      row.push(0);
    }

    return row;
  }

  moveLeft() {
    if (
      this.getStatus() !== Game.Status.playing &&
      this.getStatus() !== Game.Status.win
    ) {
      return;
    }

    const rows = document.querySelectorAll('.field-row');

    for (let r = 0; r < this.rows; r++) {
      let row = this.state[r];

      row = this.slide(row);
      this.state[r] = row;

      for (let c = 0; c < this.columns; c++) {
        const tile = rows[r].querySelectorAll('.field-cell')[c];
        const num = this.state[r][c];

        this.updateTile(tile, num);
      }
    }
  }
  moveRight() {
    if (
      this.getStatus() !== Game.Status.playing &&
      this.getStatus() !== Game.Status.win
    ) {
      return;
    }

    const rows = document.querySelectorAll('.field-row');

    for (let r = 0; r < this.rows; r++) {
      let row = this.state[r];

      row.reverse();
      row = this.slide(row);
      row.reverse();
      this.state[r] = row;

      for (let c = 0; c < this.columns; c++) {
        const tile = rows[r].querySelectorAll('.field-cell')[c];
        const num = this.state[r][c];

        this.updateTile(tile, num);
      }
    }
  }

  moveUp() {
    if (
      this.getStatus() !== Game.Status.playing &&
      this.getStatus() !== Game.Status.win
    ) {
      return;
    }

    const rows = document.querySelectorAll('.field-row');

    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      row = this.slide(row);

      for (let r = 0; r < this.rows; r++) {
        this.state[r][c] = row[r];

        const tile = rows[r].querySelectorAll('.field-cell')[c];
        const num = this.state[r][c];

        this.updateTile(tile, num);
      }
    }
  }
  moveDown() {
    if (
      this.getStatus() !== Game.Status.playing &&
      this.getStatus() !== Game.Status.win
    ) {
      return;
    }

    const rows = document.querySelectorAll('.field-row');

    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      row.reverse();
      row = this.slide(row);
      row.reverse();

      for (let r = 0; r < this.rows; r++) {
        this.state[r][c] = row[r];

        const tile = rows[r].querySelectorAll('.field-cell')[c];
        const num = this.state[r][c];

        this.updateTile(tile, num);
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.Status.playing;
    // this.getState();
    // this.getStatus();

    this.setTwo();
    this.setTwo();
  }

  restart() {
    this.status = Game.Status.idle;
    this.state = [...this.initialState];
    this.score = 0;

    const cells = document.querySelectorAll('.field-cell');

    for (let c = 0; c < cells.length; c++) {
      this.updateTile(cells[c], 0);
    }
  }
}

module.exports = Game;

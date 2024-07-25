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
    this.status = Game.Status.idle;
    this.initialState = JSON.parse(JSON.stringify(initialState));
    this.state = initialState;
    this.score = 0;

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

    while (!found) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.columns);

      if (this.state[r][c] === 0) {
        this.state[r][c] = Math.random() >= 0.9 ? 4 : 2;
        found = true;
      }
    }

    this.updateTiles();
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  slide(row) {
    let changedRow = this.filterZero(row);

    for (let i = 0; i < changedRow.length; i++) {
      if (changedRow[i] === changedRow[i + 1]) {
        changedRow[i] += changedRow[i + 1];
        changedRow[i + 1] = 0;
        this.score += changedRow[i];
      }
    }

    changedRow = this.filterZero(changedRow);

    while (changedRow.length < 4) {
      changedRow.push(0);
    }

    return changedRow;
  }

  updateState(state) {
    this.state = state;
    this.updateTiles();
    this.setTwo();
  }

  updateTiles() {
    const fieldRow = document.querySelectorAll('.field-row');

    for (let i = 0; i < fieldRow.length; i++) {
      const cells = fieldRow[i].querySelectorAll('.field-cell');

      for (let j = 0; j < cells.length; j++) {
        const num = this.state[i][j];

        cells[j].classList = 'field-cell';
        cells[j].innerHTML = '';

        if (num > 0) {
          cells[j].classList.add(`field-cell--${num}`);
          cells[j].innerHTML = num;
        }
      }
    }

    this.checkGameOver();
    this.checkGameWin();
  }

  checkGameWin() {
    this.state.flat().some((tile) => {
      if (tile === 2048) {
        this.status = Game.Status.win;
      }
    });
  }

  checkGameOver() {
    if (this.hasEmptyTile()) {
      return;
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
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

  moveLeft() {
    if (
      this.getStatus() !== Game.Status.playing &&
      this.getStatus() !== Game.Status.win
    ) {
      return;
    }

    const newState = this.getState().map((row) => this.slide(row));

    if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
      this.updateState(newState);
    }
  }

  moveRight() {
    if (
      this.getStatus() !== Game.Status.playing &&
      this.getStatus() !== Game.Status.win
    ) {
      return;
    }

    const newState = this.getState().map((row) => {
      return this.slide([...row].reverse());
    });

    const reversedState = newState.map((row) => row.reverse());

    if (JSON.stringify(this.state) !== JSON.stringify(reversedState)) {
      this.updateState(reversedState);
    }
  }

  moveUp() {
    if (
      this.getStatus() !== Game.Status.playing &&
      this.getStatus() !== Game.Status.win
    ) {
      return;
    }

    const newState = [...this.state.map((arr) => [...arr])];

    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      row = this.slide(row);

      for (let r = 0; r < this.rows; r++) {
        newState[r][c] = row[r];
      }
    }

    if (
      this.state[0].includes(0) ||
      this.state[1].includes(0) ||
      this.state[2].includes(0) ||
      JSON.stringify(this.state) !== JSON.stringify(newState)
    ) {
      this.updateState(newState);
    }
  }

  moveDown() {
    if (
      this.getStatus() !== Game.Status.playing &&
      this.getStatus() !== Game.Status.win
    ) {
      return;
    }

    const newState = [...this.state.map((arr) => [...arr])];

    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      row = this.slide(row.reverse());
      row.reverse();

      for (let r = 0; r < this.rows; r++) {
        newState[r][c] = row[r];
      }
    }

    if (
      this.state[3].includes(0) ||
      this.state[2].includes(0) ||
      this.state[1].includes(0) ||
      JSON.stringify(this.state) !== JSON.stringify(newState)
    ) {
      this.updateState(newState);
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

    this.setTwo();
    this.setTwo();
  }

  restart() {
    this.status = Game.Status.idle;
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.updateTiles();
  }
}

module.exports = Game;

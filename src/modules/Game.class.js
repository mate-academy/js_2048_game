'use strict';

class Game {
  constructor(initialState) {
    this.inicialState = initialState;
    this.state = this.inicialState.map((row) => [...row]);
    this.futureState = [];
    this.score = 0;
    this.status = 'idle';
    this.startGame = false;
  }

  slide(row) {
    let filterRow = this.filterZero(row);

    for (let i = 0; i < filterRow.length; i++) {
      if (filterRow[i] === filterRow[i + 1]) {
        filterRow[i] *= 2;
        filterRow[i + 1] = 0;
        this.score += filterRow[i];
      }
    }

    filterRow = this.filterZero(filterRow);

    while (filterRow.length < 4) {
      filterRow.push(0);
    }

    return filterRow;
  }

  filterZero(row) {
    return row.filter((item) => item !== 0);
  }

  isEqual(fututreState, state) {
    for (let row = 0; row < fututreState.length; row++) {
      for (let cell = 0; cell < fututreState[row].length; cell++) {
        if (fututreState[row][cell] !== state[row][cell]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    if (!this.startGame) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      let row = [...this.state[r]];

      row = this.slide(row);
      this.futureState[r] = row;
    }

    if (this.isEqual(this.futureState, this.state)) {
      return;
    }

    this.state = this.futureState.map((row) => [...row]);
    this.setTwo();
    this.isWin(this.state);

    if (this.isLose()) {
      this.status = 'lose';
    }
  }

  moveRight() {
    if (!this.startGame) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      let row = [...this.state[r]];

      row.reverse();
      row = this.slide(row);

      row.reverse();
      this.futureState[r] = row;
    }

    if (this.isEqual(this.futureState, this.state)) {
      return;
    }

    this.state = this.futureState.map((row) => [...row]);
    this.setTwo();
    this.isWin(this.state);

    if (this.isLose()) {
      this.status = 'lose';
    }
  }

  moveUp() {
    if (!this.startGame) {
      return;
    }

    this.futureState = this.state.map((row) => [...row]);

    for (let c = 0; c < 4; c++) {
      let row = [
        this.futureState[0][c],
        this.futureState[1][c],
        this.futureState[2][c],
        this.futureState[3][c],
      ];

      row = this.slide(row);

      for (let r = 0; r < 4; r++) {
        this.futureState[r][c] = row[r];
      }
    }

    if (this.isEqual(this.futureState, this.state)) {
      return;
    }

    this.state = this.futureState.map((row) => [...row]);
    this.setTwo();
    this.isWin(this.state);

    if (this.isLose()) {
      this.status = 'lose';
    }
  }

  moveDown() {
    if (!this.startGame) {
      return;
    }

    this.futureState = this.state.map((row) => [...row]);

    for (let c = 0; c < 4; c++) {
      let row = [
        this.futureState[0][c],
        this.futureState[1][c],
        this.futureState[2][c],
        this.futureState[3][c],
      ];

      row.reverse();
      row = this.slide(row);

      row.reverse();

      for (let r = 0; r < 4; r++) {
        this.futureState[r][c] = row[r];
      }
    }

    if (this.isEqual(this.futureState, this.state)) {
      return;
    }

    this.state = this.futureState.map((row) => [...row]);
    this.setTwo();
    this.isWin(this.state);

    if (this.isLose()) {
      this.status = 'lose';
    }
  }

  start() {
    this.status = 'playing';
    this.startGame = true;
    this.state = this.inicialState.map((row) => [...row]);
    this.score = 0;

    this.setTwo();
    this.setTwo();
  }

  restart() {
    this.status = 'idle';
    this.startGame = false;
    this.state = this.inicialState.map((row) => [...row]);
    this.score = 0;
  }

  setTwo() {
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      const r = Math.floor(Math.random() * 4);
      const c = Math.floor(Math.random() * 4);

      if (this.state[r][c] === 0) {
        const value = Math.random() < 0.9 ? 2 : 4;

        this.state[r][c] = value;

        found = true;
      }
    }
  }

  hasEmptyTile() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  isWin(state) {
    state.forEach((row) => {
      row.forEach((col) => {
        if (col === 2048) {
          this.status = 'win';
        }
      });
    });
  }

  isLose() {
    for (const row of this.state) {
      if (row.some((i) => i === 0)) {
        return false;
      }

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    for (let c = 0; c < 4; c++) {
      const row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  updateTile(tile, num) {
    tile.innerText = '';
    tile.classList.value = '';
    tile.classList.add('field__cell');

    if (num > 0) {
      tile.innerText = num;
      tile.classList.add('field__cell--' + num.toString());
    }
  }

  updateScore(el) {
    el.innerText = this.score;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  setBestScore(score, user) {
    if (user === null || user < score) {
      localStorage.setItem('user', score);
    }
  }

  getBestScore() {
    const user = localStorage.getItem('user');

    if (user === null) {
      return 0;
    }

    return user;
  }
}

module.exports = Game;

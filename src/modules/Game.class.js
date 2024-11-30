'use strict';

class Game {
  static GAME_STATUS = {
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
    this.status = Game.GAME_STATUS.idle;
    this.score = 0;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.GAME_STATUS.playing;
    this.state = this.initialState.map((row) => [...row]);
    this.addCell();
    this.addCell();
    this.updateUI();
  }

  restart() {
    this.score = 0;
    this.status = Game.GAME_STATUS.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.updateUI();
  }

  move(transform, untransform, checkVertical) {
    if (this.getStatus() !== Game.GAME_STATUS.playing) {
      return false;
    }

    let canMove = false;
    const newState = untransform(this.state).map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          const mergedValue = filteredRow[i] * 2;

          newRow.push(mergedValue);
          this.score += mergedValue;
          i++;
          canMove = true;
        } else {
          newRow.push(filteredRow[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      if (!canMove && !row.every((cell, index) => cell === newRow[index])) {
        canMove = true;
      }

      return newRow;
    });

    const transformedNewState = transform(newState);

    if (checkVertical) {
      if (!this.areStatesEqual(this.state, transformedNewState)) {
        canMove = true;
        this.state = transformedNewState;
        this.addCell();
        this.updateUI();
        this.checkStatus();
      }
    } else {
      if (!this.areStatesEqual(untransform(this.state), transformedNewState)) {
        canMove = true;
        this.state = transformedNewState;
        this.addCell();
        this.updateUI();
        this.checkStatus();
      }
    }

    return canMove;
  }

  moveLeft() {
    return this.move(
      (state) => state,
      (state) => state,
      false,
    );
  }

  moveRight() {
    return this.move(
      (state) => state.map((row) => row.reverse()),
      (state) => state.map((row) => row.reverse()),
      false,
    );
  }

  moveUp() {
    return this.move(
      (state) => this.transpose(state),
      (state) => this.transpose(state),
      true,
    );
  }

  moveDown() {
    return this.move(
      (state) => this.transpose(state.map((row) => row.reverse())),
      (state) => this.transpose(state).map((row) => row.reverse()),
      true,
    );
  }

  transpose(state) {
    return state[0].map((_, colIndex) => state.map((row) => row[colIndex]));
  }

  addCell() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ r: i, c: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  updateUI() {
    const cells = document.querySelectorAll('.field-cell');
    const stateValues = this.state.flat();

    cells.forEach((cell, i) => {
      cell.className = 'field-cell';

      const value = stateValues[i];

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
    });

    document.querySelector('.game-score').textContent = this.score;
  }

  checkStatus() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          this.status = Game.GAME_STATUS.win;

          return;
        }
      }
    }

    let canMerge = false;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length - 1; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          canMerge = true;
          break;
        }
      }

      if (canMerge) {
        break;
      }
    }

    for (let i = 0; i < this.state.length - 1; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          canMerge = true;
          break;
        }
      }

      if (canMerge) {
        break;
      }
    }

    const canMove = this.state.some((row) => row.includes(0));

    if (!canMove && !canMerge) {
      this.status = Game.GAME_STATUS.lose;
    }
  }

  areStatesEqual(state1, state2) {
    for (let i = 0; i < state1.length; i++) {
      for (let j = 0; j < state1[i].length; j++) {
        if (state1[i][j] !== state2[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}

module.exports = Game;

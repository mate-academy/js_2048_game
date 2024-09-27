'use strict';

class Game {
  static STATUS = {
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
    this.score = 0;
    this.status = Game.STATUS.idle;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    let moveAbility = false;

    const newState = this.state.map((row) => {
      const filterRow = row.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = 0; i < filterRow.length; i++) {
        if (filterRow[i] === filterRow[i + 1]) {
          const mergedValue = filterRow[i] * 2;

          newRow.push(mergedValue);
          this.score += mergedValue;
          i++;
          moveAbility = true;
        } else {
          newRow.push(filterRow[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      if (!moveAbility) {
        moveAbility = !row.every((cell, index) => cell === newRow[index]);
      }

      return newRow;
    });

    if (moveAbility) {
      this.state = newState;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    }

    return moveAbility;
  }

  moveRight() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    let moveAbility = false;

    const newState = this.state.map((row) => {
      const filterRow = row.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = filterRow.length - 1; i >= 0; i--) {
        if (filterRow[i] === filterRow[i - 1]) {
          const mergedValue = filterRow[i] * 2;

          newRow.unshift(mergedValue);
          this.score += mergedValue;
          i--;
          moveAbility = true;
        } else {
          newRow.unshift(filterRow[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.unshift(0);
      }

      if (!moveAbility && !row.every((cell, index) => cell === newRow[index])) {
        moveAbility = true;
      }

      return newRow;
    });

    if (moveAbility) {
      this.state = newState;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    }

    return moveAbility;
  }

  moveUp() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    let moveAbility = false;
    const newState = this.state.map((row) => [...row]);

    for (let c = 0; c < this.state[0].length; c++) {
      const filterColumn = [];

      for (let r = 0; r < this.state.length; r++) {
        if (this.state[r][c] !== 0) {
          filterColumn.push(this.state[r][c]);
        }
      }

      const newColumn = [];

      for (let i = 0; i < filterColumn.length; i++) {
        if (filterColumn[i] === filterColumn[i + 1]) {
          const mergedValue = filterColumn[i] * 2;

          newColumn.push(mergedValue);
          this.score += mergedValue;
          i++;
          moveAbility = true;
        } else {
          newColumn.push(filterColumn[i]);
        }
      }

      while (newColumn.length < this.state.length) {
        newColumn.push(0);
      }

      for (let r = 0; r < this.state.length; r++) {
        if (newState[r][c] !== newColumn[r]) {
          newState[r][c] = newColumn[r];
          moveAbility = true;
        }
      }
    }

    if (moveAbility) {
      this.state = newState;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    }

    return moveAbility;
  }

  moveDown() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    let moveAbility = false;
    const newState = this.state.map((row) => [...row]);

    for (let c = 0; c < this.state[0].length; c++) {
      const filterColumn = [];

      for (let r = this.state.length - 1; r >= 0; r--) {
        if (this.state[r][c] !== 0) {
          filterColumn.push(this.state[r][c]);
        }
      }

      const newColumn = [];

      for (let i = 0; i < filterColumn.length; i++) {
        if (filterColumn[i] === filterColumn[i + 1]) {
          const mergedValue = filterColumn[i] * 2;

          newColumn.unshift(mergedValue);
          this.score += mergedValue;
          i++;
          moveAbility = true;
        } else {
          newColumn.unshift(filterColumn[i]);
        }
      }

      while (newColumn.length < this.state.length) {
        newColumn.unshift(0);
      }

      for (let r = 0; r < this.state.length; r++) {
        if (newState[r][c] !== newColumn[r]) {
          newState[r][c] = newColumn[r];
          moveAbility = true;
        }
      }
    }

    if (moveAbility) {
      this.state = newState;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    }

    return moveAbility;
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
    this.status = Game.STATUS.playing;
    this.state = this.initialState.map((row) => [...row]);

    this.addNumbers();
    this.addNumbers();
    this.setState();
  }

  restart() {
    this.score = 0;
    this.status = Game.STATUS.idle;
    this.state = this.initialState.map((row) => [...row]);

    this.setState();
  }

  getRandomNumber() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  addNumbers() {
    const emptyCell = [];

    for (let rows = 0; rows < this.state.length; rows++) {
      for (let cells = 0; cells < this.state[rows].length; cells++) {
        if (this.state[rows][cells] === 0) {
          emptyCell.push({ r: rows, c: cells });
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCell.length);
    const { r, c } = emptyCell[randomIndex];

    const newState = this.state.map((row) => [...row]);

    newState[r][c] = this.getRandomNumber();

    this.state = newState;
  }

  setState() {
    const cells = document.querySelectorAll('.field-cell');
    const cellsValue = this.state.flat();

    if (cells.length === 0) {
      return;
    }

    for (let i = 0; i < cellsValue.length; i++) {
      const currentCells = cells[i];
      const currentValue = cellsValue[i];

      if (!currentCells) {
        continue;
      }

      currentCells.className = 'field-cell';

      if (currentValue > 0) {
        currentCells.textContent = currentValue;
        currentCells.classList.add(`field-cell--${currentValue}`);
      } else {
        currentCells.textContent = '';
      }
    }
  }

  checkStatus() {
    let moveAbility = false;
    let mergeAbility = false;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          this.status = Game.STATUS.win;

          return;
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length - 1; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          mergeAbility = true;
          break;
        }
      }

      if (mergeAbility) {
        break;
      }
    }

    if (!mergeAbility) {
      for (let i = 0; i < this.state.length - 1; i++) {
        for (let j = 0; j < this.state[i].length; j++) {
          if (this.state[i][j] === this.state[i + 1][j]) {
            mergeAbility = true;
            break;
          }
        }

        if (mergeAbility) {
          break;
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          moveAbility = true;
          break;
        }
      }

      if (moveAbility) {
        break;
      }
    }

    if (!moveAbility && !mergeAbility) {
      this.status = Game.STATUS.lose;
    }
  }
}

module.exports = Game;

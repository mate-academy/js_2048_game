'use strict';

class Game {
  static gameStatus = {
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
    this.status = Game.gameStatus.idle;
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

  moveLeft() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let movesAVLBL = false;
    const newState = this.state.map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          const mergedValue = filteredRow[i] * 2;

          newRow.push(mergedValue);
          this.score += mergedValue;
          i++;
          movesAVLBL = true;
        } else {
          newRow.push(filteredRow[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      if (!movesAVLBL && !row.every((cell, index) => cell === newRow[index])) {
        movesAVLBL = true;
      }

      return newRow;
    });

    if (movesAVLBL) {
      this.state = newState;
      this.addCell();
      this.setState();
      this.checkStatus();
    }

    return movesAVLBL;
  }

  moveRight() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let movesAVLBL = false;
    const newState = this.state.map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = filteredRow.length - 1; i >= 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          const mergedValue = filteredRow[i] * 2;

          newRow.unshift(mergedValue);
          this.score += mergedValue;
          i--;
          movesAVLBL = true;
        } else {
          newRow.unshift(filteredRow[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.unshift(0);
      }

      if (!movesAVLBL && !row.every((cell, index) => cell === newRow[index])) {
        movesAVLBL = true;
      }

      return newRow;
    });

    if (movesAVLBL) {
      this.state = newState;
      this.addCell();
      this.setState();
      this.checkStatus();
    }

    return movesAVLBL;
  }

  moveUp() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let movesAVLBL = false;
    const newState = this.state.map((row) => [...row]);

    for (let c = 0; c < this.state[0].length; c++) {
      const filteredColumn = [];

      for (let r = 0; r < this.state.length; r++) {
        if (this.state[r][c] !== 0) {
          filteredColumn.push(this.state[r][c]);
        }
      }

      const newColumn = [];

      for (let i = 0; i < filteredColumn.length; i++) {
        if (filteredColumn[i] === filteredColumn[i + 1]) {
          const mergedValue = filteredColumn[i] * 2;

          newColumn.push(mergedValue);
          this.score += mergedValue;
          i++;
          movesAVLBL = true;
        } else {
          newColumn.push(filteredColumn[i]);
        }
      }

      while (newColumn.length < this.state.length) {
        newColumn.push(0);
      }

      for (let r = 0; r < this.state.length; r++) {
        if (newState[r][c] !== newColumn[r]) {
          newState[r][c] = newColumn[r];
          movesAVLBL = true;
        }
      }
    }

    if (movesAVLBL) {
      this.state = newState;
      this.addCell();
      this.setState();
      this.checkStatus();
    }

    return movesAVLBL;
  }

  moveDown() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let movesAVLBL = false;
    const newState = this.state.map((row) => [...row]);

    for (let c = 0; c < this.state[0].length; c++) {
      const filteredColumn = [];

      for (let r = this.state.length - 1; r >= 0; r--) {
        if (this.state[r][c] !== 0) {
          filteredColumn.push(this.state[r][c]);
        }
      }

      const newColumn = [];

      for (let i = 0; i < filteredColumn.length; i++) {
        if (filteredColumn[i] === filteredColumn[i + 1]) {
          const mergedValue = filteredColumn[i] * 2;

          newColumn.unshift(mergedValue);
          this.score += mergedValue;
          i++;
          movesAVLBL = true;
        } else {
          newColumn.unshift(filteredColumn[i]);
        }
      }

      while (newColumn.length < this.state.length) {
        newColumn.unshift(0);
      }

      for (let r = 0; r < this.state.length; r++) {
        if (newState[r][c] !== newColumn[r]) {
          newState[r][c] = newColumn[r];
          movesAVLBL = true;
        }
      }
    }

    if (movesAVLBL) {
      this.state = newState;
      this.addCell();
      this.setState();
      this.checkStatus();
    }

    return movesAVLBL;
  }

  start() {
    this.status = Game.gameStatus.playing;
    this.state = this.initialState.map((row) => [...row]);
    this.addCell();
    this.addCell();
    this.setState();
  }

  restart() {
    this.score = 0;
    this.status = Game.gameStatus.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.setState();
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

    const randomIndex = this.addRandomNumber(emptyCells.length);
    const { r, c } = emptyCells[randomIndex];
    const newState = this.state.map((row) => [...row]);

    newState[r][c] = this.getRandomCell();
    this.state = newState;
  }

  setState() {
    const cells = document.querySelectorAll('.field-cell');
    const stateValues = this.state.flat();

    if (cells.length === 0) {
      return;
    }

    for (let i = 0; i < stateValues.length; i++) {
      const currentCell = cells[i];
      const currentValue = stateValues[i];

      if (!currentCell) {
        continue;
      }

      currentCell.className = 'field-cell';

      if (currentValue > 0) {
        currentCell.textContent = currentValue;
        currentCell.classList.add(`field-cell--${currentValue}`);
      } else {
        currentCell.textContent = '';
      }
    }
  }

  addRandomNumber(max) {
    return Math.floor(Math.random() * max);
  }

  getRandomCell() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  checkStatus() {
    let movesAVLBL = false;
    let canMerge = false;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          this.status = Game.gameStatus.win;

          return;
        }
      }
    }

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

    if (!canMerge) {
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
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          movesAVLBL = true;
          break;
        }
      }

      if (movesAVLBL) {
        break;
      }
    }

    if (!movesAVLBL && !canMerge) {
      this.status = Game.gameStatus.lose;
    }
  }
}

module.exports = Game;

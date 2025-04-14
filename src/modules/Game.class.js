'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
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
    this.initialState = initialState;
    this.state = this.initialState.map((row) => [...row]);
    this.status = Game.gameStatus.idle;
    this.score = 0;
  }

  moveLeft() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let move = false;
    const newState = this.state.map((row) => {
      const filterRow = row.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = 0; i < filterRow.length; i++) {
        if (filterRow[i] === filterRow[i + 1]) {
          const mergedValue = filterRow[i] * 2;

          newRow.push(mergedValue);
          this.score += mergedValue;
          i++;
          move = true;
        } else {
          newRow.push(filterRow[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      if (!move && !row.every((cell, index) => cell === newRow[index])) {
        move = true;
      }

      return newRow;
    });

    if (move) {
      this.state = newState;
      this.addCell();
      this.setState();
      this.checkStatus();
    }

    return move;
  }

  moveRight() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let move = false;
    const newState = this.state.map((row) => {
      const filterRow = row.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = filterRow.length - 1; i >= 0; i--) {
        if (filterRow[i] === filterRow[i - 1]) {
          const mergedValue = filterRow[i] * 2;

          newRow.unshift(mergedValue);
          this.score += mergedValue;
          i--;
          move = true;
        } else {
          newRow.unshift(filterRow[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.unshift(0);
      }

      if (!move && !row.every((cell, index) => cell === newRow[index])) {
        move = true;
      }

      return newRow;
    });

    if (move) {
      this.state = newState;
      this.addCell();
      this.setState();
      this.checkStatus();
    }

    return move;
  }

  moveUp() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let move = false;
    const newState = this.state.map((row) => [...row]);

    for (let x = 0; x < this.state[0].length; x++) {
      const filterColumn = [];

      for (let y = 0; y < this.state.length; y++) {
        if (this.state[y][x] !== 0) {
          filterColumn.push(this.state[y][x]);
        }
      }

      const newColumn = [];

      for (let i = 0; i < filterColumn.length; i++) {
        if (filterColumn[i] === filterColumn[i + 1]) {
          const mergedValue = filterColumn[i] * 2;

          newColumn.push(mergedValue);
          this.score += mergedValue;
          i++;
          move = true;
        } else {
          newColumn.push(filterColumn[i]);
        }
      }

      while (newColumn.length < this.state.length) {
        newColumn.push(0);
      }

      for (let y = 0; y < this.state.length; y++) {
        if (newState[y][x] !== newColumn[y]) {
          newState[y][x] = newColumn[y];
          move = true;
        }
      }
    }

    if (move) {
      this.state = newState;
      this.addCell();
      this.setState();
      this.checkStatus();
    }

    return move;
  }

  moveDown() {
    if (this.getStatus() !== Game.gameStatus.playing) {
      return;
    }

    let move = false;
    const newState = this.state.map((row) => [...row]);

    for (let x = 0; x < this.state[0].length; x++) {
      const filterColumn = [];

      for (let y = this.state.length - 1; y >= 0; y--) {
        if (this.state[y][x] !== 0) {
          filterColumn.push(this.state[y][x]);
        }
      }

      const newColumn = [];

      for (let i = 0; i < filterColumn.length; i++) {
        if (filterColumn[i] === filterColumn[i + 1]) {
          const mergedValue = filterColumn[i] * 2;

          newColumn.unshift(mergedValue);
          this.score += mergedValue;
          i++;
          move = true;
        } else {
          newColumn.unshift(filterColumn[i]);
        }
      }

      while (newColumn.length < this.state.length) {
        newColumn.unshift(0);
      }

      for (let y = 0; y < this.state.length; y++) {
        if (newState[y][x] !== newColumn[y]) {
          newState[y][x] = newColumn[y];
          move = true;
        }
      }
    }

    if (move) {
      this.state = newState;
      this.addCell();
      this.setState();
      this.checkStatus();
    }

    return move;
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
          emptyCells.push({ y: i, x: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = this.addRandomNumber(emptyCells.length);
    const { y, x } = emptyCells[randomIndex];
    const newState = this.state.map((row) => [...row]);

    newState[y][x] = this.getRandomCell();
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
    let move = false;
    let merge = false;

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
          merge = true;
          break;
        }
      }

      if (merge) {
        break;
      }
    }

    if (!merge) {
      for (let i = 0; i < this.state.length - 1; i++) {
        for (let j = 0; j < this.state[i].length; j++) {
          if (this.state[i][j] === this.state[i + 1][j]) {
            merge = true;
            break;
          }
        }

        if (merge) {
          break;
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          move = true;
          break;
        }
      }

      if (move) {
        break;
      }
    }

    if (!move && !merge) {
      this.status = Game.gameStatus.lose;
    }
  }
}

module.exports = Game;

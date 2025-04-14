'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
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
    this.status = Game.STATUS;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
  }

  moveLeft() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    let canMove = false;

    const newState = this.state.map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0);
      const newRow = [];
      let merged = false;

      for (let i = 0; i < filteredRow.length; i++) {
        if (!merged && filteredRow[i] === filteredRow[i + 1]) {
          const mergedValue = filteredRow[i] * 2;

          newRow.push(mergedValue);
          this.score += mergedValue;
          i++;
          merged = true;
          canMove = true;
        } else {
          newRow.push(filteredRow[i]);
          merged = false;
        }
      }

      while (newRow.length < row.length) {
        newRow.push(0);
      }

      if (!canMove) {
        canMove = !row.every((cell, index) => cell === newRow[index]);
      }

      return newRow;
    });

    if (canMove) {
      this.state = newState;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    }

    return canMove;
  }

  moveRight() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    let canMove = false;
    const newState = this.state.map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = filteredRow.length - 1; i >= 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          const mergedValue = filteredRow[i] * 2;

          newRow.unshift(mergedValue);
          this.score += mergedValue;
          i--;
          canMove = true;
        } else {
          newRow.unshift(filteredRow[i]);
        }
      }

      while (newRow.length < row.length) {
        newRow.unshift(0);
      }

      if (!canMove && !row.every((cell, index) => cell === newRow[index])) {
        canMove = true;
      }

      return newRow;
    });

    if (canMove) {
      this.state = newState;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    }

    return canMove;
  }

  moveUp() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    let canMove = false;
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
          canMove = true;
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
          canMove = true;
        }
      }
    }

    if (canMove) {
      this.state = newState;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    }

    return canMove;
  }

  moveDown() {
    if (this.getStatus() !== Game.STATUS.playing) {
      return;
    }

    let canMove = false;
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
          canMove = true;
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
          canMove = true;
        }
      }
    }

    if (canMove) {
      this.state = newState;
      this.addNumbers();
      this.setState();
      this.checkStatus();
    }

    return canMove;
  }

  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = Game.STATUS.playing;
    this.state = this.initialState.map((row) => [...row]);

    this.addNumbers();
    this.addNumbers();
    this.setState();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = Game.STATUS.idle;
    this.state = this.initialState.map((row) => [...row]);

    this.setState();
  }

  getRandomCell() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  addNumbers() {
    const emptyCells = [];

    for (let rows = 0; rows < this.state.length; rows++) {
      for (let cells = 0; cells < this.state[rows].length; cells++) {
        if (this.state[rows][cells] === 0) {
          emptyCells.push({ r: rows, c: cells });
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
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

  checkStatus() {
    let canMove = false;
    let canMerge = false;

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
          canMove = true;
          break;
        }
      }

      if (canMove) {
        break;
      }
    }

    if (!canMove && !canMerge) {
      this.status = Game.STATUS.lose;
    }
  }
}

module.exports = Game;

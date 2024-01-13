'use strict';

document.querySelector(
  '.game-max-score',
).textContent = localStorage.getItem('score') || 0;

class Game2048 {
  constructor() {
    this.TILE_CLASSES = {
      0: '',
      2: 'field-cell--2',
      4: 'field-cell--4',
      8: 'field-cell--8',
      16: 'field-cell--16',
      32: 'field-cell--32',
      64: 'field-cell--64',
      128: 'field-cell--128',
      256: 'field-cell--256',
      512: 'field-cell--512',
      1024: 'field-cell--1024',
      2048: 'field-cell--2048',
    };

    this.GRID_SIZE = 4;

    this.data = Array.from({ length: this.GRID_SIZE }, () => Array(
      this.GRID_SIZE).fill(0));
    this.score = 0;
    this.inProgress = false;

    this.startButton = document.querySelector('.start');
    this.messageWin = document.querySelector('.message-win');
    this.messageStart = document.querySelector('.message-start');
    this.messageLose = document.querySelector('.message-lose');
    this.gameScoreBlock = document.querySelector('.game-score');
    this.fieldRows = document.querySelectorAll('.field-row');
    document.querySelector('.game-max-score').textContent = this.getMaxScore();

    this.startButton.addEventListener('click', () => this.handleStartClick());
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));
  }

  handleStartClick() {
    if (this.startButton.innerText === 'Start') {
      this.startGame();
    } else {
      this.restartGame();
    }
  }

  startGame() {
    this.startButton.innerText = 'Restart';
    this.startButton.classList.replace('start', 'restart');
    this.messageStart.classList.add('hidden');
    this.clearField();
    this.randomizer(2);
    this.inProgress = true;
    this.domReload();
  }

  getMaxScore() {
    return localStorage.getItem('score') || 0;
  }

  restartGame() {
    this.clearField();
    this.saveMaxScore();
    this.score = 0;
    this.messageLose.classList.add('hidden');
    this.messageWin.classList.add('hidden');
    this.startGame();
  }

  handleKeyPress(e) {
    if (!this.inProgress) {
      return;
    }

    const prevData = JSON.parse(JSON.stringify(this.data));
    let moveExecuted = false;

    switch (e.key) {
      case 'ArrowRight':
        moveExecuted = this.makeMove('right');
        break;
      case 'ArrowLeft':
        moveExecuted = this.makeMove('left');
        break;
      case 'ArrowDown':
        moveExecuted = this.makeMove('down');
        break;
      case 'ArrowUp':
        moveExecuted = this.makeMove('up');
        break;
    }

    if (moveExecuted && !this.isEqual(prevData, this.data)) {
      this.randomizer(1);

      if (this.isGameOver()) {
        this.endGame();
      } else {
        this.domReload();
      }
    }
  }

  makeMove(direction) {
    if (this.isGameOver()) {
      return false;
    }

    this.mergeTiles(direction);
    this.tileMovement(direction);
    this.isWin();

    return true;
  }

  endGame() {
    this.inProgress = false;
    this.messageLose.classList.remove('hidden');
    this.domReload();
  }

  isEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  tileMovement(direction) {
    for (let i = 0; i < this.data.length; i++) {
      let values;

      if (direction === 'right' || direction === 'left') {
        values = this.getHorizontalValues(i, direction);
        this.data[i] = values;
      } else if (direction === 'down' || direction === 'up') {
        values = this.getVerticalValues(i, direction);
        this.data = this.updateDataArray(this.data, values, direction, i);
      }
    }
  }

  getHorizontalValues(rowIndex, direction) {
    const nonZeroValues = this.data[rowIndex].filter(
      (element) => element !== 0);
    const zeroValues = this.data[rowIndex].filter((element) => element === 0);

    return direction === 'right' ? zeroValues.concat(
      nonZeroValues) : nonZeroValues.concat(zeroValues);
  }

  getVerticalValues(columnIndex, direction) {
    const column = this.data.map(row => row[columnIndex]);
    const nonZeroValues = column.filter((element) => element !== 0);
    const zeroValues = column.filter((element) => element === 0);

    return direction === 'down' ? zeroValues.concat(
      nonZeroValues) : nonZeroValues.concat(zeroValues);
  }

  mergeTiles(direction) {
    for (let index = 0; index < this.data.length; index++) {
      const values = this.getValues(direction, index);
      const merged = Array(this.data.length).fill(false);

      const nonZeroValues = values.filter((element) => element !== 0);
      const zeroValues = values.filter((element) => element === 0);

      if (direction === 'down' || direction === 'right') {
        for (let i = nonZeroValues.length - 1; i > 0; i--) {
          this.mergeAdjacentTiles(i, nonZeroValues, merged);
        }

        this.data = this.updateDataArray(
          this.data, zeroValues.concat(nonZeroValues), direction, index);
      } else if (direction === 'up' || direction === 'left') {
        for (let i = 0; i < nonZeroValues.length - 1; i++) {
          this.mergeAdjacentTiles(i, nonZeroValues, merged);
        }

        this.data = this.updateDataArray(
          this.data, nonZeroValues.concat(zeroValues), direction, index);
      }
    }
  }

  mergeAdjacentTiles(i, nonZeroValues, merged) {
    if (nonZeroValues[i] === nonZeroValues[i - 1] && !merged[i]) {
      nonZeroValues[i] += nonZeroValues[i - 1];
      this.score += nonZeroValues[i];
      nonZeroValues[i - 1] = 0;
      merged[i] = true;
    }
  }

  getValues(direction, index) {
    return direction === 'down' || direction === 'up' ? this.data.map(
      row => row[index]) : this.data[index].slice();
  }

  updateDataArray(data, values, direction, index) {
    if (direction === 'down' || direction === 'up') {
      for (let row = 0; row < data.length; row++) {
        data[row][index] = values[row];
      }
    } else if (direction === 'left' || direction === 'right') {
      data[index] = values.slice();
    }

    return data;
  }

  randomizer(count) {
    for (let i = 0; i < count; i++) {
      const emptyPositions = this.getEmptyPositions();

      if (emptyPositions.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyPositions.length);
        const { row, tile } = emptyPositions[randomIndex];

        this.data[row][tile] = Math.random() * 2 > 1.9 ? 4 : 2;
      }
    }
  }

  getEmptyPositions() {
    const emptyPositions = [];

    for (let row = 0; row < this.data.length; row++) {
      for (let tile = 0; tile < this.data[row].length; tile++) {
        if (this.data[row][tile] === 0) {
          emptyPositions.push({
            row, tile,
          });
        }
      }
    }

    return emptyPositions;
  };

  colorizing() {
    this.fieldRows.forEach((row, rowIndex) => {
      const cellsInRow = row.querySelectorAll('.field-cell');

      this.data[rowIndex].forEach((cellValue, tileIndex) => {
        cellsInRow[tileIndex].className = `field-cell ${
          this.TILE_CLASSES[cellValue]}`;
      });
    });
  }

  isWin() {
    if (this.data.some(row => row.includes(2048))) {
      this.messageWin.classList.remove('hidden');
      this.inProgress = false;
    }
  }

  clearField() {
    this.data = Array.from({ length: this.GRID_SIZE }, () => Array(
      this.GRID_SIZE).fill(0));
  }

  domReload() {
    this.fieldRows.forEach((row, rowIndex) => {
      const cellsInRow = row.querySelectorAll('.field-cell');

      this.data[rowIndex].forEach((cellValue, tileIndex) => {
        cellsInRow[tileIndex].textContent = cellValue === 0 ? ' ' : cellValue;
      });
    });

    this.gameScoreBlock.textContent = this.score;
    this.colorizing();
  }

  saveMaxScore() {
    if (this.score > localStorage.getItem('score')) {
      localStorage.setItem('score', this.score);
    }
  }

  cycle(check) {
    for (let row = 0; row < this.data.length; row++) {
      if (check) {
        for (let tile = 0; tile < this.data[row].length - 1; tile++) {
          if (this.data[row][tile] === this.data[row][tile + 1]
            || this.data[row][tile] === 0) {
            return false;
          }
        }
      } else {
        for (let tile = 0; tile < this.data[row].length; tile++) {
          if (row < this.data.length - 1
            && (this.data[row][tile] === this.data[row + 1][tile]
              || this.data[row][tile] === 0)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  isGameOver() {
    if (this.data.some(row => row.includes(0))) {
      return false;
    }

    if (!this.cycle(true) || !this.cycle(false)) {
      return false;
    }

    this.saveMaxScore();

    localStorage.setItem('score', this.score);

    return true;
  }
}

// eslint-disable-next-line no-unused-vars
const game = new Game2048();

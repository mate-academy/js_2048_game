/* eslint-disable max-len */
'use strict';

// const { formatters } = require('stylelint');

const start = document.querySelector('.start');
const restart = document.querySelector('.restart');
const startMessage = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const gameOverMessage = document.querySelector('.message-lose');
const table = document.querySelector('table');
const [...rowsArray] = table.rows;

const typeOfMoves = {
  ArrowLeft: 'leftHandler',
  ArrowRight: 'rightHandler',
  ArrowUp: 'upHandler',
  ArrowDown: 'downHandler',
};
const cellStyle = new Map([
  [2, 'field-cell--2'],
  [4, 'field-cell--4'],
  [8, 'field-cell--8'],
  [16, 'field-cell--16'],
  [32, 'field-cell--32'],
  [64, 'field-cell--64'],
  [128, 'field-cell--128'],
  [256, 'field-cell--256'],
  [512, 'field-cell--512'],
  [1024, 'field-cell--1024'],
  [2048, 'field-cell--2048'],
]);

class Tile {
  constructor() {
    this.isOccupied = false;
    this.className = cellStyle.get(0);
    this.value = 0;
    this.row = 0;
    this.cell = 0;
    this.td = null;

    this.currentPosition = {
      x: 0,
      y: 0,
    };
  }
}
class Game {
  constructor() {
    this.message = null;
    this.startCellsNum = 0;
    this.height = 4;
    this.width = 4;
    this.field = [];
    this.gameScore = 0;
    this.availableCells = 16;
    this.winningNumber = 2048;
  }
  initField(arr, width) {
    if (width === this.width) {
      return;
    }

    const row = [];

    for (let cell = 0; cell < this.height; cell++) {
      const tile = new Tile();

      tile.currentPosition.x = rowsArray[width].cells[cell].offsetLeft;
      tile.currentPosition.y = rowsArray[width].cells[cell].offsetTop;
      row.push(tile);
    }
    arr.push(row);
    this.initField(arr, width + 1);
  }
  generateValue() {
    if (this.availableCells === 0) {
      return;
    }
    this.startCellsNum = (this.availableCells >= 2) ? 2 : 1;

    while (this.startCellsNum > 0) {
      const row = this.getRandom(this.width);
      const col = this.getRandom(this.height);

      if (!this.field[row][col].isOccupied) {
        const tile = this.field[row][col];

        tile.isOccupied = true;
        tile.value = this.getRandom(0, 1);
        this.renderRandomTile(tile, table);
        this.startCellsNum--;
      }
    }
    this.checkAvailableCells();
  }
  getRandom(...rest) {
    if (rest.length > 1) {
      const min = rest[0];
      const max = rest[1];
      const value = Math.random() * (max - min) + min;

      return (value <= 0.1) ? 4 : 2;
    }

    return parseInt(Math.random() * rest - 0.0001);
  }
  renderRandomTile(element, gameField) {
    const style = cellStyle.get(element.value);

    element.td = document.createElement('td');
    element.td.className = 'field-cell';
    element.td.style.position = 'absolute';
    element.td.style.zIndex = 2;
    element.td.style.left = element.currentPosition.x + 'px';
    element.td.style.top = element.currentPosition.y + 'px';
    element.td.innerText = element.value;
    element.td.classList.toggle(style);
    element.td.classList.add('animate');
    gameField.append(element.td);
  }
  render() {
    gameScore.innerHTML = this.gameScore;
  }
  moveUp() {
    for (let col = 0; col < this.height; col++) {
      for (let row = 0; row < this.width; row++) {
        if (!this.field[row][col].isOccupied) {
          continue;
        }

        let i = row;

        while (i > 0 && !this.field[i - 1][col].isOccupied) {
          this.shiftNotEmptyCells(this.field[i][col], this.field[i - 1][col]);
          i--;
        }

        if (i > 0) {
          if (this.field[i - 1][col].value === this.field[i][col].value) {
            this.mergeCells(this.field[i][col], this.field[i - 1][col]);
            this.checkTileScore(this.field[i - 1][col]);
          }
        }
      }
    }
  }
  moveDown() {
    for (let col = 0; col < this.width; col++) {
      for (let row = this.height - 1; row >= 0; row--) {
        if (!this.field[row][col].isOccupied) {
          continue;
        }

        let i = row;

        while (i < this.height - 1 && !this.field[i + 1][col].isOccupied) {
          this.shiftNotEmptyCells(this.field[i][col], this.field[i + 1][col]);

          i++;
        }

        if (i < this.height - 1) {
          if (this.field[i + 1][col].value === this.field[i][col].value) {
            this.mergeCells(this.field[i][col], this.field[i + 1][col]);
            this.checkTileScore(this.field[i + 1][col]);
          }
        }
      }
    }
  }
  moveLeft() {
    for (let row = 0; row < this.width; row++) {
      for (let col = 0; col < this.height; col++) {
        if (!this.field[row][col].isOccupied) {
          continue;
        }

        let i = col;

        while (i > 0 && !this.field[row][i - 1].isOccupied) {
          this.shiftNotEmptyCells(this.field[row][i], this.field[row][i - 1]);

          i--;
        }

        if (i > 0) {
          if (this.field[row][i - 1].value === this.field[row][i].value) {
            this.mergeCells(this.field[row][i], this.field[row][i - 1]);
            this.checkTileScore(this.field[row][i - 1]);
          }
        }
      }
    }
  }
  moveRight() {
    for (let row = 0; row < this.width; row++) {
      for (let col = this.height - 1; col >= 0; col--) {
        if (!this.field[row][col].isOccupied) {
          continue;
        }

        let i = col;

        while (i < this.height - 1 && !this.field[row][i + 1].isOccupied) {
          this.shiftNotEmptyCells(this.field[row][i], this.field[row][i + 1]);

          i++;
        }

        if (i < this.height - 1) {
          if (this.field[row][i + 1].value === this.field[row][i].value) {
            this.mergeCells(this.field[row][i], this.field[row][i + 1]);
            this.checkTileScore(this.field[row][i + 1]);
          }
        }
      }
    }
  }
  getDirection(eventKey) {
    switch (eventKey) {
      case 'ArrowLeft': {
        this.moveLeft();
        break;
      }

      case 'ArrowRight': {
        this.moveRight();
        break;
      }

      case 'ArrowUp': {
        this.moveUp();
        break;
      }

      case 'ArrowDown': {
        this.moveDown();
        break;
      }
    }
    this.render();
  }
  shiftNotEmptyCells(fromCell, toCell) {
    toCell.value = fromCell.value;
    toCell.isOccupied = true;
    toCell.td = fromCell.td;
    toCell.td.classList.toggle(cellStyle.get(toCell.value));

    fromCell.value = 0;
    fromCell.isOccupied = false;
    fromCell.td.classList.toggle(cellStyle.get(toCell.value));

    toCell.td.style.left = toCell.currentPosition.x + 'px';
    toCell.td.style.top = toCell.currentPosition.y + 'px';
    toCell.td.innerHTML = toCell.value;
    fromCell.td = null;
  }
  mergeCells(fromCell, toCell) {
    toCell.value *= 2;
    this.gameScore += toCell.value;

    if (toCell.td !== null) {
      toCell.td.remove();
    }
    toCell.td = fromCell.td;

    toCell.td.style.left = toCell.currentPosition.x + 'px';
    toCell.td.style.top = toCell.currentPosition.y + 'px';
    toCell.td.innerHTML = toCell.value;
    toCell.td.classList.add(cellStyle.get(toCell.value));
    toCell.td.classList.remove('animate');
    toCell.td.classList.toggle('pulse');

    setTimeout(function() {
      toCell.td.classList.remove('pulse');
    }, 500);

    fromCell.value = 0;
    fromCell.isOccupied = false;
  }
  checkAvailableCells() {
    let cellsEmpty = 0;

    this.field.forEach(row => {
      row.forEach(cell => {
        cellsEmpty += (cell.isOccupied === false) ? 1 : 0;
      });
    });
    this.availableCells = cellsEmpty;

    if (this.availableCells === 0) {
      if (this.getPossibleMoves() === false) {
        this.stopGame(gameOverMessage);
      }
    }
  }
  checkTileScore(tile) {
    return (tile.value === this.winningNumber) ? this.stopGame(winMessage) : true;
  }
  getPossibleMoves() {
    let canBeMerged = false;

    for (let row = 0; row < this.width; row++) {
      for (let cell = 0; cell < this.height; cell++) {
        if (row > 0) {
          canBeMerged = canBeMerged || (this.field[row - 1][cell].value === this.field[row][cell].value);
        }

        if (row < this.width - 1) {
          canBeMerged = canBeMerged || (this.field[row + 1][cell].value === this.field[row][cell].value);
        }

        if (cell > 0) {
          canBeMerged = canBeMerged || (this.field[row][cell - 1].value === this.field[row][cell].value);
        }

        if (cell < this.height - 1) {
          canBeMerged = canBeMerged || this.field[row][cell + 1].value === this.field[row][cell].value;
        }

        if (canBeMerged === true) {
          return true;
        }
      }
    }

    return canBeMerged;
  }
  stopGame(message) {
    this.message = message;
    this.render();
    message.classList.remove('hidden');
    document.removeEventListener('keydown', kewDownEvent);
  }
  resetGameDependencies() {
    this.field.forEach(element => {
      element.forEach(tile => {
        tile.td = (tile.td !== null) ? tile.td.remove() : null;
        tile.value = 0;
        tile.isOccupied = false;
        this.className = cellStyle.get(0);
      });
    });
    this.gameScore = 0;
    this.startCellsNum = 0;
    this.availableCells = 16;
  }
  gameLogic(e) {
    if (!typeOfMoves.hasOwnProperty(e.key)) {
      return;
    }
    this.getDirection(e.key);
    this.checkAvailableCells();
    this.generateValue();
    this.render();
  }
  start(message) {
    message.classList.add('hidden');
    this.initField(this.field, 0);
    this.generateValue();
    this.render();
  }
  restart() {
    if (this.message !== null) {
      this.message.classList.add('hidden');
    }
    this.resetGameDependencies();
    this.generateValue();
    this.render();
  }
};

const obj = new Game();
const kewDownEvent = (e) => {
  obj.gameLogic(e);
};

start.addEventListener('click', () => {
  obj.start(startMessage);
  start.classList.add('hidden');
  restart.classList.remove('hidden');
  document.addEventListener('keydown', kewDownEvent);
}, { once: true });

restart.addEventListener('click', () => {
  obj.restart();
  document.addEventListener('keydown', kewDownEvent);
});

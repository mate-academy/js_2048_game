'use strict';

class Game {
  constructor() {
    this.scoreTotal = 0;
    this.rows = document.querySelectorAll('.field-row');
    this.gameScoreElement = document.querySelector('.game-score');
    this.fieldCells = document.querySelectorAll('.field-cell');
    this.startMessage = document.querySelector('.message-start');
    this.loseMessage = document.querySelector('.message-lose');
    this.winMessage = document.querySelector('.message-win');
    this.startButton = document.querySelector('.button.start');
    this.restartButton = document.querySelector('.button.restart');
  }

  isBoardEmpty() {
    return Array.from(this.fieldCells).every(cell => !cell.textContent);
  }

  initializeBoard() {
    this.resetCells(this.fieldCells);
    this.addNewNumber();
    this.updateBoard();
  }

  updateScored(mergedValue) {
    this.scoreTotal += parseInt(mergedValue, 10);
    this.gameScoreElement.textContent = this.scoreTotal;
  }

  randomNumCells(cells) {
    return Math.floor(Math.random() * cells.length);
  }

  addNewNumber() {
    const emptyCells = this.findEmptyCells();

    if (emptyCells.length > 0) {
      const randomEmptyCell = emptyCells[this.randomNumCells(emptyCells)];

      randomEmptyCell.textContent = this.generateRandomNumber();
    }
  }

  updateBoard() {
    this.fieldCells.forEach(cell => {
      cell.textContent = cell.textContent === '0' ? '' : cell.textContent;
    });
    this.gameScoreElement.textContent = this.scoreTotal;
  }

  findEmptyCells() {
    return Array.from(this.fieldCells).filter(cell => !cell.textContent);
  }

  resetCells(cells) {
    cells.forEach(cell => {
      cell.textContent = '';
      this.clearCellClass(cell);
    });
    this.gameScoreElement.textContent = 0;
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const currentCell = this.getCellAtPosition(i, j);

        if (j < 3 && currentCell.textContent === this.getCellAtPosition(i, j + 1).textContent) {
          return true;
        }

        if (i < 3 && currentCell.textContent === this.getCellAtPosition(i + 1, j).textContent) {
          return true;
        }
      }
    }

    return this.findEmptyCells().length > 0;
  }

  generateRandomNumber() {
    return Math.random() < 0.9 ? '2' : '4';
  }

  getCellAtPosition(row, col) {
    return document.querySelector(`.field-row:nth-child(${row + 1}) .field-cell:nth-child(${col + 1})`);
  }

  clearCellClass(cell) {
    cell.className = 'field-cell';
  }

  updateCellClass(cell, value) {
    this.clearCellClass(cell);
    cell.classList.add(`field-cell--${value}`);
  }

  removeEmptyCells(cells) {
    return cells.filter(cell => cell.textContent !== '');
  }

  generateRandomCell() {
    const emptyCells = Array.from(this.fieldCells)
      .filter(cell => !cell.textContent);

    if (emptyCells.length > 0) {
      const randomEmptyCell = emptyCells[this.randomNumCells(emptyCells)];
      const newValue = this.generateRandomNumber();

      randomEmptyCell.textContent = newValue;
      this.updateCellClass(randomEmptyCell, newValue);
    }
  }

  checkFor2048() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = this.getCellAtPosition(i, j);

        if (cell.textContent === '2048') {
          return true;
        }
      }
    }

    return false;
}

  handleMessages() {
    if (!this.canMove()) {
      this.loseMessage.classList.remove('hidden');
    } else {
      this.startMessage.classList.add('hidden');
    }

    if (this.checkFor2048()) {
      this.winMessage.classList.remove('hidden');
    } else {
      this.winMessage.classList.add('hidden');
    }
  }

  moveCellsLeft() {
    let isChanged = false;

    this.rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('.field-cell'));
      const nonEmptyCells = this.removeEmptyCells(cells);

      for (let i = 0; i < nonEmptyCells.length - 1; i++) {
        const currentCell = nonEmptyCells[i];
        const nextCell = nonEmptyCells[i + 1];

        if (currentCell.textContent === nextCell.textContent && currentCell.textContent !== '') {
          const mergedValue = parseInt(currentCell.textContent) * 2;

          currentCell.textContent = mergedValue;
          nextCell.textContent = '';
          isChanged = true;
          this.updateCellClass(currentCell, mergedValue);

          this.updateScored(mergedValue);
          break;
        }
      }

      let j = 0;

      for (let i = 0; i < nonEmptyCells.length; i++) {
        if (nonEmptyCells[i].textContent !== '') {
          if (cells[j].textContent !== nonEmptyCells[i].textContent) {
            cells[j].textContent = nonEmptyCells[i].textContent;
            this.updateCellClass(cells[j], nonEmptyCells[i].textContent);

            isChanged = true;
          }
          j++;
        }
      }

      for (let i = j; i < cells.length; i++) {
        cells[i].textContent = '';
        this.clearCellClass(cells[i]);
      }
    });

    if (isChanged) {
      this.generateRandomCell();
    }
  }

  moveCellsRight() {
    let isChanged = false;

    this.rows.forEach(row => {
      const cells = Array.from(row.querySelectorAll('.field-cell'));
      const nonEmptyCells = this.removeEmptyCells(cells);

      for (let i = nonEmptyCells.length - 1; i > 0; i--) {
        const currentCell = nonEmptyCells[i];
        const prevCell = nonEmptyCells[i - 1];

        if (currentCell.textContent === prevCell.textContent
          && currentCell.textContent !== '') {
          const mergedValue = parseInt(currentCell.textContent) * 2;

          currentCell.textContent = mergedValue;
          prevCell.textContent = '';
          isChanged = true;
          this.updateScored(mergedValue);
          this.updateCellClass(currentCell, mergedValue);
          break;
        }
      }

      let j = cells.length - 1;

      for (let i = nonEmptyCells.length - 1; i >= 0; i--) {
        if (nonEmptyCells[i].textContent !== '') {
          if (cells[j].textContent !== nonEmptyCells[i].textContent) {
            cells[j].textContent = nonEmptyCells[i].textContent;
            this.updateCellClass(cells[j], nonEmptyCells[i].textContent);

            isChanged = true;
          }
          j--;
        }
      }

      for (let i = j; i >= 0; i--) {
        cells[i].textContent = '';
        this.clearCellClass(cells[i]);

        if (cells[i].textContent !== '') {
          isChanged = true;
        }
      }
    });

    if (isChanged) {
      this.generateRandomCell();
    }
  }

  moveCellsUp() {
    let isChanged = false;

    for (let j = 0; j < 4; j++) {
      const columnCells = [];

      for (let i = 0; i < 4; i++) {
        columnCells.push(this.rows[i].querySelectorAll('.field-cell')[j]);
      }

      const nonEmptyCells = this.removeEmptyCells(columnCells);

      for (let i = 0; i < nonEmptyCells.length - 1; i++) {
        const currentCell = nonEmptyCells[i];
        const nextCell = nonEmptyCells[i + 1];

        if (currentCell.textContent === nextCell.textContent
          && currentCell.textContent !== '') {
          const mergedValue = parseInt(currentCell.textContent) * 2;

          currentCell.textContent = mergedValue;
          nextCell.textContent = '';

          this.updateCellClass(currentCell, mergedValue);
          this.updateScored(mergedValue);
          isChanged = true;

          break;
        }
      }

      let k = 0;

      for (let i = 0; i < nonEmptyCells.length; i++) {
        if (nonEmptyCells[i].textContent !== '') {
          if (columnCells[k].textContent !== nonEmptyCells[i].textContent) {
            columnCells[k].textContent = nonEmptyCells[i].textContent;
            this.updateCellClass(columnCells[k], nonEmptyCells[i].textContent);
            isChanged = true;
          }
          k++;
        }
      }

      for (let i = k; i < 4; i++) {
        columnCells[i].textContent = '';
        this.clearCellClass(columnCells[i]);

        if (columnCells[i].textContent !== '') {
          isChanged = true;
        }
      }
    }

    if (isChanged) {
      this.generateRandomCell();
    }
  }

  moveCellsDown() {
    let isChanged = false;

    for (let j = 0; j < 4; j++) {
      const columnCells = [];

      for (let i = 3; i >= 0; i--) {
        columnCells.push(this.rows[i].querySelectorAll('.field-cell')[j]);
      }

      const nonEmptyCells = this.removeEmptyCells(columnCells);

      for (let i = nonEmptyCells.length - 1; i > 0; i--) {
        const currentCell = nonEmptyCells[i];
        const prevCell = nonEmptyCells[i - 1];

        if (currentCell.textContent === prevCell.textContent
          && currentCell.textContent !== '') {
          const mergedValue = parseInt(currentCell.textContent) * 2;

          currentCell.textContent = mergedValue;
          prevCell.textContent = '';

          this.updateCellClass(currentCell, mergedValue);
          this.updateScored(mergedValue);
          isChanged = true;

          break;
        }
      }

      let k = 0;

      for (let i = 0; i < nonEmptyCells.length; i++) {
        if (nonEmptyCells[i].textContent !== '') {
          if (columnCells[k].textContent !== nonEmptyCells[i].textContent) {
            columnCells[k].textContent = nonEmptyCells[i].textContent;
            this.updateCellClass(columnCells[k], nonEmptyCells[i].textContent);
            isChanged = true;
          }
          k++;
        }
      }

      for (let i = k; i < 4; i++) {
        if (columnCells[i].textContent !== '') {
          columnCells[i].textContent = '';
          isChanged = true;
          this.clearCellClass(columnCells[i]);
        }
      }
    }

    if (isChanged) {
      this.generateRandomCell();
    }
  }
}

window.Game = Game;

'use strict';

class Cell {
  constructor(cellEl, cellClass, x, y) {
    this.$el = cellEl;

    this.x = x;
    this.y = y;
    this.cellClass = cellClass;
    this.value = null;
    this.mergeValue = null;
  }

  setValue(value, mergeValue = null) {
    this.value = value;
    this.mergeValue = mergeValue;
    this.$el.innerText = this.value;
    this.$el.className = this.cellClass;

    if (this.value !== null) {
      this.$el.classList.add(`${this.cellClass}--${this.value}`);
    }
  }

  canMerge(newCell) {
    return !this.value || (!this.mergeValue && this.value === newCell.value);
  }
}

class Game {
  constructor() {
    this.messageClass = 'message';
    this.messageHiddenClass = 'hidden';
    this.cellClass = 'field-cell';
    this.state = 'start';
    this.cells = [];

    this.$score = document.querySelector('.game-score');
    this.$toggleBtn = document.querySelector('.button');
    this.$messages = document.querySelectorAll(`.${this.messageClass}`);
    this.$rows = document.querySelectorAll('.field-row');
  }

  init() {
    this.initCells();
    this.initEvents();
  }
  initCells() {
    this.$rows.forEach((row, rowIndex) => {
      const rowCells = row.querySelectorAll(`.${this.cellClass}`);

      rowCells.forEach((cell, cellIndex) => {
        this.cells.push(new Cell(cell, this.cellClass, cellIndex, rowIndex));
      });
    });
  }
  initEvents() {
    this.$toggleBtn.addEventListener('click', e => {
      e.preventDefault();

      this.restart();
    });
    document.addEventListener('keydown', this.handleKeyInput.bind(this));
  }
  groupCellsByColumn() {
    return this.cells.reduce((group, cell) => {
      group[cell.x] = group[cell.x] || [];
      group[cell.x][cell.y] = cell;

      return group;
    }, []);
  }
  groupCellsByRow() {
    return this.cells.reduce((group, cell) => {
      group[cell.y] = group[cell.y] || [];
      group[cell.y][cell.x] = cell;

      return group;
    }, []);
  }
  getRandomEmptyCell() {
    const emptyCells = this.cells.filter(cell => !cell.value);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }
  changeState(state = null) {
    this.state = state;

    this.$messages.forEach(message => {
      if (message.classList.contains(`${this.messageClass}-${this.state}`)) {
        message.classList.remove(this.messageHiddenClass);
      } else {
        message.classList.add(this.messageHiddenClass);
      }
    });

    if (this.state !== 'start') {
      this.$toggleBtn.classList.remove('start');
      this.$toggleBtn.classList.add('restart');
      this.$toggleBtn.innerText = 'Restart';
    }
  }
  changeScore(value = null) {
    const current = Number(this.$score.innerText);

    this.$score.innerText = value ? current + value : 0;
  }
  clearGrid() {
    this.cells.forEach(cell => cell.setValue(null));
    this.changeScore();
  }
  canMoveGroup(groupCells) {
    return groupCells.some(group => {
      return group.some((cell, index) => {
        if (index === 0) {
          return false;
        }

        if (!cell.value) {
          return false;
        }

        const targetCell = group[index - 1];

        return targetCell.canMerge(cell);
      });
    });
  }
  canMove() {
    return [
      this.groupCellsByColumn(),
      this.groupCellsByColumn().map(col => col.reverse()),
      this.groupCellsByRow(),
      this.groupCellsByRow().map(col => col.reverse()),
    ].some(this.canMoveGroup);
  }
  mergeCells() {
    this.cells.forEach(cell => {
      if (cell.mergeValue) {
        const newValue = cell.value + cell.mergeValue;

        cell.setValue(newValue);
        cell.mergeValue = null;

        this.changeScore(newValue);

        if (newValue >= 2048) {
          this.changeState('win');
        }
      }
    });
  }
  moveCells(groupCells) {
    if (this.state === 'start') {
      return this.restart();
    } else if (['win', 'lose'].includes(this.state)) {
      return;
    }

    if (!this.canMoveGroup(groupCells)) {
      return;
    }

    groupCells.forEach(group => {
      for (let i = 1; i < group.length; i++) {
        if (!group[i].value) {
          continue;
        }

        const cellWithValue = group[i];
        let targetCell;
        let j = i - 1;

        while (j >= 0 && group[j].canMerge(cellWithValue)) {
          targetCell = group[j];
          j--;
        }

        if (!targetCell) {
          continue;
        }

        targetCell.setValue(cellWithValue.value, targetCell.value);
        cellWithValue.setValue(null);
      }
    });

    this.mergeCells();
    this.getRandomEmptyCell().setValue(Math.random() > 0.5 ? 2 : 4);

    if (!this.canMove()) {
      this.changeState('lose');
    }
  }
  handleKeyInput(e) {
    switch (e.key) {
      case 'ArrowUp':
        this.moveCells(this.groupCellsByColumn());
        break;
      case 'ArrowDown':
        this.moveCells(this.groupCellsByColumn().map(col => col.reverse()));
        break;
      case 'ArrowLeft':
        this.moveCells(this.groupCellsByRow());
        break;
      case 'ArrowRight':
        this.moveCells(this.groupCellsByRow().map(col => col.reverse()));
        break;
      default:
        break;
    }
  }
  restart() {
    this.clearGrid();
    this.changeState();
    this.getRandomEmptyCell().setValue(Math.random() > 0.5 ? 2 : 4);
    this.getRandomEmptyCell().setValue(Math.random() > 0.5 ? 2 : 4);
  }
}

const game = new Game();

game.init();

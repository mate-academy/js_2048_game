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
    this.status = Game.STATUS.idle;
    this.fieldSize = initialState.length;
    this.initialState = initialState;
    this.score = 0;
    this.state = initialState.map((row) => [...row]);
  }

  getColumns(state) {
    return state[0].map((_, colIndex) => state.map((row) => row[colIndex]));
  }

  moveLeft() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const newRows = this.state.map((row) => {
      let newRow = row.filter((cell) => cell !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
        }
      }

      newRow = newRow.filter((cell) => cell !== 0);

      return [...newRow, ...Array(this.fieldSize - newRow.length).fill(0)];
    });

    const hasChanged = !this.state.every((row, rowIndex) => {
      return row.every((cell, cellIndex) => {
        return cell === newRows[rowIndex][cellIndex];
      });
    });

    if (hasChanged) {
      this.state = newRows;
      this.addNewCell();
      this.setField();
      this.getStatus();
    }
  }

  moveRight() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const newRows = this.state.map((row) => {
      let newRow = row.filter((cell) => cell !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] *= 2;
          newRow[i - 1] = 0;
          this.score += newRow[i];
        }
      }

      newRow = newRow.filter((cell) => cell !== 0);

      return [...Array(this.fieldSize - newRow.length).fill(0), ...newRow];
    });

    const hasChanged = !this.state.every((row, rowIndex) => {
      return row.every((cell, cellIndex) => {
        return cell === newRows[rowIndex][cellIndex];
      });
    });

    if (hasChanged) {
      this.state = newRows;
      this.addNewCell();
      this.setField();
      this.getStatus();
    }
  }

  moveUp() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const columns = this.getColumns(this.state);

    const newColumns = columns.map((column) => {
      let newColumn = column.filter((cell) => cell !== 0);

      for (let i = 0; i < newColumn.length - 1; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          newColumn[i] *= 2;
          newColumn[i + 1] = 0;
          this.score += newColumn[i];
        }
      }

      newColumn = newColumn.filter((cell) => cell !== 0);

      return [
        ...newColumn,
        ...Array(this.fieldSize - newColumn.length).fill(0),
      ];
    });

    const newState = newColumns[0].map((_, colIndex) => {
      return newColumns.map((column) => column[colIndex]);
    });

    const hasChanged = !this.state.every((row, rowIndex) => {
      return row.every((cell, cellIndex) => {
        return cell === newState[rowIndex][cellIndex];
      });
    });

    if (hasChanged) {
      this.state = newState;
      this.addNewCell();
      this.setField();
      this.getStatus();
    }
  }

  moveDown() {
    if (this.status !== Game.STATUS.playing) {
      return;
    }

    const columns = this.getColumns(this.state);

    const newColumns = columns.map((column) => {
      let newColumn = column.filter((cell) => cell !== 0);

      for (let i = newColumn.length - 1; i > 0; i--) {
        if (newColumn[i] === newColumn[i - 1]) {
          newColumn[i] *= 2;
          newColumn[i - 1] = 0;
          this.score += newColumn[i];
        }
      }

      newColumn = newColumn.filter((cell) => cell !== 0);

      return [
        ...Array(this.fieldSize - newColumn.length).fill(0),
        ...newColumn,
      ];
    });

    const newState = newColumns[0].map((_, colIndex) => {
      return newColumns.map((column) => column[colIndex]);
    });

    const hasChanged = !this.state.every((row, rowIndex) => {
      return row.every((cell, cellIndex) => {
        return cell === newState[rowIndex][cellIndex];
      });
    });

    if (hasChanged) {
      this.state = newState;
      this.addNewCell();
      this.setField();
      this.getStatus();
    }
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
    this.addNewCell();
    this.addNewCell();

    this.setField();
    this.score = 0;
  }

  restart() {
    this.status = Game.STATUS.idle;
    this.state = this.initialState.map((row) => [...row]);

    this.setField();
    this.score = 0;
  }

  setField() {
    const cells = document.querySelectorAll('.field-cell');
    const flatedState = this.state.flat();

    for (let i = 0; i < cells.length; i++) {
      cells[i].className = 'field-cell';

      if (flatedState[i]) {
        cells[i].textContent = flatedState[i];
        cells[i].classList.add(`field-cell--${flatedState[i]}`);
      } else {
        cells[i].textContent = '';
      }
    }

    for (const cell of flatedState) {
      if (cell === 2048) {
        this.status = Game.STATUS.win;
      }
    }

    const hasMove = this.checkMovesAvailable();

    if (!hasMove) {
      this.status = Game.STATUS.lose;
    }
  }

  checkMovesAvailable() {
    const flatedState = this.state.flat();

    const hasEmptyCells = !flatedState.every((cell) => cell !== 0);

    let canStack;

    for (let row = 0; row < this.fieldSize; row++) {
      for (let col = 0; col < this.fieldSize; col++) {
        if (
          (col < this.fieldSize - 1 &&
            this.state[row][col] === this.state[row][col + 1]) ||
          (row < this.fieldSize - 1 &&
            this.state[row][col] === this.state[row + 1][col])
        ) {
          canStack = true;
        }
      }
    }

    if (hasEmptyCells || canStack) {
      return true;
    }

    return false;
  }

  addNewCell() {
    const emptyCells = [];

    for (let i = 0; i < this.fieldSize; i++) {
      for (let j = 0; j < this.fieldSize; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const cellIndex = Math.floor(Math.random() * emptyCells.length);

    const { row, col } = emptyCells[cellIndex];

    const newState = this.state.map((r) => [...r]);

    newState[row][col] = Math.random() > 0.4 ? 2 : 4;

    this.state = newState;
  }
}

module.exports = Game;

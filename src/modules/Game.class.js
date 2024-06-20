'use strict';

class Game {
  // static INITIAL_STATE = [
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  //   [0, 0, 0, 0],
  // ];

  // static getInitialState(state) {
  //   return state || Game.INITIAL_STATE.map((row) => [...row]);
  // }

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    // this.state = Game.getInitialState(initialState);
    this.state = this.initialState.map((row) => [...row]);
    this.hasMoved = false;
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    if (this.status === 'playing') {
      return this.makeMove('left');
    }
  }
  moveRight() {
    if (this.status === 'playing') {
      return this.makeMove('right');
    }
  }
  moveUp() {
    if (this.status === 'playing') {
      return this.makeMove('up');
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      return this.makeMove('down');
    }
  }

  makeMove(direction) {
    this.hasMoved = this.moveLines(direction);

    if (this.hasMoved) {
      this.generateNewCell();
      this.hasMoved = false;
      this.getStatus();

      return true;
    }

    return false;
  }

  moveLines(direction, { precededCheckMove } = { precededCheckMove: false }) {
    const size = this.state.length;
    const isVertical = direction === 'up' || direction === 'down';

    const state = precededCheckMove ? this.getStateCopy() : this.state;
    const oldState = this.getStateCopy();

    for (let i = 0; i < size; i++) {
      const line = [];

      for (let j = 0; j < size; j++) {
        line.push(isVertical ? this.state[j][i] : this.state[i][j]);
      }

      const newLine = this.mergeLine(line, direction, { precededCheckMove });

      for (let j = 0; j < size; j++) {
        if (isVertical) {
          state[j][i] = newLine[j];
        } else {
          state[i][j] = newLine[j];
        }
      }
    }

    return this.isMove(oldState, state);
  }

  isMove(oldState, newState) {
    for (let i = 0; i < oldState.length; i++) {
      for (let j = 0; j < oldState.length; j++) {
        if (oldState[i][j] !== newState[i][j]) {
          return true; // if there is a diff in state
        }
      }
    }

    return false; // if there is no diff in state
  }

  mergeLine(line, direction, { precededCheckMove }) {
    const size = line.length;
    const stack = [];
    const newLine = new Array(size).fill(0);

    const startIndex =
      direction === 'up' || direction === 'left' ? 0 : size - 1;
    const endIndex = direction === 'up' || direction === 'left' ? size : -1;
    const step = direction === 'up' || direction === 'left' ? 1 : -1;

    let newIndex = startIndex;

    for (let i = startIndex; i !== endIndex; i += step) {
      const cellValue = line[i];

      if (cellValue !== 0) {
        if (stack.length === 0) {
          stack.push(cellValue);
        } else {
          if (stack[0] === cellValue) {
            const mergedValue = +stack[0] + +cellValue;

            newLine[newIndex] = stack.pop() + cellValue;
            newIndex += step;

            if (!precededCheckMove) {
              this.score += mergedValue;
            }
          } else {
            newLine[newIndex] = stack.pop();
            newIndex += step;
            stack.push(cellValue);
          }
        }
      }
    }

    if (stack.length > 0) {
      newLine[newIndex] = stack.pop();
    }

    return newLine;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStateCopy() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.status === 'playing' && !this.hasMoreMove()) {
      this.status = 'lose';
    }

    return this.status;
  }

  checkWin() {
    return this.state.some((line) => line.includes(2048));
  }

  start() {
    this.status = 'playing';
    this.generateNewCell();
    this.generateNewCell();
  }

  restart() {
    // this.state = Game.getInitialState();
    this.state = this.initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  updateField(field) {
    for (let i = 0; i < field.rows.length; i++) {
      for (let j = 0; j < field.rows[i].cells.length; j++) {
        const cellValue = this.state[i][j];

        field.rows[i].cells[j].textContent = cellValue !== 0 ? cellValue : '';

        if (cellValue !== '') {
          field.rows[i].cells[j].setAttribute(
            'class',
            `field-cell field-cell--${cellValue}`,
          );
        }
      }
    }

    const fragment = document.createDocumentFragment();

    Array.from(field.rows).forEach((row) => fragment.appendChild(row));

    return fragment;
  }

  generateNewCell() {
    const lines = this.state;
    const cellNum = Math.random() < 0.1 ? 4 : 2;

    const emptyCells = [];

    for (let i = 0; i < lines.length; i++) {
      for (let j = 0; j < lines[i].length; j++) {
        const cellValue = lines[i][j];

        if (cellValue === 0) {
          emptyCells.push({
            row: i,
            cell: j,
          });
        }
      }
    }

    if (!emptyCells.length) {
      this.getStatus();

      return false; // do not generate new cell
    }

    const randomEmptyCellIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, cell } = emptyCells[randomEmptyCellIndex];

    this.state[row][cell] = cellNum;
  }

  hasMoreMove() {
    return (
      this.moveLines('up', { precededCheckMove: true }) ||
      this.moveLines('down', { precededCheckMove: true }) ||
      this.moveLines('left', { precededCheckMove: true }) ||
      this.moveLines('right', { precededCheckMove: true })
    );
  }
}

module.exports = Game;

'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;
    this.state = this.cloneState(this.initialState);
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  createRandomCell() {
    const newField = [];

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.state[x][y] === 0) {
          newField.push([x, y]);
        }
      }
    }

    if (newField.length > 0) {
      const randomCellIndex = Math.floor(Math.random() * newField.length);

      const [x, y] = newField[randomCellIndex];

      this.state[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  combineCell(cells) {
    const newCells = cells.filter((cell) => cell !== 0);

    for (let i = 0; i < newCells.length - 1; i++) {
      if (newCells[i] === newCells[i + 1]) {
        newCells[i] *= 2;
        newCells[i + 1] = 0;
        this.score += newCells[i];
      }
    }

    return newCells.filter((cell) => cell !== 0);
  }

  rotateState(state) {
    const rotatedState = [];

    for (let y = 0; y < 4; y++) {
      rotatedState[y] = [];

      for (let x = 3; x >= 0; x--) {
        rotatedState[y].push(state[x][y]);
      }
    }

    return rotatedState;
  }

  rotateStateBack(state) {
    const rotatedState = [];

    for (let y = 0; y < 4; y++) {
      rotatedState[y] = [];

      for (let x = 0; x < 4; x++) {
        rotatedState[y].push(state[x][y]);
      }
    }

    return rotatedState.reverse();
  }

  moveRowLeft(row) {
    const newRow = this.combineCell(row);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  moveRowRight(row) {
    const newRow = this.combineCell(row);

    while (newRow.length < 4) {
      newRow.unshift(0);
    }

    return newRow;
  }

  moveStateLeft(state) {
    const newState = [];

    for (const row of state) {
      newState.push(this.moveRowLeft(row));
    }

    return newState;
  }

  moveStateRight(state) {
    const newState = [];

    for (const row of state) {
      newState.push(this.moveRowRight(row));
    }

    return newState;
  }

  moveStateUp(state) {
    const rotatedState = this.rotateState(state);

    const rotatedMoveRight = this.moveStateRight(rotatedState);

    return this.rotateStateBack(rotatedMoveRight);
  }

  moveStateDown(state) {
    const rotatedState = this.rotateState(state);

    const rotatedMoveLeft = this.moveStateLeft(rotatedState);

    return this.rotateStateBack(rotatedMoveLeft);
  }

  move(direction) {
    const stateBeforeMove = this.cloneState(this.state);

    this.checkGameStatus();

    this.createRandomCell();

    switch (direction) {
      case 'left':
        this.state = this.moveStateLeft(this.state);
        break;

      case 'right':
        this.state = this.moveStateRight(this.state);
        break;

      case 'up':
        this.state = this.moveStateUp(this.state);
        break;

      case 'down':
        this.state = this.moveStateDown(this.state);
        break;
    }

    return this.areStatesEqual(this.state, stateBeforeMove);
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  checkGameStatus() {
    if (!this.hasEmptyCell() && !this.canCombineCells()) {
      this.status = 'lose';

      return;
    }

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.state[x][y] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  hasEmptyCell() {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.state[x][y] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  canCombineCells() {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (
          (y < 3 && this.state[x][y] === this.state[x][y + 1]) ||
          (x < 3 && this.state[x][y] === this.state[x + 1][y])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  areStatesEqual(state1, state2) {
    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (state1[x][y] !== state2[x][y]) {
          return false;
        }
      }
    }

    return true;
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.createRandomCell();
      this.createRandomCell();
    }
  }

  restart() {
    if (this.status === 'playing') {
      this.state = this.cloneState(this.initialState);
    }

    this.status = 'idle';
    this.score = 0;
  }
}

module.exports = Game;

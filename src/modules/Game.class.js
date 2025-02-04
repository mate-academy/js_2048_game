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
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';

    for (let i = 0; i < 2; i++) {
      if (this.isEmptyCells()) {
        const [randomRow, randomColumn, randomNumber] = this.generateNumber();

        this.state[randomRow][randomColumn] = randomNumber;
      }
    }
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  gameOver() {
    this.status = 'lose';
  }

  win() {
    this.status = 'win';
  }

  generateNumber() {
    let randomRow = 0;
    let randomColumn = 0;
    const randomNumber = Math.random() > 0.9 ? 4 : 2;

    do {
      randomRow = Math.round(Math.random() * 3);
      randomColumn = Math.round(Math.random() * 3);
    } while (this.state[randomRow][randomColumn] !== 0);

    return [randomRow, randomColumn, randomNumber];
  }

  isEqualStates(state1, state2) {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (state1[row][column] !== state2[row][column]) {
          return false;
        }
      }
    }

    return true;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.state.map((row) => [...row]);
    const isLeftRightDirection = 'left right'.includes(direction);
    const isUpLeft = 'left up'.includes(direction);

    for (let i = 0; i < 4; i++) {
      let emptyCell = -1;
      const firstNeighbour = {
        index: -1,
        number: -1,
      };

      const [start, step] = isUpLeft ? [0, 1] : [3, -1];

      for (let j = start; j < 4 && j >= 0; j += step) {
        const [firstIndex, secondIndex] = isLeftRightDirection
          ? [i, j]
          : [j, i];
        const currentValue = this.state[firstIndex][secondIndex];

        if (currentValue === 0) {
          if (isLeftRightDirection) {
            emptyCell = emptyCell === -1 ? secondIndex : emptyCell;
          } else {
            emptyCell = emptyCell === -1 ? firstIndex : emptyCell;
          }
          continue;
        }

        if (
          firstNeighbour.index !== -1 &&
          firstNeighbour.number === currentValue
        ) {
          if (isLeftRightDirection) {
            this.state[firstIndex][firstNeighbour.index] = currentValue * 2;

            emptyCell = isUpLeft
              ? Math.min(emptyCell, secondIndex)
              : Math.max(emptyCell, secondIndex);
            emptyCell = emptyCell === -1 ? secondIndex : emptyCell;
          } else {
            this.state[firstNeighbour.index][secondIndex] = currentValue * 2;

            emptyCell = isUpLeft
              ? Math.min(emptyCell, firstIndex)
              : Math.max(emptyCell, firstIndex);
            emptyCell = emptyCell === -1 ? firstIndex : emptyCell;
          }
          this.state[firstIndex][secondIndex] = 0;
          this.score += currentValue * 2;

          firstNeighbour.index = -1;
          firstNeighbour.number = -1;

          if (currentValue * 2 === 2048) {
            this.win();
          }

          continue;
        }

        if (emptyCell !== -1) {
          if (isLeftRightDirection) {
            this.state[firstIndex][emptyCell] = currentValue;
          } else {
            this.state[emptyCell][secondIndex] = currentValue;
          }

          this.state[firstIndex][secondIndex] = 0;

          firstNeighbour.index = emptyCell;
          firstNeighbour.number = currentValue;
          emptyCell += isUpLeft ? 1 : -1;

          continue;
        }

        firstNeighbour.index = isLeftRightDirection ? secondIndex : firstIndex;
        firstNeighbour.number = currentValue;
      }
    }

    if (!this.isEqualStates(previousState, this.state)) {
      if (this.isEmptyCells()) {
        const [randomRow, randomColumn, randomNumber] = this.generateNumber();

        this.state[randomRow][randomColumn] = randomNumber;
      }
    }

    if (!this.hasAvailableMoves()) {
      this.gameOver();
    }
  }

  isEmptyCells() {
    return this.state.flat().includes(0);
  }

  hasAvailableMoves() {
    return this.state.some(
      (row, i) =>
        row.includes(0) ||
        row.some(
          (val, j) =>
            (j < 3 && val === row[j + 1]) ||
            (i < 3 && val === this.state[i + 1][j]),
        ),
    );
  }
}

module.exports = Game;

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
    this.initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    if (this.isBoardEmpty()) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.state.map((row) => [...row]);
    let gainedScore = 0;

    if (direction === 'left') {
      for (let rowNumber = 0; rowNumber < 4; rowNumber++) {
        const result = this.mergeLine(this.state[rowNumber]);

        this.state[rowNumber] = result.line;
        gainedScore += result.score;
      }
    }

    if (direction === 'right') {
      for (let rowNumber = 0; rowNumber < 4; rowNumber++) {
        const reversed = [...this.state[rowNumber]].reverse();
        const result = this.mergeLine(reversed);

        this.state[rowNumber] = result.line.reverse();
        gainedScore += result.score;
      }
    }

    if (direction === 'up') {
      for (let columnNumber = 0; columnNumber < 4; columnNumber++) {
        const column = [];

        for (let rowNumber = 0; rowNumber < 4; rowNumber++) {
          column.push(this.state[rowNumber][columnNumber]);
        }

        const result = this.mergeLine(column);

        for (let rowNumber = 0; rowNumber < 4; rowNumber++) {
          this.state[rowNumber][columnNumber] = result.line[rowNumber];
        }

        gainedScore += result.score;
      }
    }

    if (direction === 'down') {
      for (let columnNumber = 0; columnNumber < 4; columnNumber++) {
        const column = [];

        for (let rowNumber = 3; rowNumber >= 0; rowNumber--) {
          column.push(this.state[rowNumber][columnNumber]);
        }

        const result = this.mergeLine(column);

        for (
          let rowNumber = 3, resultIndex = 0;
          rowNumber >= 0;
          rowNumber--, resultIndex++
        ) {
          this.state[rowNumber][columnNumber] = result.line[resultIndex];
        }

        gainedScore += result.score;
      }
    }

    if (!this.statesAreEqual(oldState, this.state)) {
      this.score += gainedScore;
      this.addRandomTile();
    }

    this.updateStatus();
  }

  mergeLine(line) {
    const numbers = line.filter((value) => value !== 0);
    const result = [];
    let score = 0;

    for (let index = 0; index < numbers.length; index++) {
      if (numbers[index] === numbers[index + 1]) {
        const merged = numbers[index] * 2;

        result.push(merged);
        score += merged;
        index++;
      } else {
        result.push(numbers[index]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return {
      line: result,
      score,
    };
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowNumber = 0; rowNumber < 4; rowNumber++) {
      for (let columnNumber = 0; columnNumber < 4; columnNumber++) {
        if (this.state[rowNumber][columnNumber] === 0) {
          emptyCells.push([rowNumber, columnNumber]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const targetCell = emptyCells[randomIndex];
    const targetRow = targetCell[0];
    const targetColumn = targetCell[1];

    this.state[targetRow][targetColumn] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  hasAvailableMoves() {
    for (let rowNumber = 0; rowNumber < 4; rowNumber++) {
      for (let columnNumber = 0; columnNumber < 4; columnNumber++) {
        if (this.state[rowNumber][columnNumber] === 0) {
          return true;
        }

        if (
          columnNumber < 3 &&
          this.state[rowNumber][columnNumber] ===
            this.state[rowNumber][columnNumber + 1]
        ) {
          return true;
        }

        if (
          rowNumber < 3 &&
          this.state[rowNumber][columnNumber] ===
            this.state[rowNumber + 1][columnNumber]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  statesAreEqual(first, second) {
    for (let rowNumber = 0; rowNumber < first.length; rowNumber++) {
      for (
        let columnNumber = 0;
        columnNumber < first[rowNumber].length;
        columnNumber++
      ) {
        if (
          first[rowNumber][columnNumber] !== second[rowNumber][columnNumber]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  isBoardEmpty() {
    return this.state.every((row) => row.every((cell) => cell === 0));
  }
}

module.exports = Game;

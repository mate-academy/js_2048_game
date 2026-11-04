'use strict';

function areStatesEqual(stateA, stateB) {
  for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
    for (let colIndex = 0; colIndex < 4; colIndex += 1) {
      if (stateA[rowIndex][colIndex] !== stateB[rowIndex][colIndex]) {
        return false;
      }
    }
  }

  return true;
}

function transpose(matrix) {
  const result = [];

  for (let colIndex = 0; colIndex < 4; colIndex += 1) {
    result[colIndex] = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      result[colIndex].push(matrix[rowIndex][colIndex]);
    }
  }

  return result;
}

function slideRow(row) {
  const nonZero = row.filter((val) => val !== 0);
  const newRow = [];
  let scoreGain = 0;
  let i = 0;

  while (i < nonZero.length) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const merged = nonZero[i] * 2;

      newRow.push(merged);
      scoreGain += merged;
      i += 2;
    } else {
      newRow.push(nonZero[i]);
      i += 1;
    }
  }

  while (newRow.length < 4) {
    newRow.push(0);
  }

  return { row: newRow, scoreGain };
}

class Game {
  constructor(initialState) {
    if (initialState) {
      this.initialState = initialState.map((row) => [...row]);
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  hasTile(target) {
    return this.state.some((row) => row.includes(target));
  }

  canMove() {
    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 4; colIndex += 1) {
        if (this.state[rowIndex][colIndex] === 0) {
          return true;
        }

        if (
          colIndex < 3 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex][colIndex + 1]
        ) {
          return true;
        }

        if (
          rowIndex < 3 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex + 1][colIndex]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
      for (let colIndex = 0; colIndex < 4; colIndex += 1) {
        if (this.state[rowIndex][colIndex] === 0) {
          emptyCells.push({
            row: rowIndex,
            col: colIndex,
          });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const targetCell = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[targetCell.row][targetCell.col] = value;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();

    if (this.hasTile(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  makeMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    let totalScore = 0;
    let nextState = [];

    if (direction === 'left') {
      for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
        const { row, scoreGain } = slideRow(this.state[rowIndex]);

        nextState.push(row);
        totalScore += scoreGain;
      }
    } else if (direction === 'right') {
      for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
        const reversed = [...this.state[rowIndex]].reverse();
        const { row, scoreGain } = slideRow(reversed);

        nextState.push(row.reverse());
        totalScore += scoreGain;
      }
    } else if (direction === 'up') {
      const transposed = transpose(this.state);
      const slid = [];

      for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
        const { row, scoreGain } = slideRow(transposed[rowIndex]);

        slid.push(row);
        totalScore += scoreGain;
      }

      nextState = transpose(slid);
    } else if (direction === 'down') {
      const transposed = transpose(this.state);
      const slid = [];

      for (let rowIndex = 0; rowIndex < 4; rowIndex += 1) {
        const reversed = [...transposed[rowIndex]].reverse();
        const { row, scoreGain } = slideRow(reversed);

        slid.push(row.reverse());
        totalScore += scoreGain;
      }

      nextState = transpose(slid);
    }

    if (areStatesEqual(this.state, nextState)) {
      return;
    }

    this.state = nextState;
    this.score += totalScore;
    this.addRandomTile();

    if (this.hasTile(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    this.makeMove('left');
  }

  moveRight() {
    this.makeMove('right');
  }

  moveUp() {
    this.makeMove('up');
  }

  moveDown() {
    this.makeMove('down');
  }
}

module.exports = Game;

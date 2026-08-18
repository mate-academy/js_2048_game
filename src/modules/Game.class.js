'use strict';

const BOARD_SIZE = 4;
const WINNING_VALUE = 2048;

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

function copyState(state) {
  return state.map((row) => [...row]);
}

function transpose(state) {
  return state[0].map((_, column) => state.map((row) => row[column]));
}

function statesEqual(firstState, secondState) {
  return JSON.stringify(firstState) === JSON.stringify(secondState);
}

class Game {
  constructor(initialState = createEmptyBoard()) {
    this.initialState = copyState(initialState);
    this.state = copyState(initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move((state) => this.mergeRows(state));
  }

  moveRight() {
    this.move((state) => this.mergeRows(state, true));
  }

  moveUp() {
    this.move((state) => this.mergeColumns(state));
  }

  moveDown() {
    this.move((state) => this.mergeColumns(state, true));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return copyState(this.state);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  restart() {
    this.state = copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  move(transform) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = copyState(this.state);
    const result = transform(copyState(this.state));

    if (statesEqual(previousState, result.state)) {
      this.updateStatus();

      return;
    }

    this.state = result.state;
    this.score += result.score;
    this.addRandomTile();
    this.updateStatus();
  }

  mergeRows(state, reverse = false) {
    let moveScore = 0;
    const nextState = state.map((currentRow) => {
      const result = reverse
        ? this.mergeReversedLine(currentRow)
        : this.mergeLine(currentRow);

      moveScore += result.score;

      return result.line;
    });

    return {
      state: nextState,
      score: moveScore,
    };
  }

  mergeLine(line) {
    const values = line.filter(Boolean);
    const merged = [];
    let lineScore = 0;

    for (let index = 0; index < values.length; index += 1) {
      if (values[index] === values[index + 1]) {
        const mergedValue = values[index] * 2;

        merged.push(mergedValue);
        lineScore += mergedValue;
        index += 1;
      } else {
        merged.push(values[index]);
      }
    }

    while (merged.length < BOARD_SIZE) {
      merged.push(0);
    }

    return {
      line: merged,
      score: lineScore,
    };
  }

  mergeReversedLine(line) {
    const result = this.mergeLine([...line].reverse());

    return {
      line: result.line.reverse(),
      score: result.score,
    };
  }

  mergeColumns(state, reverse = false) {
    const columns = transpose(state);
    const result = this.mergeRows(columns, reverse);

    return {
      state: transpose(result.state),
      score: result.score,
    };
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < BOARD_SIZE; columnIndex += 1) {
        if (this.state[rowIndex][columnIndex] === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [targetRow, targetColumn] = emptyCells[randomIndex];

    this.state[targetRow][targetColumn] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.state.some((row) => row.includes(WINNING_VALUE))) {
      this.status = 'win';

      return;
    }

    this.status = this.hasAvailableMoves() ? 'playing' : 'lose';
  }

  hasAvailableMoves() {
    if (this.state.some((row) => row.includes(0))) {
      return true;
    }

    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let column = 0; column < BOARD_SIZE; column += 1) {
        const current = this.state[row][column];
        const right = this.state[row][column + 1];
        const below = this.state[row + 1]?.[column];

        if (current === right || current === below) {
          return true;
        }
      }
    }

    return false;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
} else {
  window.Game = Game;
}

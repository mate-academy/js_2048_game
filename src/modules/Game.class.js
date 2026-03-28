'use strict';

const BOARD_SIZE = 4;
const WIN_VALUE = 2048;

function createEmptyState() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(0));
}

function cloneState(state) {
  return state.map((row) => [...row]);
}

function transpose(state) {
  const result = createEmptyState();

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      result[col][row] = state[row][col];
    }
  }

  return result;
}

function reverseRows(state) {
  return state.map((row) => [...row].reverse());
}

class Game {
  /**
   * @param {number[][]} initialState
   */
  constructor(initialState = createEmptyState()) {
    this.initialState = cloneState(initialState);
    this.state = cloneState(initialState);
    this.score = 0;
    this.status = 'idle';
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

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return cloneState(this.state);
  }

  /**
   * @returns {string}
   */
  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.addRandomCell();
    this.addRandomCell();
    this.updateStatus();
  }

  restart() {
    this.state = cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  makeMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const { nextState, gainedScore } = this.getMovedState(direction);

    if (this.isSameState(this.state, nextState)) {
      return;
    }

    this.state = nextState;
    this.score += gainedScore;
    this.addRandomCell();
    this.updateStatus();
  }

  getMovedState(direction) {
    switch (direction) {
      case 'left':
        return this.moveStateLeft(this.state);

      case 'right':
        return this.moveStateRight(this.state);

      case 'up':
        return this.moveStateUp(this.state);

      case 'down':
        return this.moveStateDown(this.state);

      default:
        return {
          nextState: cloneState(this.state),
          gainedScore: 0,
        };
    }
  }

  moveStateLeft(state) {
    const nextState = [];
    let gainedScore = 0;

    for (const row of state) {
      const processed = this.processLine(row);

      nextState.push(processed.line);
      gainedScore += processed.gainedScore;
    }

    return {
      nextState,
      gainedScore,
    };
  }

  moveStateRight(state) {
    const reversed = reverseRows(state);
    const moved = this.moveStateLeft(reversed);

    return {
      nextState: reverseRows(moved.nextState),
      gainedScore: moved.gainedScore,
    };
  }

  moveStateUp(state) {
    const transposed = transpose(state);
    const moved = this.moveStateLeft(transposed);

    return {
      nextState: transpose(moved.nextState),
      gainedScore: moved.gainedScore,
    };
  }

  moveStateDown(state) {
    const transposed = transpose(state);
    const moved = this.moveStateRight(transposed);

    return {
      nextState: transpose(moved.nextState),
      gainedScore: moved.gainedScore,
    };
  }

  processLine(line) {
    const filtered = line.filter((value) => value !== 0);
    const merged = [];
    let gainedScore = 0;

    for (let i = 0; i < filtered.length; i += 1) {
      const current = filtered[i];
      const next = filtered[i + 1];

      if (current === next) {
        const mergedValue = current * 2;

        merged.push(mergedValue);
        gainedScore += mergedValue;
        i += 1;
      } else {
        merged.push(current);
      }
    }

    while (merged.length < BOARD_SIZE) {
      merged.push(0);
    }

    return {
      line: merged,
      gainedScore,
    };
  }

  addRandomCell() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < BOARD_SIZE; rowIndex += 1) {
      for (let colIndex = 0; colIndex < BOARD_SIZE; colIndex += 1) {
        if (this.state[rowIndex][colIndex] === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [targetRow, targetCol] = emptyCells[randomIndex];

    this.state[targetRow][targetCol] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.hasWinningCell()) {
      this.status = 'win';

      return;
    }

    if (this.hasAvailableMoves()) {
      this.status = 'playing';

      return;
    }

    this.status = 'lose';
  }

  hasWinningCell() {
    return this.state.some((row) => row.some((cell) => cell >= WIN_VALUE));
  }

  hasAvailableMoves() {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        const current = this.state[row][col];

        if (current === 0) {
          return true;
        }

        const right = col < BOARD_SIZE - 1 ? this.state[row][col + 1] : null;
        const down = row < BOARD_SIZE - 1 ? this.state[row + 1][col] : null;

        if (current === right || current === down) {
          return true;
        }
      }
    }

    return false;
  }

  isSameState(firstState, secondState) {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        if (firstState[row][col] !== secondState[row][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;

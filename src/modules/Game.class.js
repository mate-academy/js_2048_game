'use strict';

const SIZE = 4;
const EMPTY_BOARD = () =>
  Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

class Game {
  constructor(initialState = EMPTY_BOARD()) {
    this.validateState(initialState);
    this.initialState = initialState.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    return this.move(
      (board) => board,
      (board) => board,
    );
  }

  moveRight() {
    return this.move(
      (board) => board.map((row) => [...row].reverse()),
      (board) => board.map((row) => [...row].reverse()),
    );
  }

  moveUp() {
    return this.move(
      (board) => this.transpose(board),
      (board) => this.transpose(board),
    );
  }

  moveDown() {
    return this.move(
      (board) => this.transpose(board).map((row) => row.reverse()),
      (board) => this.transpose(board.map((row) => row.reverse())),
    );
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    if (this.state.flat().every((value) => value === 0)) {
      this.addRandomTile();
      this.addRandomTile();
    }

    this.updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  move(toLeft, fromLeft) {
    if (this.status !== 'playing') {
      return false;
    }

    const previousState = JSON.stringify(this.state);
    let gainedScore = 0;
    const rows = toLeft(this.getState()).map((row) => {
      const result = this.collapseRow(row);

      gainedScore += result.score;

      return result.row;
    });
    const nextState = fromLeft(rows);

    if (JSON.stringify(nextState) === previousState) {
      return false;
    }

    this.state = nextState;
    this.score += gainedScore;
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  collapseRow(row) {
    const values = row.filter(Boolean);
    const result = [];
    let score = 0;

    for (let i = 0; i < values.length; i += 1) {
      if (values[i] === values[i + 1]) {
        const mergedValue = values[i] * 2;

        result.push(mergedValue);
        score += mergedValue;
        i += 1;
      } else {
        result.push(values[i]);
      }
    }

    while (result.length < SIZE) {
      result.push(0);
    }

    return { row: result, score };
  }

  transpose(board) {
    return board[0].map((_, column) => board.map((row) => row[column]));
  }

  hasAdjacentEqualCells(board) {
    return board.some((currentRow) => {
      return currentRow.some((value, index) => {
        return value === currentRow[index + 1];
      });
    });
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((cellRow, rowIndex) => {
      cellRow.forEach((value, columnIndex) => {
        if (value === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    if (!emptyCells.length) {
      return;
    }

    const [selectedRow, selectedColumn] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[selectedRow][selectedColumn] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    const hasEmptyCell = this.state.flat().includes(0);
    const hasHorizontalMerge = this.hasAdjacentEqualCells(this.state);
    const transposedState = this.transpose(this.state);
    const hasVerticalMerge = this.hasAdjacentEqualCells(transposedState);

    if (!hasEmptyCell && !hasHorizontalMerge && !hasVerticalMerge) {
      this.status = 'lose';
    }
  }

  validateState(state) {
    const isBoard =
      Array.isArray(state) &&
      state.length === SIZE &&
      state.every((row) => Array.isArray(row) && row.length === SIZE);

    if (!isBoard) {
      throw new TypeError('Initial state must be a 4 x 4 matrix');
    }

    const hasInvalidCell = state
      .flat()
      .some(
        (value) =>
          !Number.isInteger(value) ||
          value < 0 ||
          (value !== 0 && (value & (value - 1)) !== 0),
      );

    if (hasInvalidCell) {
      throw new TypeError('Cells must contain 0 or a power of two');
    }
  }
}

module.exports = Game;

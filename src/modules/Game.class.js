'use strict';

export default class Game  {
  constructor(initialState = null) {
    this.initialState =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));

    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  getState() {
    return this.cloneState(this.state);
  }

  getScore() {
    return this.score;
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

    if (this.hasWon()) {
      this.status = 'win';
    }
  }

  restart() {
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.makeMove((board) => {
      return board.map((row) => this.mergeRow(row));
    });
  }

  moveRight() {
    this.makeMove((board) => {
      return board.map((row) => {
        return this.mergeRow([...row].reverse()).reverse();
      });
    });
  }

  moveUp() {
    this.makeMove((board) => {
      const transposed = this.transpose(board);

      const merged = transposed.map((row) => {
        return this.mergeRow(row);
      });

      return this.transpose(merged);
    });
  }

  moveDown() {
    this.makeMove((board) => {
      const transposed = this.transpose(board);

      const merged = transposed.map((row) => {
        return this.mergeRow([...row].reverse()).reverse();
      });

      return this.transpose(merged);
    });
  }

  makeMove(moveLogic) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.state);
    const newBoard = moveLogic(this.cloneState(this.state));

    if (oldBoard === JSON.stringify(newBoard)) {
      if (!this.canMove()) {
        this.status = 'lose';
      }

      return;
    }

    this.state = newBoard;

    if (this.hasWon()) {
      this.status = 'win';

      return;
    }

    this.addRandomTile();

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  mergeRow(row) {
    const filtered = row.filter((cell) => cell !== 0);
    const result = [];

    for (let index = 0; index < filtered.length; index++) {
      if (filtered[index] === filtered[index + 1]) {
        const mergedValue = filtered[index] * 2;

        result.push(mergedValue);
        this.score += mergedValue;

        index++;
      } else {
        result.push(filtered[index]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  transpose(matrix) {
    return matrix[0].map((_, columnIndex) => {
      return matrix.map((row) => row[columnIndex]);
    });
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        if (this.state[rowIndex][columnIndex] === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [targetRow, targetColumn] = emptyCells[randomIndex];

    this.state[targetRow][targetColumn] = Math.random() < 0.9 ? 2 : 4;
  }

  hasWon() {
    return this.state.some((row) => {
      return row.some((cell) => cell === 2048);
    });
  }

  canMove() {
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        const value = this.state[rowIndex][columnIndex];

        if (value === 0) {
          return true;
        }

        if (rowIndex < 3 && value === this.state[rowIndex + 1][columnIndex]) {
          return true;
        }

        if (
          columnIndex < 3 &&
          value === this.state[rowIndex][columnIndex + 1]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

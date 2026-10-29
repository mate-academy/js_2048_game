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

  mergeLine(line) {
    const values = line.filter((value) => value !== 0);
    const result = [];

    for (let index = 0; index < values.length; index++) {
      if (values[index] === values[index + 1]) {
        const mergedValue = values[index] * 2;

        result.push(mergedValue);
        this.score += mergedValue;

        index++;
      } else {
        result.push(values[index]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  updateStatus() {
    const hasWinningTile = this.state.some((row) => {
      return row.includes(2048);
    });

    if (hasWinningTile) {
      this.status = 'win';

      return;
    }

    const hasAvailableMoves = this.state.some((row, rowIndex) => {
      return row.some((value, columnIndex) => {
        const isEmpty = value === 0;

        const canMergeRight = columnIndex < 3 && value === row[columnIndex + 1];

        const canMergeDown =
          rowIndex < 3 && value === this.state[rowIndex + 1][columnIndex];

        return isEmpty || canMergeRight || canMergeDown;
      });
    });

    this.status = hasAvailableMoves ? 'playing' : 'lose';
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

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    this.state = this.state.map((row) => this.mergeLine(row));

    const hasChanged = this.state.some((row, rowIndex) => {
      return row.some((value, columnIndex) => {
        return value !== previousState[rowIndex][columnIndex];
      });
    });

    if (hasChanged) {
      this.addTile();
    }

    this.updateStatus();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    this.state = this.state.map((row) => {
      const reversedRow = [...row].reverse();
      const mergedRow = this.mergeLine(reversedRow);

      return mergedRow.reverse();
    });

    const hasChanged = this.state.some((row, rowIndex) => {
      return row.some((value, columnIndex) => {
        return value !== previousState[rowIndex][columnIndex];
      });
    });

    if (hasChanged) {
      this.addTile();
    }

    this.updateStatus();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
      const column = this.state.map((row) => row[columnIndex]);
      const mergedColumn = this.mergeLine(column);

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        this.state[rowIndex][columnIndex] = mergedColumn[rowIndex];
      }
    }

    const hasChanged = this.state.some((row, rowIndex) => {
      return row.some((value, columnIndex) => {
        return value !== previousState[rowIndex][columnIndex];
      });
    });

    if (hasChanged) {
      this.addTile();
    }

    this.updateStatus();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.getState();

    for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
      const column = this.state.map((row) => row[columnIndex]);

      column.reverse();

      const mergedColumn = this.mergeLine(column);

      mergedColumn.reverse();

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        this.state[rowIndex][columnIndex] = mergedColumn[rowIndex];
      }
    }

    const hasChanged = this.state.some((row, rowIndex) => {
      return row.some((value, columnIndex) => {
        return value !== previousState[rowIndex][columnIndex];
      });
    });

    if (hasChanged) {
      this.addTile();
    }

    this.updateStatus();
  }

  addTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        if (value === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [tileRow, tileColumn] = emptyCells[randomIndex];

    this.state[tileRow][tileColumn] = Math.random() < 0.1 ? 4 : 2;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addTile();
    this.addTile();

    this.updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;

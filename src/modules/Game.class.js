'use strict';

export default class Game {
  static STATUSES = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.STATUSES.idle;
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
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
    if (this.status !== Game.STATUSES.idle) {
      return;
    }

    this.status = Game.STATUSES.playing;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.STATUSES.idle;
  }

  moveLeft() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let isMoved = false;

    const newState = this.state.map((row) => {
      const newRow = this.slideAndMerge(row);

      if (!this.areRowsEqual(row, newRow)) {
        isMoved = true;
      }

      return newRow;
    });

    if (isMoved) {
      this.state = newState;
      this.afterMove();
    }
  }

  moveRight() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let isMoved = false;

    const newState = this.state.map((row) => {
      const reversed = [...row].reverse();
      const merged = this.slideAndMerge(reversed).reverse();

      if (!this.areRowsEqual(row, merged)) {
        isMoved = true;
      }

      return merged;
    });

    if (isMoved) {
      this.state = newState;
      this.afterMove();
    }
  }

  moveUp() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    const transposed = this.transpose(this.state);
    let isMoved = false;

    const movedTransposed = transposed.map((row) => {
      const newRow = this.slideAndMerge(row);

      if (!this.areRowsEqual(row, newRow)) {
        isMoved = true;
      }

      return newRow;
    });

    if (isMoved) {
      this.state = this.transpose(movedTransposed);
      this.afterMove();
    }
  }

  moveDown() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    const transposed = this.transpose(this.state);
    let isMoved = false;

    const movedTransposed = transposed.map((row) => {
      const reversed = [...row].reverse();
      const merged = this.slideAndMerge(reversed).reverse();

      if (!this.areRowsEqual(row, merged)) {
        isMoved = true;
      }

      return merged;
    });

    if (isMoved) {
      this.state = this.transpose(movedTransposed);
      this.afterMove();
    }
  }

  slideAndMerge(row) {
    const filtered = row.filter((num) => num !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  afterMove() {
    this.addRandomTile();
    this.updateStatus();
  }

  forEachCell(callback) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const shouldStop = callback(this.state[r][c], r, c);

        if (shouldStop) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomTile() {
    const emptyCells = [];

    this.forEachCell((value, rIndex, cIndex) => {
      if (value === 0) {
        emptyCells.push({
          targetRow: rIndex,
          targetCol: cIndex,
        });
      }
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { targetRow, targetCol } = emptyCells[randomIndex];

    this.state[targetRow][targetCol] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    const has2048 = this.forEachCell((value) => value === 2048);

    if (has2048) {
      this.status = Game.STATUSES.win;

      return;
    }

    if (!this.canMove()) {
      this.status = Game.STATUSES.lose;
    }
  }

  canMove() {
    return this.forEachCell((current, rowIdx, colIdx) => {
      if (current === 0) {
        return true;
      }

      if (colIdx < 3 && current === this.state[rowIdx][colIdx + 1]) {
        return true;
      }

      if (rowIdx < 3 && current === this.state[rowIdx + 1][colIdx]) {
        return true;
      }

      return false;
    });
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  areRowsEqual(row1, row2) {
    return row1.every((val, index) => val === row2[index]);
  }
}

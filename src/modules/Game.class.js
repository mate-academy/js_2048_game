'use strict';

class Game {
  static Status = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.Status.IDLE;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.Status.PLAYING;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.Status.IDLE;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [randRow, randCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[randRow][randCol] = Math.random() < 0.1 ? 4 : 2;
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
    if (this.status !== Game.Status.PLAYING) {
      return;
    }

    const boardBefore = this.board.map((row) => [...row]);
    let scoreGain = 0;

    const slideAndMergeRow = (row) => {
      const filtered = row.filter((v) => v !== 0);
      const merged = [];
      let gain = 0;

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          const mergedVal = filtered[i] * 2;

          merged.push(mergedVal);
          gain += mergedVal;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      return { row: merged, gain };
    };

    const getRows = () => {
      if (direction === 'left' || direction === 'right') {
        return this.board.map((row) => [...row]);
      } else {
        // columns for up/down
        const cols = [];

        for (let c = 0; c < 4; c++) {
          cols.push([
            this.board[0][c],
            this.board[1][c],
            this.board[2][c],
            this.board[3][c],
          ]);
        }

        return cols;
      }
    };

    const setRows = (rows) => {
      if (direction === 'left' || direction === 'right') {
        this.board = rows;
      } else {
        for (let c = 0; c < 4; c++) {
          for (let r = 0; r < 4; r++) {
            this.board[r][c] = rows[c][r];
          }
        }
      }
    };

    const lines = getRows();
    const newLines = [];

    for (const line of lines) {
      let workingLine = [...line];
      let reversed = false;

      if (direction === 'right' || direction === 'down') {
        workingLine = workingLine.reverse();
        reversed = true;
      }

      const { row: resultRow, gain } = slideAndMergeRow(workingLine);

      scoreGain += gain;

      const finalRow = reversed ? resultRow.reverse() : resultRow;

      newLines.push(finalRow);
    }

    setRows(newLines);

    let changed = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] !== boardBefore[r][c]) {
          changed = true;
        }
      }
    }

    if (!changed) {
      return;
    }

    this.score += scoreGain;
    this.addRandomTile();

    if (this.board.some((row) => row.includes(2048))) {
      this.status = Game.Status.WIN;

      return;
    }

    if (!this.canMove()) {
      this.status = Game.Status.LOSE;
    }
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

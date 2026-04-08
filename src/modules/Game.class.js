'use strict';

class Game {
  constructor(initialState) {
    this.size = initialState?.[0]?.length ?? 4;
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState
      ? this.deepCopy(initialState)
      : this.getEmptyBoard();

    this.board = this.deepCopy(this.initialState);
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.deepCopy(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    return this.handleMove('left');
  }

  moveRight() {
    return this.handleMove('right');
  }

  moveUp() {
    return this.handleMove('up');
  }

  moveDown() {
    return this.handleMove('down');
  }

  handleMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const oldBoard = JSON.stringify(this.board);
    const iterations =
      direction === 'left' || direction === 'right'
        ? this.board.length
        : this.board[0].length;

    for (let i = 0; i < iterations; i++) {
      const line = this.getLine(i, direction);
      const { processedLine, lineScore } = this.slideAndMerge(line);

      this.setLine(i, direction, processedLine);
      this.score += lineScore;
    }

    const hasChanged = JSON.stringify(this.board) !== oldBoard;

    if (hasChanged) {
      this.addRandomTile();
    }

    this.checkStatus();

    return hasChanged;
  }

  slideAndMerge(line) {
    const filtered = line.filter((val) => val !== 0);
    let lineScore = 0;
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const newValue = filtered[i] * 2;

        result.push(newValue);
        lineScore += newValue;
        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < line.length) {
      result.push(0);
    }

    return { processedLine: result, lineScore };
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  checkStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const current = this.board[r][c];

        if (
          (c < this.size - 1 && current === this.board[r][c + 1]) ||
          (r < this.size - 1 && current === this.board[r + 1][c])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  getLine(index, direction) {
    const line = [];
    const rows = this.board.length;
    const cols = this.board[0].length;

    if (direction === 'left') {
      for (let i = 0; i < cols; i++) {
        line.push(this.board[index][i]);
      }
    } else if (direction === 'right') {
      for (let i = 0; i < cols; i++) {
        line.push(this.board[index][cols - 1 - i]);
      }
    } else if (direction === 'up') {
      for (let i = 0; i < rows; i++) {
        line.push(this.board[i][index]);
      }
    } else if (direction === 'down') {
      for (let i = 0; i < rows; i++) {
        line.push(this.board[rows - 1 - i][index]);
      }
    }

    return line;
  }

  setLine(index, direction, newLine) {
    const rows = this.board.length;
    const cols = this.board[0].length;

    if (direction === 'left') {
      for (let i = 0; i < newLine.length; i++) {
        this.board[index][i] = newLine[i];
      }
    } else if (direction === 'right') {
      for (let i = 0; i < newLine.length; i++) {
        this.board[index][cols - 1 - i] = newLine[i];
      }
    } else if (direction === 'up') {
      for (let i = 0; i < newLine.length; i++) {
        this.board[i][index] = newLine[i];
      }
    } else if (direction === 'down') {
      for (let i = 0; i < newLine.length; i++) {
        this.board[rows - 1 - i][index] = newLine[i];
      }
    }
  }

  getEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  isEmpty() {
    return this.board.flat().every((cell) => cell === 0);
  }

  deepCopy(state) {
    if (!state) {
      return this.getEmptyBoard();
    }

    return state.map((row) => [...row]);
  }
}

module.exports = Game;

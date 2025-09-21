'use strict';

export default class Game {
  static BOARD_SIZE = 4;
  static WIN_TILE = 2048;
  static STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(initialState) {
    this.state = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = Game.STATUS.idle;
  }

  createEmptyBoard() {
    return Array.from({ length: Game.BOARD_SIZE }, () => {
      return Array(Game.BOARD_SIZE).fill(0);
    });
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < Game.BOARD_SIZE; row++) {
      for (let col = 0; col < Game.BOARD_SIZE; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [randomRow, randomCol] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slideAndMerge(line) {
    const original = [...line];
    const filtered = line.filter((val) => val !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered.splice(i + 1, 1);
      }
    }

    while (filtered.length < Game.BOARD_SIZE) {
      filtered.push(0);
    }

    const moved = !filtered.every((val, idx) => val === original[idx]);

    return { newLine: filtered, moved };
  }

  getLine(index, direction) {
    if (direction === 'left' || direction === 'right') {
      return [...this.state[index]];
    } else {
      return this.state.map((row) => row[index]);
    }
  }

  setLine(index, newLine, direction, newBoard) {
    if (direction === 'left' || direction === 'right') {
      newBoard[index] = newLine;
    } else {
      for (let row = 0; row < Game.BOARD_SIZE; row++) {
        newBoard[row][index] = newLine[row];
      }
    }
  }

  performMove(direction) {
    let moved = false;
    const newBoard = this.state.map((row) => [...row]);
    const isReverse = direction === 'down' || direction === 'right';

    for (let i = 0; i < Game.BOARD_SIZE; i++) {
      const line = this.getLine(i, direction);

      if (isReverse) {
        line.reverse();
      }

      const { newLine, moved: lineMoved } = this.slideAndMerge(line);
      const finalLine = isReverse ? [...newLine].reverse() : newLine;

      this.setLine(i, finalLine, direction, newBoard);

      if (lineMoved) {
        moved = true;
      }
    }

    if (moved) {
      this.state = newBoard;
      this.addRandomTile();
    }

    this.checkWinOrLose();
  }

  checkWinOrLose() {
    for (let row = 0; row < Game.BOARD_SIZE; row++) {
      for (let col = 0; col < Game.BOARD_SIZE; col++) {
        if (this.state[row][col] === Game.WIN_TILE) {
          this.status = Game.STATUS.win;

          return;
        }
      }
    }

    for (let row = 0; row < Game.BOARD_SIZE; row++) {
      for (let col = 0; col < Game.BOARD_SIZE; col++) {
        if (this.state[row][col] === 0) {
          return;
        }
      }
    }

    for (let row = 0; row < Game.BOARD_SIZE; row++) {
      for (let col = 0; col < Game.BOARD_SIZE; col++) {
        const current = this.state[row][col];

        if (col < Game.BOARD_SIZE - 1 && current === this.state[row][col + 1]) {
          return;
        }

        if (row < Game.BOARD_SIZE - 1 && current === this.state[row + 1][col]) {
          return;
        }
      }
    }

    this.status = Game.STATUS.lose;
  }

  moveLeft() {
    if (this.status === Game.STATUS.playing) {
      this.performMove('left');
    }
  }
  moveRight() {
    if (this.status === Game.STATUS.playing) {
      this.performMove('right');
    }
  }
  moveUp() {
    if (this.status === Game.STATUS.playing) {
      this.performMove('up');
    }
  }
  moveDown() {
    if (this.status === Game.STATUS.playing) {
      this.performMove('down');
    }
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
    this.state = this.createEmptyBoard();
    this.score = 0;
    this.status = Game.STATUS.playing;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }
}

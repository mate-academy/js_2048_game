'use strict';

export const BOARD_SIZE = 4;

function filterZero(row) {
  return row.filter((num) => num !== 0);
}

const INITIAL_STATE = Array.from({ length: BOARD_SIZE }, () => {
  return Array(BOARD_SIZE).fill(0);
});

class Game {
  static Status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(initialState = INITIAL_STATE) {
    this.state = initialState.map((row) => [...row]);
    this.status = Game.Status.idle;
    this.initialState = initialState;
    this.score = 0;
  }

  transposeArray() {
    return this.state[0].map((col, i) => this.state.map((row) => row[i]));
  }

  mirrorArray() {
    return this.state.map((row) => row.reverse());
  }
  slide(row) {
    let updRow = filterZero(row);

    for (let i = 0; i < updRow.length - 1; i++) {
      if (updRow[i] === updRow[i + 1]) {
        updRow[i] *= 2;
        updRow[i + 1] = 0;
        this.score += updRow[i];
      }
    }
    updRow = filterZero(updRow);

    while (updRow.length < BOARD_SIZE) {
      updRow.push(0);
    }

    return updRow;
  }

  slideLeft() {
    let changed = false;
    let updatedCells = [];
    const oldCells = [];

    if (this.status === Game.Status.playing) {
      updatedCells = this.state.map((row) => {
        oldCells.push(Array.from(row));

        return this.slide(row);
      });
      changed = changed || updatedCells.join(',') !== oldCells.join(',');
    }

    if (changed) {
      this.getRandomCell(updatedCells);
    }

    return updatedCells;
  }

  move(direction) {
    switch (direction) {
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
      default:
        return;
    }

    this.checkGameStatus();
  }
  moveLeft() {
    this.state = this.slideLeft();

    return this.state;
  }

  moveRight() {
    this.state = this.mirrorArray();
    this.state = this.slideLeft();
    this.state = this.mirrorArray();

    return this.state;
  }

  moveUp() {
    this.state = this.transposeArray();
    this.state = this.slideLeft();
    this.state = this.transposeArray();

    return this.state;
  }

  moveDown() {
    this.state = this.transposeArray();
    this.state = this.mirrorArray();
    this.state = this.slideLeft();
    this.state = this.mirrorArray();
    this.state = this.transposeArray();

    return this.state;
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
    this.status = Game.Status.playing;
    this.getRandomCell(this.state, 2);
  }

  restart() {
    this.status = Game.Status.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  checkGameStatus() {
    this.state.forEach((group) => {
      if (group.includes(2048)) {
        this.status = Game.Status.win;
      }
    });

    // eslint-disable-next-line no-console
    console.log(
      'emptyCells:',
      this.checkEmptyCells(),
      'isMergeable:',
      this.checkIsMergeable(),
      'game.status:',
      this.status,
    );

    if (!this.checkEmptyCells && !this.checkIsMergeable) {
      this.status = Game.Status.lose;
    }
  }

  checkEmptyCells() {
    return this.state.some((group) => group.some((number) => number === 0));
  }

  checkIsMergeable() {
    const tmpArray = this.state.map((row) => {
      const tmpRow = filterZero(row);

      while (tmpRow.length < BOARD_SIZE) {
        tmpRow.push(0);
      }

      return tmpRow;
    });

    // eslint-disable-next-line no-console
    console.dir(tmpArray);

    for (let r = 0; r < BOARD_SIZE - 1; r++) {
      for (let c = 0; c < BOARD_SIZE - 1; c++) {
        const elm = tmpArray[r][c];

        if (
          elm !== 0 &&
          (elm === tmpArray[r + 1][c] || elm === tmpArray[r][c + 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  getRandomCell(array, cellCount = 1) {
    const emptyCells = [];

    for (let i = 0; i < cellCount; i++) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (array[r][c] === 0) {
            emptyCells.push([r, c]);
          }
        }
      }

      if (emptyCells.length > 0) {
        const [randomR, randomC] =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];

        array[randomR][randomC] = Math.random() < 0.9 ? 2 : 4;
      }
    }
  }
}

module.exports = Game;

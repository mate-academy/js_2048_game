'use strict';

function transposeArray(array) {
  return array[0].map((col, i) => array.map((row) => row[i]));
}

const ROW_MODIFIER_FUNC = {
  left: (row) => row,
  right: (row) => row.reverse(),
  up: (row) => row,
  down: (row) => row.reverse(),
};

const MATRIX_MODIFIER_FUNC = {
  left: (matrix) => matrix,
  right: (matrix) => matrix,
  up: transposeArray,
  down: transposeArray,
};

const INITIAL_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

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

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }
  slide(row, direction) {
    let updRow = this.filterZero(row);

    for (let i = 0; i < updRow.length - 1; i++) {
      if (updRow[i] === updRow[i + 1]) {
        updRow[i] *= 2;
        updRow[i + 1] = 0;
        this.score += updRow[i];
      }
    }
    updRow = this.filterZero(updRow);

    while (updRow.length < 4) {
      updRow.push(0);
    }

    return ROW_MODIFIER_FUNC[direction](updRow);
  }

  move(direction) {
    const rowMethod = ROW_MODIFIER_FUNC[direction];
    const matrixMethod = MATRIX_MODIFIER_FUNC[direction];

    if (this.status === Game.Status.playing) {
      const updatedCells = matrixMethod(this.state).map((row) => {
        return this.slide(rowMethod(row), direction);
      });

      this.state = matrixMethod(updatedCells);

      this.getRandomCells();
      this.checkGameStatus();
    }
  }

  moveUp() {
    if (this.status === Game.Status.playing) {
      const updatedCells = this.transposeArray(this.state).map((row) =>
        this.slide(row),
      );

      this.state = this.transposeArray(updatedCells);
      this.getRandomCells();
      this.checkGameStatus();
    }
  }
  moveDown() {
    if (this.status === Game.Status.playing) {
      const reversedSlide = (row) => this.slide(row.reverse()).reverse();

      const updatedCells = this.transposeArray(this.state).map(
        (row) => reversedSlide,
      );

      this.state = this.transposeArray(updatedCells);

      this.getRandomCells();
      this.checkGameStatus();
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
    this.status = Game.Status.playing;
    this.getRandomCells();
    this.getRandomCells();
  }

  restart() {
    this.status = Game.Status.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  getRandomCells() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [randomR, randomC] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomR][randomC] = Math.random() < 0.9 ? 2 : 4;
    }
  }
  checkGameStatus() {
    let isMovable = false;
    let hasEmptyCells = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 2048) {
          this.status = Game.Status.win;

          return;
        }

        if (this.state[r][c] === 0) {
          hasEmptyCells = true;
        }

        if (
          (r < 3 && this.state[r][c] === this.state[r + 1][c]) ||
          (c < 3 && this.state[r][c] === this.state[r][c + 1])
        ) {
          isMovable = true;
        }
      }
    }

    if (!isMovable && !hasEmptyCells) {
      this.status = Game.Status.lose;
    }
  }
}

module.exports = Game;

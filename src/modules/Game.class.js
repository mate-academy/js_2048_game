'use strict';

export const BOARD_SIZE = 4;

let isMovable = true;
let hasEmptyCells = true;
let isMergeable;

function transposeArray(array) {
  return array[0].map((col, i) => array.map((row) => row[i]));
}

function filterZero(row) {
  return row.filter((num) => num !== 0);
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

const INITIAL_STATE = Array.from(
  { length: BOARD_SIZE },
  Array(BOARD_SIZE).fill(0),
);
//   [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
// ];

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

  slide(row, direction) {
    let updRow = filterZero(row);
    this.checkMergeability(updRow);

    for (let i = 0; i < updRow.length - 1; i++) {
      if (updRow[i] === updRow[i + 1]) {
        updRow[i] *= 2;
        updRow[i + 1] = 0;
        this.score += updRow[i];
      }

      if (updRow[i + 1] === 0) {
        updRow[i + 1] = updRow[i];
        updRow[i] = 0;
      }
    }
    updRow = filterZero(updRow);

    while (updRow.length < BOARD_SIZE) {
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

      this.getRandomCell();
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
    this.getRandomCell(2);
  }

  restart() {
    this.status = Game.Status.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  getRandomCell(cellCount = 1) {
    const emptyCells = [];

    for (let i = 0; i < cellCount; i++) {
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
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
  }

  checkMergeability(row) {
    const mergeablesArray = [];

    row.forEach((elm, i) => {
      if (elm[i] === elm[i + 1]) {
        mergeablesArray.push(true);
      } else {
        mergeablesArray.push(false);
      }
    });
  }

  checkEmptyCells() {
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (this.state[r].includes(0)) {
        hasEmptyCells = true;
      } else {
        hasEmptyCells = false;
      }
    }
  }
  checkGameStatus() {
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (this.state[r][c] === 2048) {
          this.status = Game.Status.win;

          return;
        }
      }
    }

    if (!isMovable && !hasEmptyCells) {
      this.status = Game.Status.lose;
    }
  }
}

module.exports = Game;

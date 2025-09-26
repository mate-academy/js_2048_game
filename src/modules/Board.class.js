export * from './_utils.js';

const GRID_SIZE = 4;

export class Board {
  constructor() {
    this.startBtn = document.querySelector('.button'); // кнопка старт/рестарт
    this.counterInfo = document.querySelector('.game-score'); // поле рахунку
    this.score = +this.counterInfo.textContent; // рахунок
    this.cells = document.querySelectorAll('.field-cell'); // клітинки поля

    this.message = document.querySelector('.message-container');
    // контейнер повідомлень
    this.messages = Array.from(this.message.children);
    // всі повідомлення

    this.messageWin = document.querySelector('.message-win');
    this.messageLose = document.querySelector('.message-lose');
    this.messageStart = document.querySelector('.message-start');

    this.fieldMatrix = this.getMatrixCells();
    this.stateMatrix = this.getStateMatrix(this.fieldMatrix);
  }
  // повертає матрицю клітинок
  getMatrixCells() {
    const matrix = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      matrix[i] = [];

      for (let j = 0; j < GRID_SIZE; j++) {
        matrix[i][j] = this.cells[i * GRID_SIZE + j];
      }
    }

    return matrix;
  }

  // повертає матрицю стану гри
  getStateMatrix(matrix) {
    const state = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      state[i] = state[i] || [];

      for (let j = 0; j < GRID_SIZE; j++) {
        state[i][j] = +matrix[i][j].textContent || 0;
      }
    }

    return state;
  }
  // початковий стан гри
  startState() {
    this.stateMatrix = this.stateMatrix.map((row) => row.map(() => 0));

    const [i1, j1] = this.getRandomCell();
    let [i2, j2] = this.getRandomCell();

    while (i1 === i2 && j1 === j2) {
      [i2, j2] = this.getRandomCell();
    }

    this.placeRandomTile([i1, j1]);
    this.placeRandomTile([i2, j2]);

    this.renderField(this.stateMatrix);
  }
  // ставить 2 чи 4 в клітинку
  placeRandomTile([i, j]) {
    this.stateMatrix[i][j] = Math.random() < 0.9 ? 2 : 4;
  }
  // повертає випадкову клітинку
  getRandomCell() {
    const index = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE - 1));

    return [Math.floor(index / GRID_SIZE), index % GRID_SIZE];
  }
  // рендерить поле
  renderField(state) {
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const cell = this.fieldMatrix[i][j];
        const value = state[i][j];

        cell.textContent = value === 0 ? '' : value;
        cell.className = 'field-cell';

        if (value !== 0) {
          cell.classList.add(`field-cell--${value}`);
        }
      }
    }
  }
  commonMove(direction) {
    const oldState = this.stateMatrix.map((row) => [...row]);

    this.shiftAndMurgeNums(this.stateMatrix, direction, this.score);

    if (!this.isEqualMatricesAfterMove(oldState, this.stateMatrix)) {
      this.addRandom(this.stateMatrix);
    }
  }
  moveLeft() {
    this.commonMove('ArrowLeft');
    this.renderField(this.stateMatrix);
  }

  moveRight() {
    this.commonMove('ArrowRight');
    this.renderField(this.stateMatrix);
  }

  moveUp() {
    this.stateMatrix = this.transponMatrix(this.stateMatrix);
    this.commonMove('ArrowUp');
    this.stateMatrix = this.transponMatrix(this.stateMatrix);

    this.renderField(this.stateMatrix);
  }

  moveDown() {
    this.stateMatrix = this.transponMatrix(this.stateMatrix);
    this.commonMove('ArrowDown');
    this.stateMatrix = this.transponMatrix(this.stateMatrix);
    this.renderField(this.stateMatrix);
  }

  // додає 2 чи 4 в випадкову порожню клітинку
  addRandom(state) {
    const emptyCells = [];

    state.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push([i, j]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return state;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [_i, _j] = emptyCells[randomIndex];

    this.placeRandomTile([_i, _j]);

    return state;
  }

  // транспонує матрицю для руху вверх/вниз
  transponMatrix(state) {
    if (!state || state.length === 0) {
      return state;
    }

    return state[0].map((_, i) => state.map((row) => row[i]));
  }
  // зсуває і об'єднує числа в рядку
  shiftAndMurgeNums(state, direction, forScore = false) {
    for (let i = 0; i < state.length; i++) {
      let row = state[i];

      if (direction === 'ArrowLeft' || direction === 'ArrowUp') {
        row = this.slideAndMerge(row, 'left', forScore);
      } else {
        row = this.slideAndMerge(row, 'right', forScore);
      }

      state[i] = row;
    }
  }
  // об'єднує однакові плитки в рядку
  slideAndMerge(_row, direction, forScore) {
    const row = this.slide([..._row], direction);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        row[i] *= 2;

        if (!forScore) {
          this.score += row[i];
        }

        row[i + 1] = 0;
        i++;
      }
    }

    return this.slide(row, direction);
  }
  // зсуває числа в рядку вліво чи вправо в залежності від напрямку
  slide(row, direction) {
    const filtered = row.filter((n) => n !== 0);
    const zeros = Array(row.length - filtered.length).fill(0);

    return direction === 'left' || direction === 'up'
      ? [...filtered, ...zeros]
      : [...zeros, ...filtered];
  }
  // перевіряє чи однакові матриці після руху,
  // щоб не додавати нову плитку, якщо рух неможливий
  isEqualMatricesAfterMove(oldState, newState) {
    for (let i = 0; i < oldState.length; i++) {
      for (let j = 0; j < oldState[i].length; j++) {
        if (oldState[i][j] !== newState[i][j]) {
          return false;
        }
      }
    }

    return true;
  }
  // скидає всі повідомлення
  resetMessage() {
    for (const msg of this.messages) {
      msg.classList.add('hidden');
    }
  }
  isAnyMovePossible() {
    const directions = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    for (const direction of directions) {
      const tempState = this.stateMatrix.map((row) => [...row]);

      this.shiftAndMurgeNums(tempState, direction, true);

      if (!this.isEqualMatricesAfterMove(this.stateMatrix, tempState)) {
        return true;
      }
    }

    return false;
  }
}

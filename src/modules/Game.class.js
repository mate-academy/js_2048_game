/* eslint-disable comma-dangle */
/* eslint-disable function-paren-newline */
/* eslint-disable no-unused-expressions */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState, score) {
    // eslint-disable-next-line no-console

    this.activeNumbers = {};

    this.cellState = {};
    this.actualState = '';
    this.score = 0;
    this.moved = false;
    this.loseCheck = 0;

    for (let i = 1; i <= 16; i++) {
      this.cellState[`cell${i}`] = null;
    }
  }

  updateCell(cellId, value) {
    this.cellState[cellId] = value;

    const cellElement = document.querySelector(`.${cellId}`);
    const gameScore = document.querySelector('.game-score');

    const button = document.querySelector('.button');

    if (cellElement) {
      cellElement.textContent = value;
      gameScore.textContent = this.score;
    }

    if (button.classList.contains('hidden') && this.moved === true) {
      button.classList.remove('hidden');
      button.classList.add('restart');
    }

    for (let i = 1; i <= 16; i++) {
      const check2048 = document.querySelector(`.cell-${i}`);

      if (check2048.textContent === '2048') {
        this.getStatus('won');
      }
    }
  }

  moveLeft() {
    let boardChanged = false;

    this.moved = true;

    for (let row = 0; row < 4; row++) {
      const cells = [];

      for (let col = 1; col <= 4; col++) {
        const cellIndex = row * 4 + col;
        const cell = document.querySelector(`.cell-${cellIndex}`);

        cells.push(cell);
      }

      const originalValues = cells.map((cell) => cell.textContent.trim());
      const values = originalValues.filter((v) => v !== '').map(Number);

      for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          this.score += values[i];
          values.splice(i + 1, 1);
          break;
        }
      }

      for (let i = 0; i < 4; i++) {
        const newVal = values[i] ? values[i].toString() : '';

        if (cells[i].textContent !== newVal) {
          boardChanged = true;
        }
        cells[i].textContent = newVal;
      }
    }

    if (boardChanged) {
      const emptyCells = [];

      for (let i = 1; i <= 16; i++) {
        const cell = document.querySelector(`.cell-${i}`);

        if (cell.textContent === '') {
          emptyCells.push(cell);
        }
      }

      if (emptyCells.length > 0) {
        const randomCell =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cellClass = [...randomCell.classList].find((c) =>
          c.startsWith('cell-')
        );

        this.updateCell(cellClass, this.randomFour());
        this.getStatus('playing');
      } else {
        this.getStatus('lose');
      }

      this.getScore();
    }
  }

  moveRight() {
    let boardChanged = false;

    this.moved = true;

    for (let row = 0; row < 4; row++) {
      const cells = [];

      for (let col = 1; col <= 4; col++) {
        const cellIndex = row * 4 + col;
        const cell = document.querySelector(`.cell-${cellIndex}`);

        cells.push(cell);
      }

      const reversedCells = cells.slice().reverse();
      const originalValues = reversedCells.map((cell) =>
        cell.textContent.trim()
      );
      const values = originalValues.filter((v) => v !== '').map(Number);

      for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          this.score += values[i];
          values.splice(i + 1, 1);
          break;
        }
      }

      for (let i = 0; i < 4; i++) {
        const newVal = values[i] ? values[i].toString() : '';

        if (reversedCells[i].textContent !== newVal) {
          boardChanged = true;
        }
        reversedCells[i].textContent = newVal;
      }
    }

    if (boardChanged) {
      const emptyCells = [];

      for (let i = 1; i <= 16; i++) {
        const cell = document.querySelector(`.cell-${i}`);

        if (cell.textContent === '') {
          emptyCells.push(cell);
        }
      }

      if (emptyCells.length > 0) {
        const randomCell =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cellClass = [...randomCell.classList].find((c) =>
          c.startsWith('cell-')
        );

        this.updateCell(cellClass, this.randomFour());
        this.getStatus('playing');
      } else {
        this.getStatus('lose');
      }

      this.getScore();
    }
  }

  moveUp() {
    let boardChanged = false;

    this.moved = true;

    for (let col = 1; col <= 4; col++) {
      const cells = [];

      for (let row = 0; row < 4; row++) {
        const cellIndex = row * 4 + col;
        const cell = document.querySelector(`.cell-${cellIndex}`);

        cells.push(cell);
      }

      const originalValues = cells.map((cell) => cell.textContent.trim());
      const values = originalValues.filter((v) => v !== '').map(Number);

      for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          this.score += values[i];
          values.splice(i + 1, 1);
          break;
        }
      }

      for (let i = 0; i < 4; i++) {
        const newVal = values[i] ? values[i].toString() : '';

        if (cells[i].textContent !== newVal) {
          boardChanged = true;
        }
        cells[i].textContent = newVal;
      }
    }

    if (boardChanged) {
      const emptyCells = [];

      for (let i = 1; i <= 16; i++) {
        const cell = document.querySelector(`.cell-${i}`);

        if (cell.textContent === '') {
          emptyCells.push(cell);
        }
      }

      if (emptyCells.length > 0) {
        const randomCell =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cellClass = [...randomCell.classList].find((c) =>
          c.startsWith('cell-')
        );

        this.updateCell(cellClass, this.randomFour());
        this.getStatus('playing');
      }

      this.getScore();
    }
  }

  moveDown() {
    let boardChanged = false;

    this.moved = true;

    for (let col = 1; col <= 4; col++) {
      const cells = [];

      for (let row = 0; row < 4; row++) {
        const cellIndex = row * 4 + col;
        const cell = document.querySelector(`.cell-${cellIndex}`);

        cells.push(cell);
      }

      const reversedCells = cells.slice().reverse();
      const originalValues = reversedCells.map((cell) =>
        cell.textContent.trim()
      );
      const values = originalValues.filter((v) => v !== '').map(Number);

      for (let i = 0; i < values.length - 1; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          this.score += values[i];
          values.splice(i + 1, 1);
          break;
        }
      }

      for (let i = 0; i < 4; i++) {
        const newVal = values[i] ? values[i].toString() : '';

        if (reversedCells[i].textContent !== newVal) {
          boardChanged = true;
        }
        reversedCells[i].textContent = newVal;
      }
    }

    if (boardChanged) {
      const emptyCells = [];

      for (let i = 1; i <= 16; i++) {
        const cell = document.querySelector(`.cell-${i}`);

        if (cell.textContent === '') {
          emptyCells.push(cell);
        }
      }

      if (emptyCells.length > 0) {
        const randomCell =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const cellClass = [...randomCell.classList].find((c) =>
          c.startsWith('cell-')
        );

        this.updateCell(cellClass, this.randomFour());
        this.getStatus('playing');
      }

      this.getScore();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const board = [];

    for (let row = 0; row < 4; row++) {
      const rowArray = [];

      for (let col = 1; col <= 4; col++) {
        const cellIndex = row * 4 + col;
        const cell = document.querySelector(`.cell-${cellIndex}`);
        const value = cell.textContent.trim();

        rowArray.push(value === '' ? 0 : Number(value));
      }
      board.push(rowArray);
    }

    return board; // 2D array: [[0, 2, 0, 4], [4, 0, 0, 0], ...]
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus(stat) {
    if (status === 'playing') {
      return 'Playing...';
    }

    if (status === 'lose') {
      const directions = ['Up', 'Down', 'Left', 'Right'];
      const originalState = this.getState(); // 2D array of current board

      for (const dir of directions) {
        const simulated = this.simulateMove(dir, originalState);

        if (!this.boardsAreEqual(simulated, originalState)) {
          return; // Move is still possible, don't show loss message
        }
      }

      // No moves left — show loss
      document.querySelector('.message-lose')?.classList.remove('hidden');

      return 'Game Over!';
    }

    if (stat === 'won') {
      document.querySelector('.message-win').classList.remove('hidden');
    }
  }

  /**
   * Starts the game.
   */
  start() {
    let randomCell, randomCellTwo;

    // 10% Chance of being a 4

    const button = document.querySelector('.button');

    button.textContent = 'Restart';
    button.classList.add('hidden');
    button.classList.remove('start');

    do {
      randomCell = `cell-${Math.floor(Math.random() * 16) + 1}`;
    } while (document.querySelector(`.${randomCell}`).textContent !== '');

    do {
      randomCellTwo = `cell-${Math.floor(Math.random() * 16) + 1}`;
    } while (
      document.querySelector(`.${randomCellTwo}`).textContent !== '' ||
      randomCellTwo === randomCell
    );

    this.updateCell(randomCell, this.randomFour());
    this.updateCell(randomCellTwo, this.randomFour());
  }

  /**
   * Resets the game.
   */
  restart() {
    let randomCell, randomCellTwo;

    this.score = 0;

    for (let i = 1; i <= 16; i++) {
      const clearBoard = document.querySelector(`.cell-${i}`);

      clearBoard.textContent = '';
    }

    do {
      randomCell = `cell-${Math.floor(Math.random() * 16) + 1}`;
    } while (document.querySelector(`.${randomCell}`).textContent !== '');

    do {
      randomCellTwo = `cell-${Math.floor(Math.random() * 16) + 1}`;
    } while (
      document.querySelector(`.${randomCellTwo}`).textContent !== '' ||
      randomCellTwo === randomCell
    );

    this.updateCell(randomCell, this.randomFour());
    this.updateCell(randomCellTwo, this.randomFour());
  }

  // Add your own methods here

  simulateMove(direction) {
    // Read board from DOM
    const board = [];

    for (let i = 1; i <= 16; i++) {
      const cell = document.querySelector(`.cell-${i}`);

      board.push(cell.textContent === '' ? 0 : Number(cell.textContent));
    }

    const simulate = (lines) => {
      for (const line of lines) {
        const values = line.map((i) => board[i]).filter((v) => v !== 0);

        for (let i = 0; i < values.length - 1; i++) {
          if (values[i] === values[i + 1]) {
            values[i] *= 2;
            this.score += values[i];
            values.splice(i + 1, 1);
          }
        }

        while (values.length < 4) {
          values.push(0);
        }

        for (let i = 0; i < 4; i++) {
          if (board[line[i]] !== values[i]) {
            return true;
          }
        }
      }

      return false;
    };

    const rows = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15]
    ];

    const cols = [
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15]
    ];

    switch (direction) {
      case 'left':
        return simulate(rows);
      case 'right':
        return simulate(rows.map((r) => [...r].reverse()));
      case 'up':
        return simulate(cols);
      case 'down':
        return simulate(cols.map((c) => [...c].reverse()));
    }

    return false;
  }

  randomFour() {
    const sortCell = Math.floor(Math.random() * 10) + 1;

    if (sortCell === 10) {
      return 4;
    } else {
      return 2;
    }
  }
}

// module.exports = Game;

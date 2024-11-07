'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
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
  constructor(initialState) {
    // eslint-disable-next-line no-console
    const cell = document.querySelectorAll('.field-cell');

    const firstNumber = Math.floor(Math.random() * 16);
    let secondNumber;

    do {
      secondNumber = Math.floor(Math.random() * 16);
    } while (secondNumber === firstNumber);

    this.createRandomNumbers(cell[firstNumber]);
    this.createRandomNumbers(cell[secondNumber]);
    this.boundMoveLeftListener = this.moveLeftEventListener.bind(this);
    this.boundMoveRightListener = this.moveRightEventListener.bind(this);
    this.boundMoveUpListener = this.moveUpEventListener.bind(this);
    this.boundMoveDownListener = this.moveDownEventListener.bind(this);
  }

  createRandomNumbers(cell) {
    const randomNumber = Math.floor(Math.random() * 11);

    if (randomNumber <= 1) {
      cell.textContent = '4';
    } else {
      cell.textContent = '2';
    }
  }

  moveZerosToEnd(arr) {
    let nonZeroElements = arr.filter((num) => num !== 0);

    for (let i = 1; i < nonZeroElements.length; i++) {

      if (nonZeroElements[i] === nonZeroElements[i - 1]) {
        nonZeroElements[i - 1] *= 2;

        if (nonZeroElements[i - 1] === 2048) {
          this.gameWin();
        }

        nonZeroElements[i] = 0;
        this.getScore(nonZeroElements[i - 1]);
        i--;
      }
    }

    nonZeroElements = nonZeroElements.filter((num) => num !== 0);

    const zeroCount = arr.length - nonZeroElements.length;

    return [...nonZeroElements, ...Array(zeroCount).fill(0)];
  }

  moveZerosToStart(arr) {
    let nonZeroElements = arr.filter((num) => num !== 0);

    for (let i = 1; i < nonZeroElements.length; i++) {

      if (nonZeroElements[i] === nonZeroElements[i - 1]) {
        nonZeroElements[i - 1] *= 2;

        if (nonZeroElements[i - 1] === 2048) {
          this.gameWin();
        }

        nonZeroElements[i] = 0;
        this.getScore(nonZeroElements[i - 1]);
        i--;
      }
    }

    nonZeroElements = nonZeroElements.filter((num) => num !== 0);

    const zeroCount = arr.length - nonZeroElements.length;

    return [...Array(zeroCount).fill(0), ...nonZeroElements];
  }

  moveLeftEventListener(e) {
    if (e.key === 'ArrowLeft') {
      const rows = document.querySelectorAll('.field-row');

      rows.forEach((rowElement) => {
        const cells = [...rowElement.querySelectorAll('td')];
        const cellValues = cells.map((cell) => parseInt(cell.textContent) || 0);

        const result = this.moveZerosToEnd(cellValues);

        rowElement.innerHTML = '';

        result.forEach((value, index) => {
          const cell = cells[index];

          cell.textContent = value === 0 ? '' : value;

          rowElement.appendChild(cell);
        });
      });

      this.addCell();
    }
  }

  moveLeft() {
    window.addEventListener('keydown', this.boundMoveLeftListener);
  }

  moveRightEventListener(e) {
    if (e.key === 'ArrowRight') {
      const rows = document.querySelectorAll('.field-row');

      rows.forEach((rowElement) => {
        const cells = [...rowElement.querySelectorAll('td')];
        const cellValues = cells.map((cell) => parseInt(cell.textContent) || 0);

        const result = this.moveZerosToStart(cellValues);

        rowElement.innerHTML = '';

        result.forEach((value, index) => {
          const cell = cells[index];

          cell.textContent = value === 0 ? '' : value;
          rowElement.appendChild(cell);
        });
      });

      this.addCell();
    }
  }
  moveRight() {
    window.addEventListener('keydown', this.boundMoveRightListener);
  }

  moveUpEventListener(e) {
    if (e.key === 'ArrowUp') {
      const rows = document.querySelectorAll('.field-row');
      const columnNodes = [[], [], [], []];

      rows.forEach((row) => {

        for (let i = 0; i < 4; i++) {
          const cells = row.querySelector(`td:nth-child(${i + 1})`);

          if (cells) {
            columnNodes[i].push(cells);
          }
        }
      });

      columnNodes.forEach((columnElement) => {
        const cellValues = columnElement.map(
          (cell) => parseInt(cell.textContent) || 0,
        );
        const result = this.moveZerosToEnd(cellValues);

        result.forEach((value, index) => {
          columnElement[index].textContent = value === 0 ? '' : value;

        });

      });

      this.addCell();
    }
  }

  moveUp() {
    window.addEventListener('keydown', this.boundMoveUpListener);
  }

  moveDownEventListener(e) {
    if (e.key === 'ArrowDown') {
      const rows = document.querySelectorAll('.field-row');
      const columnNodes = [[], [], [], []];

      rows.forEach((row) => {

        for (let i = 0; i < 4; i++) {
          const cells = row.querySelector(`td:nth-child(${i + 1})`);

          if (cells) {
            columnNodes[i].push(cells);
          }
        }
      });

      columnNodes.forEach((columnElement) => {
        const cellValues = columnElement.map(
          (cell) => parseInt(cell.textContent) || 0,
        );
        const result = this.moveZerosToStart(cellValues);

        result.forEach((value, index) => {
          columnElement[index].textContent = value === 0 ? '' : value;
        });
      });
      this.addCell();
    }
  }

  moveDown() {
    window.addEventListener('keydown', this.boundMoveDownListener);
  }

  /**
   * @returns {number}
   */
  getScore(number) {
    const scorecount = document.querySelector('.game-score');
    const score = parseInt(scorecount.textContent) || 0;

    scorecount.textContent = score + number;
  }

  /**
   * @returns {number[][]}
   */
  getState() {}

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    const startButton = document.querySelector('.start');

    startButton.addEventListener('click', () => {

      startButton.textContent = 'restart';

      startButton.classList.remove('start');
      startButton.classList.add('restart');

      this.moveLeft();
      this.moveRight();
      this.moveUp();
      this.moveDown();
      this.restart();
    });
  }

  /**
   * Resets the game.
   */
  restart() {
    const restartButton = document.querySelector('.restart');

    restartButton.addEventListener('click', () => {
      const cells = document.querySelectorAll('.field-cell');

      cells.forEach((cell) => {
        cell.textContent = '';
      });
      this.addCell();
      this.addCell();

      const scorecount = document.querySelector('.game-score');

      scorecount.textContent = 0;

      const messageGameOver = document.querySelector('.message-lose');
      const messageGameWin = document.querySelector('.message-win');

      messageGameOver.classList.add('hidden');
      messageGameWin.classList.add('hidden');
    });
  }

  checkBeforeGameOver() {
    const rows = document.querySelectorAll('.field-row');
    const columnNodes = [[], [], [], []];

    rows.forEach((row) => {
      for (let i = 0; i < 4; i++) {
        const cell = row.querySelector(`td:nth-child(${i + 1})`);

        if (cell) {
          columnNodes[i].push(cell);
        }
      }
    });

    for (const rowElement of rows) {
      const cells = [...rowElement.querySelectorAll('td')];
      const cellValues = cells.map((cell) => parseInt(cell.textContent) || 0);

      for (let i = 0; i < cellValues.length - 1; i++) {
        if (cellValues[i] === 0 || cellValues[i] === cellValues[i + 1]) {
          return false;
        }
      }
    }

    for (const columnElement of columnNodes) {
      const cellValues = columnElement.map(
        (cell) => parseInt(cell.textContent) || 0,
      );

      for (let i = 0; i < cellValues.length - 1; i++) {
        if (cellValues[i] === 0 || cellValues[i] === cellValues[i + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  gameWin () {
    let winMessage = document.querySelector('.message-win');

    winMessage.classList.remove('hidden');

    window.removeEventListener('keydown', this.boundMoveUpListener);
    window.removeEventListener('keydown', this.boundMoveDownListener);
    window.removeEventListener('keydown', this.boundMoveLeftListener);
    window.removeEventListener('keydown', this.boundMoveRightListener);
  }
  gameOver() {
    if (this.checkBeforeGameOver()) {
      let overMessage = document.querySelector('.message-lose');

      overMessage.classList.remove('hidden');

      window.removeEventListener('keydown', this.boundMoveUpListener);
      window.removeEventListener('keydown', this.boundMoveDownListener);
      window.removeEventListener('keydown', this.boundMoveLeftListener);
      window.removeEventListener('keydown', this.boundMoveRightListener);
    }
  }

  addCell() {
    const gameCells = document.querySelectorAll('.field-cell');

    const result = [...gameCells].filter((cell, index) => {
      if (cell.textContent.length === 0) {
        return index;
      } else {
      }
    });

    if (result.length === 0) {
      this.gameOver();

      return;
    }

    const randomCell = Math.floor(Math.random() * result.length);

    this.createRandomNumbers(result[randomCell]);
  }
}

module.exports = Game;

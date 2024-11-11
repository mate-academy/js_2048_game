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
  areArraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((value, index) => value === arr2[index]);
  }

  createRandomNumbers(cell) {
    const randomNumber = Math.floor(Math.random() * 11);

    if (randomNumber <= 1) {
      cell.textContent = '4';
      cell.className = `field-cell cell-${cell.textContent}`;
    } else {
      cell.textContent = '2';
      cell.className = `field-cell cell-${cell.textContent}`;
    }
  }

  initiateGame() {
    const cell = document.querySelectorAll('.field-cell');

    const firstNumber = Math.floor(Math.random() * 16);
    let secondNumber;

    do {
      secondNumber = Math.floor(Math.random() * 16);
    } while (secondNumber === firstNumber);

    this.createRandomNumbers(cell[firstNumber]);
    this.createRandomNumbers(cell[secondNumber]);
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

  getScore(points) {
    const scorecount = document.querySelector('.game-score');

    let score = +scorecount.textContent;

    score += points;
    scorecount.textContent = score;
  }

  moveLeftEventListener(e) {
    if (e.key === 'ArrowLeft') {
      const rows = document.querySelectorAll('.field-row');
      const previousState = [...document.querySelectorAll('.field-cell')].map(
        (cell) => parseInt(cell.textContent) || 0,
      );

      rows.forEach((rowElement) => {
        const cells = [...rowElement.querySelectorAll('td')];
        const cellValues = cells.map((cell) => parseInt(cell.textContent) || 0);

        const result = this.moveZerosToEnd(cellValues);

        rowElement.innerHTML = '';

        result.forEach((value, index) => {
          const cell = cells[index];

          if (value === 0) {
            cell.textContent = '';
            cell.className = 'field-cell';
          } else {
            cell.textContent = value;
            cell.className = `field-cell cell-${value}`;
          }

          rowElement.appendChild(cell);
        });
      });

      const newState = [...document.querySelectorAll('.field-cell')].map(
        (cell) => parseInt(cell.textContent) || 0,
      );

      if (this.areArraysEqual(previousState, newState)) {
        this.gameOver();
      } else {
        this.addCell();
      }
    }
  }

  moveLeft() {
    window.addEventListener('keydown', this.boundMoveLeftListener);
  }

  moveRightEventListener(e) {
    if (e.key === 'ArrowRight') {
      const rows = document.querySelectorAll('.field-row');
      const previousState = [...document.querySelectorAll('.field-cell')].map(
        (cell) => parseInt(cell.textContent) || 0,
      );

      rows.forEach((rowElement) => {
        const cells = [...rowElement.querySelectorAll('td')];
        const cellValues = cells.map((cell) => parseInt(cell.textContent) || 0);

        const result = this.moveZerosToStart(cellValues);

        rowElement.innerHTML = '';

        result.forEach((value, index) => {
          const cell = cells[index];

          if (value === 0) {
            cell.textContent = '';
            cell.className = 'field-cell';
          } else {
            cell.textContent = value;
            cell.className = `field-cell cell-${value}`;
          }

          rowElement.appendChild(cell);
        });
      });

      const newState = [...document.querySelectorAll('.field-cell')].map(
        (cell) => parseInt(cell.textContent) || 0,
      );

      if (this.areArraysEqual(previousState, newState)) {
        this.gameOver();
      } else {
        this.addCell();
      }
    }
  }

  moveRight() {
    window.addEventListener('keydown', this.boundMoveRightListener);
  }

  moveUpEventListener(e) {
    if (e.key === 'ArrowUp') {
      const rows = document.querySelectorAll('.field-row');
      const columnNodes = [[], [], [], []];
      const previousState = [...document.querySelectorAll('.field-cell')].map(
        (cell) => parseInt(cell.textContent) || 0,
      );

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
          if (value === 0) {
            columnElement[index].textContent = '';
            columnElement[index].className = 'field-cell';
          } else {
            columnElement[index].textContent = value;
            columnElement[index].className = `field-cell cell-${value}`;
          }
        });
      });

      const newState = [...document.querySelectorAll('.field-cell')].map(
        (cell) => parseInt(cell.textContent) || 0,
      );

      if (this.areArraysEqual(previousState, newState)) {
        this.gameOver();
      } else {
        this.addCell();
      }
    }
  }

  moveUp() {
    window.addEventListener('keydown', this.boundMoveUpListener);
  }

  moveDownEventListener(e) {
    if (e.key === 'ArrowDown') {
      const rows = document.querySelectorAll('.field-row');
      const columnNodes = [[], [], [], []];
      const previousState = [...document.querySelectorAll('.field-cell')].map(
        (cell) => parseInt(cell.textContent) || 0,
      );

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
          if (value === 0) {
            columnElement[index].textContent = '';
            columnElement[index].className = 'field-cell';
          } else {
            columnElement[index].textContent = value;
            columnElement[index].className = `field-cell cell-${value}`;
          }
        });
      });

      const newState = [...document.querySelectorAll('.field-cell')].map(
        (cell) => parseInt(cell.textContent) || 0,
      );

      if (this.areArraysEqual(previousState, newState)) {
        this.gameOver();
      } else {
        this.addCell();
      }
    }
  }

  moveDown() {
    window.addEventListener('keydown', this.boundMoveDownListener);
  }

  /**
   * @returns {number}
   */
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

  startFunction() {
    const startButton = document.querySelector('.start');
    const startMessage = document.querySelector('.message-start');

    if (startButton) {
      startButton.textContent = 'Restart';
      startButton.classList.remove('start');
      startButton.classList.add('restart');
    } else {
      return;
    }

    if (startMessage) {
      startMessage.classList.add('hidden');
    } else {
      return;
    }

    this.boundMoveLeftListener = this.moveLeftEventListener.bind(this);
    this.boundMoveRightListener = this.moveRightEventListener.bind(this);
    this.boundMoveUpListener = this.moveUpEventListener.bind(this);
    this.boundMoveDownListener = this.moveDownEventListener.bind(this);

    this.moveLeft();
    this.moveRight();
    this.moveUp();
    this.moveDown();
    this.restart();
    this.initiateGame();
  }

  start() {
    const startButton = document.querySelector('.start');

    if (!startButton) {
      startButton.removeEventListener('click', this.startFunction.bind(this));
    } else {
      startButton.addEventListener('click', this.startFunction.bind(this));
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    const restartButton = document.querySelector('.restart');

    if (!restartButton) {
      return;
    }

    restartButton.addEventListener('click', () => {
      const scorecount = document.querySelector('.game-score');
      const cells = document.querySelectorAll('.field-cell');

      const cellsArray = [...cells].map(
        (cell) => parseInt(cell.textContent) || 0,
      );
      const nonEmptyCells = cellsArray.filter((content) => content !== 0);

      if (nonEmptyCells.length === 2 && scorecount.textContent === '0') {
      } else {
        cells.forEach((cell) => {
          cell.textContent = '';
          cell.className = 'field-cell';
        });

        this.addCell();
        this.addCell();

        scorecount.textContent = 0;

        const messageGameOver = document.querySelector('.message-lose');
        const messageGameWin = document.querySelector('.message-win');

        messageGameOver.classList.add('hidden');
        messageGameWin.classList.add('hidden');
      }
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

  gameWin() {
    const winMessage = document.querySelector('.message-win');

    winMessage.classList.remove('hidden');

    window.removeEventListener('keydown', this.boundMoveUpListener);
    window.removeEventListener('keydown', this.boundMoveDownListener);
    window.removeEventListener('keydown', this.boundMoveLeftListener);
    window.removeEventListener('keydown', this.boundMoveRightListener);
  }
  gameOver() {
    if (this.checkBeforeGameOver()) {
      const overMessage = document.querySelector('.message-lose');

      overMessage.classList.remove('hidden');

      window.removeEventListener('keydown', this.boundMoveUpListener);
      window.removeEventListener('keydown', this.boundMoveDownListener);
      window.removeEventListener('keydown', this.boundMoveLeftListener);
      window.removeEventListener('keydown', this.boundMoveRightListener);
    }
  }

  addCell() {
    const gameCells = document.querySelectorAll('.field-cell');

    const emptyCells = [...gameCells].filter(
      (cell) => cell.textContent.length === 0,
    );

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    this.createRandomNumbers(emptyCells[randomIndex]);
  }
}

module.exports = Game;

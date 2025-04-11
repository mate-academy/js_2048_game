/* eslint-disable no-shadow */
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
   * The initial state of the board.er
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
    console.log(initialState);

    this.cells = [...document.querySelectorAll('.field-cell')];
    this.score = 0;
    this.scoreHTML = document.querySelector('.game-score');
    this.status = 'idle';
    this.state = initialState;
    this.button = document.querySelector('button');
    this.messageLose = document.querySelector('.message-lose');
    this.messageWin = document.querySelector('.message-win');
    this.messageStart = document.querySelector('.message-start');
    this.notMoved = false;

    this.touchStartObj = {
      x: 0,
      y: 0,
    };

    this.touchEndObj = {
      x: 0,
      y: 0,
    };

    this.disableLeft = false;
    this.disableRight = false;
    this.disableUp = false;
    this.disableDown = false;
  }

  moveLeft() {
    if (this.disableLeft) {
      return;
    }

    this.makeMove('left');
  }

  moveRight() {
    if (this.disableRight) {
      return;
    }

    this.makeMove('right');
  }

  moveUp() {
    if (this.disableUp) {
      return;
    }

    this.makeMove('up');
  }

  moveDown() {
    if (this.disableDown) {
      return;
    }

    this.makeMove('down');
  }

  /**
   * @returns {number}
   */
  getScore(value) {
    this.score += value;
    this.scoreHTML.innerText = this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
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
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    const button = this.button;

    // console
    button.setAttribute('tabindex', '-1');
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';

    this.messageStart.classList.add('hidden');
    this.status = 'playing';

    this.spawnCell();
    this.spawnCell();

    this.drowCells();
  }

  /**
   * Resets the game.
   */
  restart() {
    const button = this.button;

    button.removeAttribute('tabindex');
    button.classList.replace('restart', 'start');
    button.innerText = 'Start';

    this.messageStart.classList.remove('hidden');
    this.messageLose.classList.add('hidden');
    this.messageWin.classList.add('hidden');
    this.status = 'idle';

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.cells.forEach((cell) => {
      cell.innerText = '';
      cell.className = 'field-cell';
    });
    this.emptyCells = this.cells;
    this.score = 0;
    this.scoreHTML.innerText = 0;
  }

  buttonClick() {
    const button = this.button;

    if (button.classList.contains('start')) {
      this.start();
    } else if (button.classList.contains('restart')) {
      this.restart();
    }
  }

  gameLose() {
    this.status = 'lose';
    this.messageLose.classList.remove('hidden');
  }

  gameWin() {
    this.status = 'lose';
    this.messageWin.classList.remove('hidden');

    this.disableLeft = true;
    this.disableRight = true;
    this.disableUp = true;
    this.disableDown = true;
  }

  makeMove(direction) {
    this.calculateStep(direction, this.state);
    this.spawnCell();
    this.drowCells();
    this.checkMoves();
  }

  calculateStep(direction, array) {
    const oldArray = JSON.parse(JSON.stringify(array));

    switch (direction) {
      case 'left':
        for (let row = 0; row < 4; row++) {
          const rowArr = [];

          for (let col = 0; col < 4; col++) {
            rowArr.push(array[row][col]);
          }

          const newArr = this.step(rowArr, array);

          for (let col = 3; col >= 0; col--) {
            array[row][col] = newArr[col];
          }
        }

        this.notMoved = this.compareArrays(oldArray, array);
        break;
      case 'right':
        for (let row = 0; row < 4; row++) {
          const rowArr = [];

          for (let col = 3; col >= 0; col--) {
            rowArr.push(array[row][col]);
          }

          const newArr = this.step(rowArr, array).reverse();

          for (let col = 3; col >= 0; col--) {
            array[row][col] = newArr[col];
          }
        }

        this.notMoved = this.compareArrays(oldArray, array);
        break;
      case 'up':
        for (let col = 0; col < 4; col++) {
          const colArr = [];

          for (let row = 0; row < 4; row++) {
            colArr.push(array[row][col]);
          }

          const newArr = this.step(colArr, array);

          for (let row = 0; row < 4; row++) {
            array[row][col] = newArr[row];
          }
        }

        this.notMoved = this.compareArrays(oldArray, array);
        break;
      case 'down':
        for (let col = 0; col < 4; col++) {
          const colArr = [];

          for (let row = 3; row >= 0; row--) {
            colArr.push(array[row][col]);
          }

          const newArr = this.step(colArr, array).reverse();

          for (let row = 0; row < 4; row++) {
            array[row][col] = newArr[row];
          }
        }

        this.notMoved = this.compareArrays(oldArray, array);
        break;
    }
  }

  compareArrays(a, b) {
    return a.toString() === b.toString();
  }

  step(arr, originArr) {
    const newArr = [...arr];

    for (let i = 0; i < newArr.length; i++) {
      for (let j = i + 1; j < newArr.length; j++) {
        if (newArr[j] === 0) {
          continue;
        } else if (newArr[i] === 0) {
          newArr[i] = newArr[j];
          newArr[j] = 0;
        } else if (newArr[j] === newArr[i]) {
          newArr[i] *= 2;
          newArr[j] = 0;

          if (originArr === this.state) {
            this.getScore(newArr[i]);

            if (newArr[i] === 2048) {
              this.status = 'win';
              this.gameWin();
            }
          }

          break;
        } else if (newArr[j] > newArr[i] || newArr[j] < newArr[i]) {
          break;
        }
      }
    }

    return newArr;
  }

  spawnCell() {
    const emptyCells = this.state.reduce((newArr, value, row) => {
      value
        .map((cell, i) => ({ value: cell, i }))
        .filter((cell) => !cell.value)
        .map((cell) => cell.i)
        .forEach((i) => newArr.push([i, row]));

      return newArr;
    }, []);

    // If less than 10% - returns 4, otherwise - 2
    const cellValue = Math.random() * 100 > 10 ? 2 : 4;
    const randCellIndex = Math.floor(Math.random() * (emptyCells.length - 1));
    const randEmptyCell = emptyCells[randCellIndex];

    this.state[randEmptyCell[1]][randEmptyCell[0]] = cellValue;
  }

  drowCells() {
    this.cells.forEach((cell, i) => {
      if (this.state.flat()[i] === 0) {
        cell.className = 'field-cell';
        cell.innerText = '';
      } else {
        cell.innerText = this.state.flat()[i];
        cell.className = 'field-cell' + ' field-cell--' + cell.innerText;
      }
    });
  }

  checkMoves() {
    this.disableLeft = false;
    this.disableRight = false;
    this.disableUp = false;
    this.disableDown = false;

    const imposibleToMove = {
      left: true,
      right: true,
      up: true,
      down: true,
    };

    for (const direction in imposibleToMove) {
      this.calculateStep(direction, JSON.parse(JSON.stringify(this.state)));

      imposibleToMove[direction] = this.notMoved;

      if (imposibleToMove[direction]) {
        // eslint-disable-next-line prettier/prettier, max-len
        this['disable' + direction[0].toUpperCase() + direction.slice(1)] =
          true;
      }

      this.notMoved = true;
    }

    if (
      imposibleToMove.left &&
      imposibleToMove.right &&
      imposibleToMove.up &&
      imposibleToMove.down
    ) {
      this.gameLose();
    }
  }

  touchStart(event) {
    if (this.status !== 'playing') {
      return;
    }

    this.touchStartObj = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  touchEnd(event) {
    if (this.status !== 'playing') {
      return;
    }

    this.touchEndObj = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };

    this.calculateSwipe();
  }

  calculateSwipe() {
    const x = this.touchStartObj.x - this.touchEndObj.x;
    const y = this.touchStartObj.y - this.touchEndObj.y;

    if (Math.abs(x) > Math.abs(y) && Math.abs(x) > 100) {
      if (x > 0) {
        this.moveLeft();
      } else {
        this.moveRight();
      }
    } else if (Math.abs(x) < Math.abs(y) && Math.abs(y) > 100) {
      if (y > 0) {
        this.moveUp();
      } else {
        this.moveDown();
      }
    }
  }
}

module.exports = Game;

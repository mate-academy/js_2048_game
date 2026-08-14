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
  //  * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    this.numbers = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
    this.score = 0;
    this.cells = [];
    this.rows = [...document.querySelectorAll('.field-row')];

    for (const cell of this.rows) {
      this.cells.push([...cell.children]);
    }
  }

  moveForwardNumbers(dir) {
    if (dir === 'down' || dir === 'right') {
      const previousState = JSON.stringify(this.numbers);

      for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; ) {
          const direction = this.setDirection(dir, i, j);

          // merge
          if (this.merge(direction)) {
            j--;
            continue;
          }

          // swap
          if (this.swap(direction)) {
            if (j < 2) {
              j++;
            }
          } else {
            j--;
          }
        }
      }

      const isMove = JSON.stringify(this.numbers) !== previousState;

      if (isMove) {
        this.createCell();
      }
      this.checkStatus();
      this.setViewNumbers();
    }
  }

  moveBackNumbers(dir) {
    if (dir === 'up' || dir === 'left') {
      const previousState = JSON.stringify(this.numbers);

      for (let i = 0; i < 4; i++) {
        for (let j = 1; j <= 3; ) {
          const direction = this.setDirection(dir, i, j);

          // merge
          if (this.merge(direction)) {
            j++;
            // isMove = true;
            continue;
          }

          // swap
          if (this.swap(direction)) {
            // isMove = true;
            if (j > 1) {
              j--;
            }
          } else {
            j++;
          }
        }
      }

      const isMove = JSON.stringify(this.numbers) !== previousState;

      if (isMove) {
        this.createCell();
      }
      this.checkStatus();
      this.setViewNumbers();
    }
  }

  moveLeft() {
    this.moveBackNumbers('left');
  }

  moveRight() {
    this.moveForwardNumbers('right');
  }

  moveUp() {
    this.moveBackNumbers('up');
  }

  moveDown() {
    this.moveForwardNumbers('down');
  }

  merge(direction) {
    // numbers[row][col]
    if (
      this.numbers[direction.curRow][direction.curCol] > 0 &&
      this.numbers[direction.nextRow][direction.nextCol] ===
        this.numbers[direction.curRow][direction.curCol]
    ) {
      this.numbers[direction.nextRow][direction.nextCol] *= 2;
      this.numbers[direction.curRow][direction.curCol] = 0;
      this.score += this.numbers[direction.nextRow][direction.nextCol];

      return true;
    }

    return false;
  }

  swap(direction) {
    if (
      this.numbers[direction.nextRow][direction.nextCol] === 0 &&
      this.numbers[direction.curRow][direction.curCol] > 0
    ) {
      const item = this.numbers[direction.nextRow][direction.nextCol];

      this.numbers[direction.nextRow][direction.nextCol] =
        this.numbers[direction.curRow][direction.curCol];
      this.numbers[direction.curRow][direction.curCol] = item;

      return true;
    }

    return false;
  }

  setDirection(dir, i, j) {
    // numbers[row][col]
    const direction = {
      curRow: i,
      curCol: j,
    };

    switch (dir) {
      case 'down':
        direction.nextRow = j + 1;
        direction.nextCol = i;
        direction.curRow = j;
        direction.curCol = i;
        break;

      case 'up':
        direction.nextRow = j - 1;
        direction.nextCol = i;
        direction.curRow = j;
        direction.curCol = i;
        break;

      case 'right':
        direction.nextRow = i;
        direction.nextCol = j + 1;
        break;

      case 'left':
        direction.nextRow = i;
        direction.nextCol = j - 1;
        break;
    }

    return direction;
  }

  setViewNumbers() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const currentNumber = this.numbers[i][j];
        const curentCell = this.cells[i][j];

        curentCell.className = 'field-cell';

        if (currentNumber) {
          curentCell.classList.add(`field-cell--${currentNumber}`);
          curentCell.innerText = currentNumber;
        } else {
          curentCell.innerText = '';
          // document.querySelector('field-cell').classList.length--;
        }
      }
    }
    // console.log(this.numbers);
  }

  checkStatus() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const currentNumber = this.numbers[i][j];

        if (currentNumber === 2048) {
          this.status = 'win';
          this.showMessage(this.status);

          return;
        }

        if (currentNumber === 0) {
          return;
        }

        if (j < 3 && currentNumber === this.numbers[i][j + 1]) {
          return;
        }

        if (i < 3 && currentNumber === this.numbers[i + 1][j]) {
          return;
        }
      }
    }

    this.status = 'lose';
    this.showMessage(this.status);
  }

  createCell() {
    if (this.status === 'playing') {
      let i;
      let j;
      let digit;

      while (true) {
        i = Math.floor(Math.random() * 4);
        j = Math.floor(Math.random() * 4);

        if (this.numbers[i][j]) {
          continue;
        }

        digit = Math.random() < 0.1 ? 4 : 2;
        this.numbers[i][j] = digit;
        break;
      }
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
    return this.numbers;
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

  hideMessages() {
    const messages = document.querySelectorAll(`.message`);

    for (const msg of messages) {
      if (!msg.classList.contains(`hidden`)) {
        msg.classList.add('hidden');
      }
    }
  }

  showMessage(type) {
    const message = document.querySelector(`.message-${type}`);

    this.hideMessages();
    message.classList.remove('hidden');
  }

  /**
   * Starts the game.
   */
  start(button) {
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    this.status = 'playing';

    this.hideMessages();
    this.createCell();
    this.createCell();
    this.setViewNumbers();
  }

  /**
   * Resets the game.
   */
  restart(button) {
    button.classList.replace('restart', 'start');
    button.innerText = 'Start';

    this.numbers = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
    this.score = 0;
    this.showMessage('start');
    this.setViewNumbers();
  }
}

module.exports = Game;

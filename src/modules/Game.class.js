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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.firstMoveMade = false;
    this.gameOver = false;
    this.startMessage = document.querySelector('.message-start');
    this.winMessage = document.querySelector('.message-win');
    this.loseMessage = document.querySelector('.message-lose');
    this.buttonStart = document.querySelector('.start');
    this.scoreDisplay = document.querySelector('.game-score');
    this.buttonStart.addEventListener('click', () => this.start());
  }

  init() {
    this.pushGenerateNumber();
    this.pushGenerateNumber();
    this.render();
  }
  moveLeft() {
    this.state = this.state.map((arr) => this.merge(arr, 0));
    this.pushGenerateNumber();
  }
  moveRight() {
    this.state = this.state.map((arr) => this.merge(arr, 1));
    this.pushGenerateNumber();
  }
  moveUp() {
    this.state = this.rotateMatrix(this.state, 1);
    this.state = this.state.map((arr) => this.merge(arr, 1));
    this.state = this.rotateMatrix(this.state, 0);
    this.pushGenerateNumber();
  }
  moveDown() {
    this.state = this.rotateMatrix(this.state, 1);
    this.state = this.state.map((arr) => this.merge(arr, 0));
    this.state = this.rotateMatrix(this.state, 0);
    this.pushGenerateNumber();
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
    return 'idle';
  }
  handler() {
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
  }
  handleKeydown(e) {
    if (this.gameOver) {
      return;
    }

    if (e.key === 'ArrowLeft') {
      this.moveLeft();
    } else if (e.key === 'ArrowRight') {
      this.moveRight();
    } else if (e.key === 'ArrowUp') {
      this.moveUp();
    } else if (e.key === 'ArrowDown') {
      this.moveDown();
    }

    if (!this.firstMoveMade) {
      this.firstMoveMade = true;
      this.buttonStart.textContent = 'Restart';
      this.startMessage.classList.add('hidden');
    }
    this.checkWin();
    this.checkGameOver();
  }
  generateNumber() {
    return Math.random() < 0.9 ? 2 : 4;
  }
  pushGenerateNumber() {
    const availableIndexes = [[], [], [], []];
    // eslint-disable-next-line no-shadow

    this.state.forEach((arr, i) => {
      // eslint-disable-next-line no-shadow
      arr.forEach((number, index) => {
        if (!number) {
          availableIndexes[i].push(index);
        }
      });
    });

    const availableArray = [];

    availableIndexes.forEach((arr, index) => {
      if (arr.length) {
        availableArray.push(index);
      }
    });

    if (availableArray.length === 0) {
      return;
    }

    const array = this.getRandomElement(availableArray);
    const number = this.getRandomElement(availableIndexes[array]);

    this.state[array][number] = this.generateNumber();
    this.render();
  }
  getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  rotateMatrix(arr, clockwise) {
    if (clockwise) {
      return arr.map((_, colIndex) => {
        return arr.map((row) => row[colIndex]).reverse();
      });
    } else {
      return arr.map((_, colIndex) => {
        return arr.map((row) => row[row.length - 1 - colIndex]);
      });
    }
  }
  merge(arr, direction) {
    const input = direction ? arr.reverse() : arr;
    const result = input
      .filter((item) => item)
      .reduce((acc, item, idx) => {
        if (acc[idx - 1] === item) {
          acc[acc.length - 1] += item;
          this.score += acc[acc.length - 1];
        } else {
          acc.push(item);
        }

        return acc;
      }, []);
    const resLength = result.length;

    result.length = arr.length;
    result.fill(0, resLength, result.length);

    return direction ? result.reverse() : result;
  }
  checkWin() {
    if (this.state.flat().includes(2048)) {
      this.showMessage(this.winMessage);
      this.gameOver = true;
    }
  }
  checkGameOver() {
    for (const row of this.state) {
      if (row.includes(0)) {
        return false;
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (
          (i < this.state.length - 1 &&
            this.state[i][j] === this.state[i + 1][j]) ||
          (j < this.state[i].length - 1 &&
            this.state[i][j] === this.state[i][j + 1])
        ) {
          return false;
        }
      }
    }
    this.showMessage(this.loseMessage);
    this.gameOver = true;
  }
  showMessage(messageElement) {
    this.startMessage.classList.add('hidden');
    this.winMessage.classList.add('hidden');
    this.loseMessage.classList.add('hidden');
    messageElement.classList.remove('hidden');
  }
  start() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.firstMoveMade = false;
    this.gameOver = false;
    this.scoreDisplay.textContent = this.score;
    this.showMessage(this.startMessage);
    this.buttonStart.textContent = 'Start';
    this.init();
  }
  restart() {
    this.start();
  }
  render() {
    const tbody = document.querySelector('tbody');

    tbody.innerHTML = '';

    this.state.forEach((row) => {
      const tr = document.createElement('tr');

      row.forEach((cell) => {
        const td = document.createElement('td');

        td.textContent = cell || '';
        td.className = cell ? `field-cell field-cell--${cell}` : 'field-cell';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    this.scoreDisplay.textContent = this.score;
  }
}
module.exports = Game;

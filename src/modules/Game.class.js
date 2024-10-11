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
    this.currentCount = 0;
    this.firstMoveMade = false;

    if (initialState) {
      this.state = initialState;
    } else {
      this.state = [];

      for (let i = 0; i < 4; i++) {
        const row = [];

        for (let j = 0; j < 4; j++) {
          row.push(0);
        }
        this.state.push(row);
      }
    }

    this.score = 0;
  }

  calculateScore() {
    this.score = 0;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] !== 2) {
          this.score += this.state[i][j];
        }
      }
    }
  }

  canMerge() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] !== 0) {
          if (
            (j > 0 &&
              (this.state[i][j - 1] === this.state[i][j] ||
                this.state[i][j - 1] === 0)) ||
            (j < 3 &&
              (this.state[i][j + 1] === this.state[i][j] ||
                this.state[i][j + 1] === 0)) ||
            (i > 0 &&
              (this.state[i - 1][j] === this.state[i][j] ||
                this.state[i - 1][j] === 0)) ||
            (i < 3 &&
              (this.state[i + 1][j] === this.state[i][j] ||
                this.state[i + 1][j] === 0))
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  generateNewTile() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomCell.i][randomCell.j] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  updateGameField() {
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = this.getState()[row][col];

      cell.textContent = value !== 0 ? value : '';
      cell.className = 'field-cell';

      if (value) {
        cell.classList.add(`field-cell--${value}`);
      }
    });

    const gameStatus = this.getStatus();

    if (gameStatus === 'Win') {
      document.querySelector('.message-win').classList.remove('hidden');
    } else if (gameStatus === 'Loose') {
      document.querySelector('.message-lose').classList.remove('hidden');
    }

    this.calculateScore();
    document.querySelector('.game-score').textContent = this.score;
  }

  addEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        switch (e.key) {
          case 'ArrowLeft':
            this.moveLeft();
            break;
          case 'ArrowRight':
            this.moveRight();
            break;
          case 'ArrowUp':
            this.moveUp();
            break;
          case 'ArrowDown':
            this.moveDown();
            break;
        }
        this.updateGameField();
      }
    });

    document.querySelector('.start').addEventListener('click', () => {
      this.start();
      this.generateNewTile();
      this.generateNewTile();
      this.updateGameField();
      document.querySelector('.message-start').classList.add('hidden');
    });
  }

  moveLeft() {
    const prevState = JSON.stringify(this.state);

    const newLeftResult = [];

    for (let i = 0; i < this.state.length; i++) {
      const leftRow = this.state[i];
      const newLeftRow = leftRow.filter((value) => value !== 0);

      for (let j = 0; j < newLeftRow.length - 1; j++) {
        if (newLeftRow[j] === newLeftRow[j + 1]) {
          newLeftRow[j] *= 2;
          newLeftRow.splice(j + 1, 1);
          this.currentCount += newLeftRow[j];
        }
      }

      while (newLeftRow.length < leftRow.length) {
        newLeftRow.push(0);
      }

      newLeftResult.push(newLeftRow);
    }

    this.state = newLeftResult;

    if (prevState !== JSON.stringify(this.state)) {
      this.generateNewTile();
    }

    if (!this.firstMoveMade) {
      document.querySelector('.message-start').classList.add('hidden');
      this.firstMoveMade = true;
      document.querySelector('.start').textContent = 'Restart';
      document.querySelector('.start').style.background = 'red';
    }

    this.updateGameField();
  }

  moveRight() {
    const prevState = JSON.stringify(this.state);

    const newRightResult = [];

    for (let i = 0; i < this.state.length; i++) {
      const rightRow = [...this.state[i]].reverse();
      const newRightRow = rightRow.filter((value) => value !== 0);

      for (let j = 0; j < newRightRow.length - 1; j++) {
        if (newRightRow[j] === newRightRow[j + 1]) {
          newRightRow[j] *= 2;
          newRightRow.splice(j + 1, 1);
          this.currentCount += newRightRow[j];
        }
      }

      while (newRightRow.length < rightRow.length) {
        newRightRow.push(0);
      }

      newRightResult.push(newRightRow.reverse());
    }

    this.state = newRightResult;

    if (prevState !== JSON.stringify(this.state)) {
      this.generateNewTile();
    }

    if (!this.firstMoveMade) {
      document.querySelector('.message-start').classList.add('hidden');
      this.firstMoveMade = true;
      document.querySelector('.start').textContent = 'Restart';
      document.querySelector('.start').style.background = 'red';
    }

    this.updateGameField();
  }

  moveUp() {
    const prevState = JSON.stringify(this.state);

    for (let j = 0; j < this.state.length; j++) {
      const newUpCol = [];

      for (let i = 0; i < this.state.length; i++) {
        if (this.state[i][j] !== 0) {
          newUpCol.push(this.state[i][j]);
        }
      }

      for (let i = 0; i < newUpCol.length; i++) {
        if (newUpCol[i] === newUpCol[i + 1]) {
          newUpCol[i] *= 2;
          newUpCol.splice(i + 1, 1);
          this.currentCount += newUpCol[i];
        }
      }

      while (newUpCol.length < this.state.length) {
        newUpCol.push(0);
      }

      for (let i = 0; i < this.state.length; i++) {
        this.state[i][j] = newUpCol[i];
      }
    }

    if (prevState !== JSON.stringify(this.state)) {
      this.generateNewTile();
    }

    if (!this.firstMoveMade) {
      document.querySelector('.message-start').classList.add('hidden');
      this.firstMoveMade = true;
      document.querySelector('.start').textContent = 'Restart';
      document.querySelector('.start').style.background = 'red';
    }

    this.updateGameField();
  }

  moveDown() {
    const prevState = JSON.stringify(this.state);

    for (let j = 0; j < this.state.length; j++) {
      const newDownCol = [];

      for (let i = this.state.length - 1; i >= 0; i--) {
        if (this.state[i][j] !== 0) {
          newDownCol.push(this.state[i][j]);
        }
      }

      for (let i = 0; i < newDownCol.length - 1; i++) {
        if (newDownCol[i] === newDownCol[i + 1]) {
          newDownCol[i] *= 2;
          newDownCol.splice(i + 1, 1);
          this.currentCount += newDownCol[i];
        }
      }

      while (newDownCol.length < this.state.length) {
        newDownCol.push(0);
      }

      for (let i = 0; i < this.state.length; i++) {
        this.state[this.state.length - 1 - i][j] = newDownCol[i];
      }
    }

    if (prevState !== JSON.stringify(this.state)) {
      this.generateNewTile();
    }

    if (!this.firstMoveMade) {
      document.querySelector('.message-start').classList.add('hidden');
      this.firstMoveMade = true;
      document.querySelector('.start').textContent = 'Restart';
      document.querySelector('.start').style.background = 'red';
    }

    this.updateGameField();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.currentCount;
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
    let hasEmptyCell = false;

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          return 'Win';
        }

        if (this.state[i][j] === 0) {
          hasEmptyCell = true;
        }
      }
    }

    if (!hasEmptyCell && !this.canMerge()) {
      return 'Loose';
    }

    return 'The game continuous';
  }

  /**
   * Starts the game.
   */
  start() {
    this.currentCount = 0;
    this.firstMoveMade = false;
    this.state = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.updateGameField();
    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.start').textContent = 'Start';
    document.querySelector('.start').style.background = 'green';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
    document.querySelector('.message-start').classList.remove('hidden');
    document.querySelector('.start').textContent = 'Start';
  }

  // Add your own methods here
}

module.exports = Game;

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
    console.log(initialState);

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.hasStarted = false;
  }

  startToRestart() {
    if (!this.hasStarted) {
      const btn = document.querySelector('.start');

      btn.textContent = 'Restart';
      btn.classList.remove('start');
      btn.classList.add('restart');
      this.hasStarted = true;
    }
  }

  updateScore() {
    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  handleKeyDown(e) {
    if (this.status === 'lose' || this.status === 'win') {
      return;
    }

    if (e.code === 'ArrowLeft') {
      this.moveLeft();
    }

    if (e.code === 'ArrowRight') {
      this.moveRight();
    }

    if (e.code === 'ArrowUp') {
      this.moveUp();
    }

    if (e.code === 'ArrowDown') {
      this.moveDown();
    }
  }

  setupControls() {
    if (this.controlsSet) {
      return;
    }

    document.addEventListener('keydown', this.handleKeyDown);
    this.controlsSet = true;
  }

  addRandomTile() {
    const listOfEmptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          listOfEmptyCells.push([row, col]);
        }
      }
    }

    if (listOfEmptyCells.length > 0) {
      const randomEmptyCell = Math.floor(
        Math.random() * listOfEmptyCells.length,
      );
      const randomEmptyCellValue = Math.random() < 0.9 ? 2 : 4;

      this.board[listOfEmptyCells[randomEmptyCell][0]][
        listOfEmptyCells[randomEmptyCell][1]
      ] = randomEmptyCellValue;
    }
  }

  moveLeft() {
    const prevBoard = JSON.stringify(this.board);

    for (let row = 0; row < this.board.length; row++) {
      const newRow = [];

      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] !== 0) {
          newRow.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow.splice(i + 1, 1);
          this.score += newRow[i];
          newRow.push(0);
          i++;
        }
      }

      while (newRow.length < this.board[row].length) {
        newRow.push(0);
      }

      this.board[row] = newRow;
    }

    const newBoard = JSON.stringify(this.board);

    if (prevBoard !== newBoard) {
      this.addRandomTile();
    }
    this.getStatus();
    this.render();
    this.updateScore();
    this.startToRestart();
  }
  moveRight() {
    const prevBoard = JSON.stringify(this.board);

    for (let row = 0; row < this.board.length; row++) {
      const newRow = this.board[row].filter((val) => val !== 0).reverse();

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[row] = newRow.reverse();
    }

    const newBoard = JSON.stringify(this.board);

    if (prevBoard !== newBoard) {
      this.addRandomTile();
    }

    this.getStatus();
    this.render();
    this.updateScore();
    this.startToRestart();
  }

  moveUp() {
    const prevBoard = JSON.stringify(this.board);

    for (let col = 0; col < this.board[0].length; col++) {
      const newCol = [];

      for (let row = 0; row < this.board.length; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newCol.splice(i + 1, 1);
          this.score += newCol[i];
          newCol.push(0);
          i++;
        }
      }

      while (newCol.length < this.board.length) {
        newCol.push(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = newCol[row];
      }
    }

    const newBoard = JSON.stringify(this.board);

    if (prevBoard !== newBoard) {
      this.addRandomTile();
    }
    this.getStatus();
    this.render();
    this.updateScore();
    this.startToRestart();
  }

  moveDown() {
    const prevBoard = JSON.stringify(this.board);

    for (let col = 0; col < this.board[0].length; col++) {
      const newCol = [];

      for (let row = this.board.length - 1; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newCol.splice(i + 1, 1);
          this.score += newCol[i];
          newCol.push(0);
          i++;
        }
      }

      while (newCol.length < this.board.length) {
        newCol.push(0);
      }

      for (let row = this.board.length - 1; row >= 0; row--) {
        this.board[row][col] = newCol[this.board.length - 1 - row];
      }
    }

    const newBoard = JSON.stringify(this.board);

    if (prevBoard !== newBoard) {
      this.addRandomTile();
    }
    this.getStatus();
    this.render();
    this.updateScore();
    this.startToRestart();
  }
  /**
   * @returns {number}
   */
  getScore() {
    this.render();

    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
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
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return this.status;
        } else if (this.board[row][col] === 0) {
          this.status = 'playing';

          return this.status;
        }

        if (
          (col < 3 && this.board[row][col] === this.board[row][col + 1]) ||
          (row < 3 && this.board[row][col] === this.board[row + 1][col])
        ) {
          this.status = 'playing';

          return this.status;
        }
      }
    }

    this.status = 'lose';

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'playing';

    const listOfEmptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          listOfEmptyCells.push([row, col]);
        }
      }
    }

    let randomEmptyCellOne, randomEmptyCellTwo;

    do {
      randomEmptyCellOne = Math.floor(Math.random() * listOfEmptyCells.length);
      randomEmptyCellTwo = Math.floor(Math.random() * listOfEmptyCells.length);
    } while (randomEmptyCellOne === randomEmptyCellTwo);

    const firstValue = Math.random() < 0.9 ? 2 : 4;

    this.board[listOfEmptyCells[randomEmptyCellOne][0]][
      listOfEmptyCells[randomEmptyCellOne][1]
    ] = firstValue;

    const secondValue = Math.random() < 0.9 ? 2 : 4;

    this.board[listOfEmptyCells[randomEmptyCellTwo][0]][
      listOfEmptyCells[randomEmptyCellTwo][1]
    ] = secondValue;

    this.setupControls();
    this.render();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.updateScore();
    this.start();
  }

  // Add your own methods here
  renderCell(cellElement, value) {
    cellElement.className = 'field-cell';

    if (value !== 0) {
      cellElement.classList.add(`field-cell--${value}`);
      cellElement.textContent = value;
    } else {
      cellElement.textContent = '';
    }
  }

  render() {
    const cells = document.querySelectorAll('.field-cell');

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        const index = row * this.board.length + col;
        const value = this.board[row][col];

        cells[index].textContent = value === 0 ? '' : value;
      }
    }

    const scoreElement = document.querySelector('.score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }

    const fieldCells = document.querySelectorAll('.field-cell');

    fieldCells.forEach((cellElement, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = this.board[row][col];

      this.renderCell(cellElement, value);
    });

    const winMessage = document.querySelector('.message-win');
    const loseMessage = document.querySelector('.message-lose');
    const startMessage = document.querySelector('.message-start');

    if (winMessage) {
      if (this.status === 'win') {
        winMessage.classList.remove('hidden');
      } else {
        winMessage.classList.add('hidden');
      }
    }

    if (loseMessage) {
      if (this.status === 'lose') {
        loseMessage.classList.remove('hidden');
      } else {
        loseMessage.classList.add('hidden');
      }
    }

    if (startMessage) {
      if (this.status !== 'idle') {
        startMessage.classList.add('hidden');
      }
    }
  }
}

module.exports = Game;

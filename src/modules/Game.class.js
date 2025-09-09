'use strict';

const startMessage = document.querySelector('.message-start');
const gameScore = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

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
  constructor() {
    this.gameStatus = 'idle';
    this.gameScore = 0;
    this.size = 4;
    this.gameField = document.querySelector('.game-field');
    this.buttonStart = document.querySelector('.button.start');

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.loadState();

    this.buttonStart.addEventListener('click', () => {
      if (this.gameStatus === 'playing') {
        this.restart();
      } else {
        this.start();
      }
    });

    document.addEventListener('keydown', (ev) => {
      switch (ev.key) {
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
      }
    });

    this.updateBoard();
  }

  get rows() {
    return this.board;
  }

  set rows(newRows) {
    this.board = newRows;
  }

  get columns() {
    const cols = [];

    for (let i = 0; i < this.size; i++) {
      const col = [];

      for (let j = 0; j < this.size; j++) {
        col.push(this.board[j][i]);
      }
      cols.push(col);
    }

    return cols;
  }

  set columns(newColumns) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.board[j][i] = newColumns[i][j];
      }
    }
  }

  moveLeft() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    for (let i = 0; i < this.size; i++) {
      const row = this.board[i];

      let RowWithoutZeroElements = row.filter((cell) => cell !== 0);
      let newRow = [...RowWithoutZeroElements];

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      for (let j = 0; j < this.size - 1; j++) {
        if (newRow[j] !== 0 && newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          this.gameScore += newRow[j];
          newRow[j + 1] = 0;
          j++;
        }
      }

      RowWithoutZeroElements = newRow.filter((cell) => cell !== 0);
      newRow = [...RowWithoutZeroElements];

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      this.board[i] = newRow;
    }

    if (boardBeforeMove !== JSON.stringify(this.board)) {
      this.addRandomCell();
    }
    this.updateBoard();
    this.checkWinCondition();
    this.checkLooseCondition();
    this.saveState();
  }

  moveRight() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    for (let i = 0; i < this.size; i++) {
      const row = this.board[i];
      let RowWithoutZeroElements = row.filter((cell) => cell !== 0);
      let newRow = [...RowWithoutZeroElements];

      while (newRow.length < this.size) {
        newRow.unshift(0);
      }

      for (let j = this.size - 1; j > 0; j--) {
        if (newRow[j] !== 0 && newRow[j] === newRow[j - 1]) {
          newRow[j] *= 2;
          this.gameScore += newRow[j];
          newRow[j - 1] = 0;
          j--;
        }
      }

      RowWithoutZeroElements = newRow.filter((cell) => cell !== 0);
      newRow = [...RowWithoutZeroElements];

      while (newRow.length < this.size) {
        newRow.unshift(0);
      }

      this.board[i] = newRow;
    }

    if (boardBeforeMove !== JSON.stringify(this.board)) {
      this.addRandomCell();
    }
    this.updateBoard();
    this.checkWinCondition();
    this.checkLooseCondition();
    this.saveState();
  }
  moveUp() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    for (let i = 0; i < this.size; i++) {
      const col = [];

      for (let j = 0; j < this.size; j++) {
        col.push(this.board[j][i]);
      }

      let columnWithoutZeroElements = col.filter((cell) => cell !== 0);
      let newColumn = [...columnWithoutZeroElements];

      while (newColumn.length < this.size) {
        newColumn.push(0);
      }

      for (let j = 0; j < this.size - 1; j++) {
        if (newColumn[j] !== 0 && newColumn[j] === newColumn[j + 1]) {
          newColumn[j] *= 2;
          this.gameScore += newColumn[j];
          newColumn[j + 1] = 0;
          j++;
        }
      }

      columnWithoutZeroElements = newColumn.filter((cell) => cell !== 0);
      newColumn = [...columnWithoutZeroElements];

      while (newColumn.length < this.size) {
        newColumn.push(0);
      }

      for (let k = 0; k < this.size; k++) {
        this.board[k][i] = newColumn[k];
      }
    }

    if (boardBeforeMove !== JSON.stringify(this.board)) {
      this.addRandomCell();
    }
    this.updateBoard();
    this.checkWinCondition();
    this.checkLooseCondition();
    this.saveState();
  }
  moveDown() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    const boardBeforeMove = JSON.stringify(this.board);

    for (let i = 0; i < this.size; i++) {
      const col = [];

      for (let j = 0; j < this.size; j++) {
        col.push(this.board[j][i]);
      }

      let columnWithoutZeroElements = col.filter((cell) => cell !== 0);
      let newColumn = [...columnWithoutZeroElements];

      while (newColumn.length < this.size) {
        newColumn.unshift(0);
      }

      for (let j = this.size - 1; j > 0; j--) {
        if (newColumn[j] !== 0 && newColumn[j] === newColumn[j - 1]) {
          newColumn[j] *= 2;
          this.gameScore += newColumn[j];
          newColumn[j - 1] = 0;
          j--;
        }
      }

      columnWithoutZeroElements = newColumn.filter((cell) => cell !== 0);
      newColumn = [...columnWithoutZeroElements];

      while (newColumn.length < this.size) {
        newColumn.unshift(0);
      }

      for (let k = 0; k < this.size; k++) {
        this.board[k][i] = newColumn[k];
      }
    }

    if (boardBeforeMove !== JSON.stringify(this.board)) {
      this.addRandomCell();
    }
    this.updateBoard();
    this.checkWinCondition();
    this.checkLooseCondition();
    this.saveState();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.gameScore;
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
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.gameScore = 0;
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.gameStatus = 'playing';
    startMessage.classList.add('hidden');
    this.buttonStart.classList.add('restart');
    this.buttonStart.textContent = 'Restart';

    this.addRandomCell();
    this.addRandomCell();
    this.updateBoard();
    this.saveState();

    // console.log(this.board);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.gameStatus = 'idle';
    this.gameScore = 0;
    localStorage.removeItem('gameState');
    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    this.buttonStart.classList.remove('restart');
    this.buttonStart.textContent = 'Start';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.updateBoard();
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  getRandomValue() {
    const randomNumber = Math.random();

    return randomNumber < 0.1 ? 4 : 2;
  }

  addRandomCell() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = this.getRandomValue();
  }

  checkWinCondition() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.gameStatus = 'win';
          winMessage.classList.remove('hidden');
          this.buttonStart.classList.remove('restart');
          this.buttonStart.textContent = 'Start';

          return;
        }
      }
    }
  }

  checkLooseCondition() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      return;
    }

    // Can the user move horizontally?
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return;
        }
      }
    }

    // Can the user move vertically?
    for (let j = 0; j < this.size; j++) {
      for (let i = 0; i < this.size - 1; i++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return;
        }
      }
    }

    this.gameStatus = 'lose';
    loseMessage.classList.remove('hidden');
    this.buttonStart.classList.add('restart');
    this.buttonStart.textContent = 'Restart';
  }

  saveState() {
    const gameState = {
      board: this.board,
      score: this.gameScore,
      status: this.gameStatus,
    };

    localStorage.setItem('gameState', JSON.stringify(gameState));
  }

  loadState() {
    const savedState = localStorage.getItem('gameState');

    if (!savedState) {
      return;
    }

    const gameState = JSON.parse(savedState);

    this.board = gameState.board;
    this.gameScore = gameState.score;
    this.gameStatus = gameState.status;

    if (this.gameStatus === 'playing') {
      startMessage.classList.add('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      this.buttonStart.classList.add('restart');
      this.buttonStart.textContent = 'Restart';
    } else if (this.gameStatus === 'win') {
      winMessage.classList.remove('hidden');
    } else if (this.gameStatus === 'lose') {
      loseMessage.classList.remove('hidden');
      this.buttonStart.classList.add('restart');
      this.buttonStart.textContent = 'Restart';
    }
  }
  updateBoard() {
    const tableRows = this.gameField.querySelectorAll('.field-row');

    this.board.forEach((rowValues, rowIndex) => {
      const fieldCells = tableRows[rowIndex].querySelectorAll('.field-cell');

      rowValues.forEach((cellValue, colIndex) => {
        const cellElement = fieldCells[colIndex];

        cellElement.textContent = '';
        cellElement.className = 'field-cell';

        if (cellValue !== 0) {
          cellElement.textContent = cellValue;
          cellElement.classList.add(`tile`);
          cellElement.classList.add(`field-cell--${cellValue}`);
        }
      });
    });

    gameScore.textContent = this.gameScore;
  }
}

export default Game;

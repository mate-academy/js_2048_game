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
    this.initialState = initialState;
    this.score = 0;
    this.columns = 4;
    this.rows = 4;
    this.startButton = document.getElementById('button_start');
    this.isStarted = false;
  }

  start() {
    this.startButton.removeAttribute('id');
    this.startButton.classList.remove('start');
    this.startButton.classList.add('restart');
    this.startButton.textContent = 'Restart';

    const messageStart = document.querySelector('.message-start');

    messageStart.classList.add('hidden');

    this.setGame();

    this.isStarted = true;

    this.startButton.onclick = () => {
      this.restart();
    };
  }

  setGame() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const row = document.querySelectorAll('.field-row')[r];
        const tile = row.children[c];

        tile.id = r.toString() + '-' + c.toString();

        const num = this.initialState[r][c];

        this.updateTiles(tile, num);
      }
    }

    this.getStatus();

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    document.querySelector('.game-score').innerText = this.score;

    const loseMessage = document.querySelector('.message-lose');
    const winMessage = document.querySelector('.message-win');

    if (!loseMessage.classList.contains('hidden')) {
      loseMessage.classList.add('hidden');
    }

    if (!winMessage.classList.contains('hidden')) {
      winMessage.classList.add('hidden');
    }

    this.setGame();
  }

  getState() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        return this.initialState[r][c];
      }
    }
  }

  getStatus() {
    if (!this.isStarted) {
      return 'idle';
    }

    if (this.initialState.flat().includes(2048)) {
      document.querySelector('.message-win').classList.remove('hidden');

      return 'win';
    }

    if (!this.hasMoves()) {
      document.querySelector('.message-lose').classList.remove('hidden');

      return 'lose';
    }

    return 'playing';
  }

  updateTiles(tile, num) {
    tile.innerText = '';
    tile.classList.value = '';

    if (num > 0) {
      tile.innerText = num;
      tile.classList.add('field-cell--' + num.toString());
    }

    tile.classList.add('field-cell');
  }

  hasEmptyTile() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.initialState[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  hasMoves() {
    const board = this.initialState;
    const size = board.length;

    if (board.flat().includes(0)) {
      return true;
    }

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const current = board[row][col];

        if (col < size - 1 && current === board[row][col + 1]) {
          return true;
        }

        if (row < size - 1 && current === board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  addRandomTile() {
    const randomNum = Math.floor(Math.random() * 10);

    if (randomNum === 1) {
      this.setFour();
    } else {
      this.setTwo();
    }
  }

  setTwo() {
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.columns);

      if (this.initialState[r][c] === 0) {
        this.initialState[r][c] = 2;

        const tile = document.getElementById(r.toString() + '-' + c.toString());

        tile.innerText = '2';
        tile.classList.remove('field-cell');
        tile.classList.add('field-cell--2');
        found = true;
      }
    }
  }

  setFour() {
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.columns);

      if (this.initialState[r][c] === 0) {
        this.initialState[r][c] = 4;

        const tile = document.getElementById(r.toString() + '-' + c.toString());

        tile.innerText = '4';
        tile.classList.remove('field-cell');
        tile.classList.add('field-cell--4');
        found = true;
      }
    }
  }

  clearZero(row) {
    return row.filter((num) => num !== 0);
  }

  slide(row) {
    let newRow = this.clearZero(row);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;

        this.score += newRow[i];
      }
    }

    newRow = this.clearZero(newRow);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  moveLeft() {
    const oldState = this.initialState.map((row) => [...row]);

    for (let r = 0; r < this.rows; r++) {
      let row = this.initialState[r];

      row = this.slide(row);
      this.initialState[r] = row;

      for (let c = 0; c < this.columns; c++) {
        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.initialState[r][c];

        this.updateTiles(tile, num);
      }
    }

    if (!this.arraysAreEqual(oldState, this.initialState)) {
      this.setTwo();
    }

    this.getStatus();
  }

  moveRight() {
    const oldState = this.initialState.map((row) => [...row]);

    for (let r = 0; r < this.rows; r++) {
      let row = this.initialState[r];

      row.reverse();
      row = this.slide(row);
      row.reverse();
      this.initialState[r] = row;

      for (let c = 0; c < this.columns; c++) {
        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.initialState[r][c];

        this.updateTiles(tile, num);
      }
    }

    if (!this.arraysAreEqual(oldState, this.initialState)) {
      this.setTwo();
    }

    this.getStatus();
  }

  moveUp() {
    const oldState = this.initialState.map((row) => [...row]);

    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.initialState[0][c],
        this.initialState[1][c],
        this.initialState[2][c],
        this.initialState[3][c],
      ];

      row = this.slide(row);

      for (let r = 0; r < this.rows; r++) {
        this.initialState[r][c] = row[r];

        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.initialState[r][c];

        this.updateTiles(tile, num);
      }
    }

    if (!this.arraysAreEqual(oldState, this.initialState)) {
      this.setTwo();
    }

    this.getStatus();
  }

  moveDown() {
    const oldState = this.initialState.map((row) => [...row]);

    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.initialState[0][c],
        this.initialState[1][c],
        this.initialState[2][c],
        this.initialState[3][c],
      ];

      row.reverse();
      row = this.slide(row);
      row.reverse();

      for (let r = 0; r < this.rows; r++) {
        this.initialState[r][c] = row[r];

        const tile = document.getElementById(r.toString() + '-' + c.toString());
        const num = this.initialState[r][c];

        this.updateTiles(tile, num);
      }
    }

    if (!this.arraysAreEqual(oldState, this.initialState)) {
      this.setTwo();
    }

    this.getStatus();
  }

  arraysAreEqual(arr1, arr2) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (arr1[r][c] !== arr2[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  getScore() {
    return this.score;
  }
}

module.exports = Game;

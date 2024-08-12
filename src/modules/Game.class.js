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

  static GameStatus = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.initialState = JSON.parse(JSON.stringify(initialState));
    this.status = Game.GameStatus.idle;
    this.score = 0;
  }

  moveLeft() {
    const newState = [...this.state];

    for (let i = 0; i < this.state.length; i++) {
      newState[i] = this.move(newState[i]);
    }

    if (this.canMerge(newState)) {
      this.state = [...newState];
      this.isWin();
      this.generateGameNumber();
    }

    this.isLose(newState);

    this.renderField();
  }

  moveRight() {
    const newState = [...this.state];

    for (let i = 0; i < this.state.length; i++) {
      let row = [...newState[i]];

      row.reverse();

      row = this.move(row);

      row.reverse();

      newState[i] = row;
    }

    if (this.canMerge(newState)) {
      this.state = [...newState];
      this.isWin();
      this.generateGameNumber();
    }

    this.isLose(newState);

    this.renderField();
  }

  moveUp() {
    const newState = [...Array(4)].map(() => Array(4).fill(0));

    for (let i = 0; i < this.state.length; i++) {
      let row = [
        this.state[0][i],
        this.state[1][i],
        this.state[2][i],
        this.state[3][i],
      ];

      row = this.move(row);

      for (let j = 0; j < this.state.length; j++) {
        newState[j][i] = row[j];
      }
    }

    if (this.canMerge(newState)) {
      this.state = [...newState];
      this.isWin();
      this.generateGameNumber();
    }

    this.isLose(newState);

    this.renderField();
  }

  moveDown() {
    const newState = [...Array(4)].map(() => Array(4).fill(0));

    for (let i = 0; i < this.state.length; i++) {
      let row = [
        this.state[0][i],
        this.state[1][i],
        this.state[2][i],
        this.state[3][i],
      ].reverse();

      row = this.move(row);
      row = row.reverse();

      for (let j = 0; j < this.state.length; j++) {
        newState[j][i] = row[j];
      }
    }

    if (this.canMerge(newState)) {
      this.state = [...newState];
      this.isWin();
      this.generateGameNumber();
    }

    this.isLose(newState);

    this.renderField();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.GameStatus.playing;
    this.generateGameNumber();
    this.generateGameNumber();
    this.renderField();
  }

  restart() {
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.status = Game.GameStatus.idle;
    this.score = 0;
    this.renderField();
  }

  renderField() {
    const table = document.querySelector('table');

    for (const i of this.state) {
      const newRow = table.insertRow();

      newRow.className = 'field-row';

      for (const j of i) {
        const newCell = newRow.insertCell();

        newCell.textContent = j || '';
        newCell.classList.add('field-cell');

        if (j) {
          newCell.classList.add(`field-cell--${j}`);
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      table.deleteRow(0);
    }
  }

  move(row) {
    const filteredRow = row.filter((num) => num !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        this.score += filteredRow[i];
      }
    }

    const newRow = filteredRow.filter((num) => num !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  isWin() {
    for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < this.state[rowIndex].length;
        columnIndex++
      ) {
        if (this.state[rowIndex][columnIndex] === 2048) {
          this.status = Game.GameStatus.win;

          return;
        }
      }
    }
  }

  canMerge(newState) {
    return JSON.stringify(newState) !== JSON.stringify(this.state);
  }

  canMove() {
    const stateLength = this.state.length;

    for (let i = 0; i < stateLength; i++) {
      for (let j = 0; j < stateLength; j++) {
        if (
          (j < stateLength - 1 && this.state[i][j] === this.state[i][j + 1]) ||
          (i < stateLength - 1 && this.state[i][j] === this.state[i + 1][j])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  emptyCellsCount() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  generateGameNumber() {
    const emptyCells = this.emptyCellsCount();

    if (emptyCells.length !== 0) {
      const getRandomEmptyCell = Math.floor(Math.random() * emptyCells.length);
      const column = emptyCells[getRandomEmptyCell][1];
      const row = emptyCells[getRandomEmptyCell][0];

      this.state[row][column] = Math.random() >= 0.9 ? 4 : 2;
    }
  }

  isLose() {
    if (this.emptyCellsCount().length === 0 && !this.canMove()) {
      this.status = Game.GameStatus.lose;
    }
  }
}

module.exports = Game;

/* eslint-disable no-new-wrappers */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Game {
  status = Game.STATUSES.idle;
  state;
  round = 0;
  rowLength = 4;
  colLength = 4;
  startBlockCount = 2;
  score = 0;
  maxScore = 2048;
  lastMoveKey = null;
  isBloksChanged = true;

  gameUI = {
    gameField: null,
    startButton: null,
    gameScore: null,
    messageLose: null,
    messageWin: null,
    messageStart: null,
  };
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
  constructor(initialState = null, gameUI = {}) {
    if (initialState) {
      this.state = initialState;
    } else {
      this.resetState();
    }
    this.gameUI = gameUI;
    this.initUIEvents();
  }

  resetState() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  showState() {
    this.gameUI.gameScore.textContent = this.score;

    for (let rowIndex = 0; rowIndex < this.rowLength; rowIndex++) {
      for (let colIndex = 0; colIndex < this.colLength; colIndex++) {
        const block =
          this.gameUI.gameField.children[rowIndex].children[colIndex];
        const value = this.state[rowIndex][colIndex];

        if (!value) {
          block.className = 'field-cell';
          block.textContent = '';
          continue;
        }
        block.textContent = value;

        block.className = ['field-cell', 'field-cell--' + value].join(' ');

        if (typeof value === 'object' && value.gameRound === this.round) {
          block.classList.add('field-cell--join');
        }

        if (typeof value === 'object' && value.newNumber === this.round) {
          block.classList.add('field-cell--new');
        }
      }
    }
  }

  // #region MOVE

  moveLeft() {
    const acs = false;

    this.round++;
    this.sortBlocks(acs);
    this.joinBlocks(acs);
    this.sortBlocks(acs);

    if (this.canMove(Game.moveKeys.ArrowLeft)) {
      this.addBlock();
    }
    this.showState();
  }

  moveRight() {
    const acs = true;

    this.round++;
    this.sortBlocks(acs);
    this.joinBlocks(acs);
    this.sortBlocks(acs);

    if (this.canMove(Game.moveKeys.ArrowRight)) {
      this.addBlock();
    }
    this.showState();
  }

  moveUp() {
    const acs = false;

    this.round++;
    this.transposeState();
    this.sortBlocks(acs);
    this.joinBlocks(acs);
    this.sortBlocks(acs);

    if (this.canMove(Game.moveKeys.ArrowUp)) {
      this.addBlock();
    }
    this.transposeState();
    this.showState();
  }

  moveDown() {
    const acs = true;

    this.round++;
    this.transposeState();
    this.sortBlocks(acs);
    this.joinBlocks(acs);
    this.sortBlocks(acs);

    if (this.canMove(Game.moveKeys.ArrowDown)) {
      this.addBlock();
    }
    this.transposeState();
    this.showState();
  }
  // #endregion

  // #region GET STATUSES
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
    return this.state.map((row) => row.map((block) => Number(block)));
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

  // #endregion

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== Game.STATUSES.idle) {
      this.resetState();
    }

    this.status = Game.STATUSES.playing;
    this.score = 0;
    this.hideMessages();

    for (let i = 0; i < this.startBlockCount; i++) {
      this.addBlock();
    }
    this.showState();
  }

  initUIEvents() {
    this.gameUI.startButton.addEventListener('click', this.startHandler);
    document.addEventListener('keydown', this.moveKeyHandler);
  }

  startHandler = (e) => {
    this.gameUI.startButton.textContent = 'Restart';
    this.gameUI.startButton.classList.remove('start');
    this.gameUI.startButton.classList.add('restart');
    this.start();
  };

  moveKeyHandler = (e) => {
    if (
      !(e.key && e.key in Game.moveKeys) ||
      this.getStatus() !== Game.STATUSES.playing
    ) {
      return;
    }

    document.activeElement.blur();

    e.preventDefault();

    this.isBloksChanged = false;

    switch (e.key) {
      case Game.moveKeys.ArrowLeft:
        this.moveLeft();
        break;
      case Game.moveKeys.ArrowRight:
        this.moveRight();
        break;
      case Game.moveKeys.ArrowUp:
        this.moveUp();
        break;
      case Game.moveKeys.ArrowDown:
        this.moveDown();
        break;
    }
  };

  /**
   * Resets the game.
   */
  restart() {}

  canMove = (key) => {
    const result =
      this.isBloksChanged || (!this.isBloksChanged && this.lastMoveKey !== key);

    if (result) {
      this.lastMoveKey = key;
    }

    return result;
  };

  addBlock = () => {
    const freeRows = [];

    for (const stateRow in this.state) {
      if (this.state[stateRow].some((block) => block === 0)) {
        freeRows.push(stateRow);
      }
    }

    if (freeRows.length === 0) {
      if (!this.canMakeMove()) {
        this.setGameStatus(Game.STATUSES.lose);
      }

      return;
    }

    const freeRowPosition =
      freeRows.length === 1 ? 0 : Math.floor(Math.random() * freeRows.length);

    const row = this.state[freeRows[freeRowPosition]];
    const freeSpace = row.filter((num) => num === 0).length;

    if (freeSpace) {
      const blockPosition =
        freeSpace === 0 ? 1 : Math.floor(Math.random() * freeSpace);
      let freeIndex = 0;

      for (const index in row) {
        if (row[index]) {
          continue;
        }

        if (freeIndex === blockPosition) {
          row[index] = this.newBlockValue();
          row[index].newNumber = this.round;
          break;
        }
        freeIndex++;
      }
    }
  };

  sortBlocks = (acs = true) => {
    const setChanged = (value) => {
      if (value === -1) {
        this.isBloksChanged = true;
      }
    };

    const sortAsc = (a, b) => {
      const result = Boolean(a) * 1 - Boolean(b) * 1;

      setChanged(result);

      return result;
    };

    const sortDesc = (a, b) => {
      const result = Boolean(b) * 1 - Boolean(a) * 1;

      setChanged(result);

      return result;
    };

    for (const row of this.state) {
      if (acs) {
        row.sort(sortAsc);
      } else {
        row.sort(sortDesc);
      }
    }
  };

  joinBlocks = (acs = true) => {
    for (const row of this.state) {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i]) {
          if (Number(row[i]) === Number(row[i + 1])) {
            if (acs) {
              row[i] = 0;
              row[i + 1] = new Number(row[i + 1] * 2);
              this.score += row[i + 1];
              row[i + 1].gameRound = this.round;
              this.setGameStatus(null, Number(row[i + 1]));
            } else {
              row[i] = new Number(row[i] * 2);
              this.score += row[i];
              row[i].gameRound = this.round;
              this.setGameStatus(null, Number(row[i]));
              row[i + 1] = 0;
            }
            i++;
          }
        }
      }
    }
  };

  newBlockValue() {
    const value = Math.random() < 0.9 ? 2 : 4;

    return new Number(value);
  }

  transposeState() {
    const newState = [];

    for (let col = 0; col < this.colLength; col++) {
      const newRow = [];

      newState.push(newRow);

      for (let row = 0; row < this.rowLength; row++) {
        newRow.push(this.state[row][col]);
      }
    }
    this.state = newState;
    [this.rowLength, this.colLength] = [this.colLength, this.rowLength];
    this.isTranspose = !this.isTranspose;
  }

  canMakeMove() {
    const stateHavePairs = () => {
      for (const row of this.state) {
        for (let column = 0; column < this.colLength - 1; column++) {
          if (Number(row[column]) === Number(row[column + 1])) {
            return true;
          }
        }
      }

      return false;
    };

    if (stateHavePairs()) {
      return true;
    }

    this.transposeState();

    if (stateHavePairs()) {
      this.transposeState();

      return true;
    }
    this.transposeState();

    return false;
  }

  hideMessages() {
    ['messageLose', 'messageWin', 'messageStart'].forEach((field) => {
      this.gameUI[field].classList.add('hidden');
    });
  }

  setGameStatus(newStatus = null, blockValue = 0) {
    if (newStatus === Game.STATUSES.lose) {
      this.status = Game.STATUSES.lose;
      this.gameUI.messageLose.classList.remove('hidden');

      return;
    }

    if (blockValue >= this.maxScore) {
      this.status = Game.STATUSES.win;
      this.gameUI.messageWin.classList.remove('hidden');
    }
  }
}

Game.STATUSES = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

Game.moveKeys = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
};

module.exports = Game;

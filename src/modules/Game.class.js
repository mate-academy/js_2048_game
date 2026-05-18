'use strict';

class Game {
  static StatusList = Object.freeze({
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  });

  static getEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  static makeRandomNumberOnBoard(dataBoard, amountToAdd = 1) {
    const board = dataBoard
      ? dataBoard.map((row) => [...row])
      : Game.getEmptyBoard();

    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    for (let i = 0; i < amountToAdd && emptyCells.length > 0; i++) {
      const idx = Math.floor(Math.random() * emptyCells.length);
      const { r, c } = emptyCells.splice(idx, 1)[0];

      board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }

    return board;
  }

  status = Game.StatusList.IDLE;
  score = 0;

  constructor(initialState) {
    this.state = initialState
      ? initialState.map((row) => [...row])
      : Game.getEmptyBoard();

    this.buttonStart = document.querySelector('.button');
    this.cells = Array.from(document.querySelectorAll('.field-cell'));
    this.scoreEl = document.querySelector('.game-score');
    this.msgStart = document.querySelector('.message-start');
    this.msgWin = document.querySelector('.message-win');
    this.msgLose = document.querySelector('.message-lose');

    this._setupListeners();
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

  moveLeft() {
    this._move('left');
  }

  moveRight() {
    this._move('right');
  }

  moveUp() {
    this._move('up');
  }

  moveDown() {
    this._move('down');
  }

  start() {
    this.status = Game.StatusList.PLAYING;
    this.score = 0;
    this.state = Game.makeRandomNumberOnBoard(Game.getEmptyBoard(), 2);

    this._activateRestartButton();
    this._hideMessages();
    this.msgStart.classList.add('hidden');
    this._renderView();
  }

  restart() {
    this.status = Game.StatusList.PLAYING;
    this.score = 0;
    this.state = Game.makeRandomNumberOnBoard(Game.getEmptyBoard(), 2);

    this._hideMessages();
    this._renderView();
  }

  _slideRowLeft(row) {
    const nums = row.filter((v) => v !== 0);
    let rowScore = 0;

    for (let i = 0; i < nums.length - 1; i++) {
      if (nums[i] === nums[i + 1]) {
        nums[i] *= 2;
        rowScore += nums[i];
        nums.splice(i + 1, 1);
      }
    }

    while (nums.length < 4) {
      nums.push(0);
    }

    return { result: nums, rowScore };
  }

  _rotateCW(matrix) {
    const result = Game.getEmptyBoard();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        result[c][3 - r] = matrix[r][c];
      }
    }

    return result;
  }

  _rotateCCW(matrix) {
    const result = Game.getEmptyBoard();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        result[3 - c][r] = matrix[r][c];
      }
    }

    return result;
  }

  _applySlide(state, direction) {
    let matrix = state.map((row) => [...row]);

    if (direction === 'right') {
      matrix = matrix.map((row) => [...row].reverse());
    } else if (direction === 'up') {
      matrix = this._rotateCCW(matrix);
    } else if (direction === 'down') {
      matrix = this._rotateCW(matrix);
    }

    let moveScore = 0;

    matrix = matrix.map((row) => {
      const { result, rowScore } = this._slideRowLeft(row);

      moveScore += rowScore;

      return result;
    });

    if (direction === 'right') {
      matrix = matrix.map((row) => [...row].reverse());
    } else if (direction === 'up') {
      matrix = this._rotateCW(matrix);
    } else if (direction === 'down') {
      matrix = this._rotateCCW(matrix);
    }

    return { matrix, moveScore };
  }

  _hasAvailableMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }

        if (r < 3 && this.state[r][c] === this.state[r + 1][c]) {
          return true;
        }

        if (c < 3 && this.state[r][c] === this.state[r][c + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  _hasChanged(newState) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] !== newState[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  _move(direction) {
    if (this.status !== Game.StatusList.PLAYING) {
      return false;
    }

    const { matrix, moveScore } = this._applySlide(this.state, direction);

    if (!this._hasChanged(matrix)) {
      return false;
    }

    this.state = matrix;
    this.score += moveScore;

    this.state = Game.makeRandomNumberOnBoard(this.state, 1);

    if (this.state.flat().includes(2048)) {
      this.status = Game.StatusList.WIN;
      this._renderView();
      this.msgWin.classList.remove('hidden');

      return true;
    }

    if (!this._hasAvailableMoves()) {
      this.status = Game.StatusList.LOSE;
      this._renderView();
      this.msgLose.classList.remove('hidden');

      return true;
    }

    this._renderView();

    return true;
  }

  _renderView() {
    const flat = this.state.flat();

    this.cells.forEach((cell, i) => {
      const value = flat[i];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
    });

    if (this.scoreEl) {
      this.scoreEl.textContent = this.score;
    }
  }

  _activateRestartButton() {
    if (!this.buttonStart) {
      return;
    }
    this.buttonStart.textContent = 'Restart';
    this.buttonStart.classList.replace('start', 'restart');
  }

  _hideMessages() {
    this.msgWin?.classList.add('hidden');
    this.msgLose?.classList.add('hidden');
  }

  _setupListeners() {
    const keyMap = {
      ArrowLeft: () => this.moveLeft(),
      ArrowRight: () => this.moveRight(),
      ArrowUp: () => this.moveUp(),
      ArrowDown: () => this.moveDown(),
    };

    document.addEventListener('keydown', (e) => {
      if (e.key in keyMap) {
        e.preventDefault();
        keyMap[e.key]();
      }
    });

    if (this.buttonStart) {
      this.buttonStart.addEventListener('click', () => {
        if (this.status === Game.StatusList.IDLE) {
          this.start();
        } else {
          this.restart();
        }
      });
    }
  }
}

export default Game;

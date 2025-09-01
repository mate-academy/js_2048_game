/* eslint-disable function-paren-newline */
'use strict';

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

  static length = 4;
  constructor(field, startMsg, loseMsg, winMsg, scoreGame, info) {
    // eslint-disable-next-line no-console
    this.initialState = this.createInitialState();
    this.sum = 0;
    this.score = 0;
    this.lastGeneratedCell = {};
    this.startBtn = null;

    this.field = field;
    this.startMsg = startMsg;
    this.loseMsg = loseMsg;
    this.winMsg = winMsg;
    this.scoreGame = scoreGame;
    this.info = info;
  }

  moveLeft() {
    if (this.checkHorizontalMerging('left')) {
      let localSum = 0;

      for (let r = 0; r < Game.length; r++) {
        const row = this.filterZero(this.initialState[r]);
        const { arr, sum } = this.slideValue(row);

        localSum += sum;
        this.initialState[r] = arr;
      }

      if (localSum > 0) {
        this.moveScore(localSum);
      }

      this.setNewRandomNum();
      this.getState();
      this.scoreGame.textContent = this.getScore();
      this.checkStatus();
    }
  }

  moveRight() {
    if (this.checkHorizontalMerging('rigth')) {
      let localSum = 0;

      for (let r = 0; r < Game.length; r++) {
        const row = this.filterZero(this.initialState[r]).reverse();
        const { arr, sum } = this.slideValue(row);

        localSum += sum;
        this.initialState[r] = arr.reverse();
      }

      if (localSum > 0) {
        this.moveScore(localSum);
      }

      this.setNewRandomNum();
      this.getState();
      this.scoreGame.textContent = this.getScore();
      this.checkStatus();
    }
  }

  moveUp() {
    if (this.checkVerticalMerging('up')) {
      let localSum = 0;

      for (let c = 0; c < Game.length; c++) {
        let col = [
          this.initialState[0][c],
          this.initialState[1][c],
          this.initialState[2][c],
          this.initialState[3][c],
        ];

        col = this.filterZero(col);

        const { arr, sum } = this.slideValue(col);

        localSum += sum;

        for (let r = 0; r < Game.length; r++) {
          this.initialState[r][c] = arr[r];
        }
      }

      if (localSum > 0) {
        this.moveScore(localSum);
      }

      this.setNewRandomNum();
      this.getState();
      this.scoreGame.textContent = this.getScore();
      this.checkStatus();
    }
  }

  moveDown() {
    if (this.checkVerticalMerging('down')) {
      let localSum = 0;

      for (let c = 0; c < Game.length; c++) {
        let col = [
          this.initialState[0][c],
          this.initialState[1][c],
          this.initialState[2][c],
          this.initialState[3][c],
        ].reverse();

        col = this.filterZero(col);

        const { arr, sum } = this.slideValue(col);

        localSum += sum;
        arr.reverse();

        for (let r = 0; r < Game.length; r++) {
          this.initialState[r][c] = arr[r];
        }
      }

      if (localSum > 0) {
        this.moveScore(localSum);
      }

      this.setNewRandomNum();
      this.getState();
      this.scoreGame.textContent = this.getScore();
      this.checkStatus();
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
    const cells = document.querySelectorAll('.field-cell');

    for (let i = 0; i < cells.length; i++) {
      const indexRow = Math.floor(i / Game.length);
      const indexCol = i - indexRow * Game.length;
      const value = this.initialState[indexRow][indexCol];

      if (!value) {
        cells[i].textContent = '';
      } else {
        cells[i].textContent = value;
      }

      cells[i].classList = ['field-cell'];

      if (value !== 0) {
        cells[i].classList.add(`field-cell--${value}`);
      }

      if (
        this.lastGeneratedCell &&
        this.lastGeneratedCell.row === indexRow &&
        this.lastGeneratedCell.col === indexCol
      ) {
        cells[i].classList.add('new-cell');
      }
    }
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
    if (this.initialState.flat().some((value) => value === 2048)) {
      return 'win';
    }

    if (
      !this.checkHorizontalMerging('left') &&
      !this.checkHorizontalMerging('right') &&
      !this.checkVerticalMerging('up') &&
      !this.checkVerticalMerging('down')
    ) {
      return 'lose';
    }
  }

  start() {
    const begin = confirm('Are you ready to start a new game?');
    let initialNums;

    if (begin) {
      initialNums = this.getInitialNums();
      this.initialState = this.setInitialState(initialNums);
      this.getState();
      this.startMsg.classList.add('hidden');

      return true;
    }

    return false;
  }

  restart() {
    const restart = confirm(
      'Are you sure you want to start a new game? All progress will be lost!',
    );
    let initialNums;

    if (restart) {
      this.score = 0;
      this.scoreGame.textContent = this.score;
      initialNums = this.getInitialNums();
      this.initialState = this.setInitialState(initialNums);
      this.getState();
      this.getScore();

      return true;
    }

    return null;
  }

  // Add your own methods here
  createInitialState() {
    return [...Array(Game.length)].map(() => Array(Game.length).fill(0));
  }

  startNewGame() {
    this.initialState = this.createInitialState();

    this.score = 0;
    this.scoreGame.textContent = this.score;

    this.startMsg.classList.add('hidden');
    this.loseMsg.classList.add('hidden');
    this.winMsg.classList.add('hidden');

    const initialNums = this.getInitialNums();

    this.initialState = this.setInitialState(initialNums);
    this.getState();
  }

  checkHorizontalMerging(direction) {
    let allowed = false;

    for (const row of this.initialState) {
      for (let i = 0; i < row.length - 1; i++) {
        const currentCell = row[i];
        const nextCell = row[i + 1];

        if (currentCell !== 0 && currentCell === nextCell) {
          allowed = true;
        }
      }

      const result = this.filterZero(row);

      if (direction === 'left') {
        while (result.length < Game.length) {
          result.push(0);
        }
      }

      if (direction === 'rigth') {
        while (result.length < Game.length) {
          result.unshift(0);
        }
      }

      for (let i = 0; i < row.length; i++) {
        if (row[i] !== result[i]) {
          allowed = true;
          break;
        }
      }
    }

    return allowed;
  }

  checkVerticalMerging(direction) {
    let allowed = false;

    for (let c = 0; c < Game.length; c++) {
      const col = [
        this.initialState[0][c],
        this.initialState[1][c],
        this.initialState[2][c],
        this.initialState[3][c],
      ];

      for (let i = 0; i < col.length - 1; i++) {
        const currentCell = col[i];
        const nextCell = col[i + 1];

        if (currentCell !== 0 && currentCell === nextCell) {
          allowed = true;
        }
      }

      const result = this.filterZero(col);

      if (direction === 'up') {
        while (result.length < Game.length) {
          result.push(0);
        }
      }

      if (direction === 'down') {
        while (result.length < Game.length) {
          result.unshift(0);
        }
      }

      for (let i = 0; i < col.length; i++) {
        if (col[i] !== result[i]) {
          allowed = true;
          break;
        }
      }
    }

    return allowed;
  }

  getInitialNums() {
    const nums = [];

    while (nums.length < 2) {
      const randomNum = this.getValue();

      nums.push(randomNum);
    }

    return nums;
  }

  getValue() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  setInitialState(arr) {
    const arrNums = [...arr];
    const state = new Array(4).fill([]).map(() => Array(4).fill(0));

    while (arrNums.length !== 0) {
      for (let i = 0; i < arrNums.length; i++) {
        const rowIdx = this.getRandoNum();
        const colIdx = this.getRandoNum();

        if (state[rowIdx][colIdx] === 0) {
          state[rowIdx].splice(colIdx, 1, arrNums[i]);
          arrNums.splice(i, 1);
        }
      }
    }

    return state;
  }

  getRandoNum() {
    return Math.floor(Math.random() * Game.length);
  }

  slideValue(arr) {
    let localSum = 0;
    let dublicatedArr = arr;

    for (let i = 0; i < dublicatedArr.length - 1; i++) {
      if (dublicatedArr[i] === dublicatedArr[i + 1]) {
        dublicatedArr[i] += dublicatedArr[i + 1];
        this.score += dublicatedArr[i];
        localSum += dublicatedArr[i];
        this.sum = dublicatedArr[i];
        dublicatedArr[i + 1] = 0;

        this.getScore();
        this.getStatus();
      }
    }

    dublicatedArr = this.filterZero(dublicatedArr);

    while (dublicatedArr.length < Game.length) {
      dublicatedArr.push(0);
    }

    return { arr: dublicatedArr, sum: localSum };
  }

  filterZero(arr) {
    return arr.filter((num) => num !== 0);
  }

  hasEmptyCells() {
    return this.initialState.flat().every((value) => value > 0);
  }

  setNewRandomNum() {
    const value = this.getValue();
    let rowIdx = this.getRandoNum();
    let colIdx = this.getRandoNum();

    while (true) {
      if (this.hasEmptyCells()) {
        this.getStatus();
        break;
      }

      if (this.initialState[rowIdx][colIdx] === 0) {
        this.initialState[rowIdx].splice(colIdx, 1, value);
        this.lastGeneratedCell = { row: rowIdx, col: colIdx };
        break;
      } else {
        rowIdx = this.getRandoNum();
        colIdx = this.getRandoNum();
      }
    }

    this.getState();
  }

  checkStatus() {
    const str = this.getStatus();

    if (str === 'win' || str === 'lose') {
      const msgEl = str === 'win' ? this.winMsg : this.loseMsg;

      msgEl.classList.remove('hidden');
      this.field.style.position = 'relative';
      this.field.tBodies[0].append(this.createModal(str));
    }
  }

  createModal(str) {
    const overlay = document.createElement('div');
    const overlayContent = document.createElement('div');
    const paragraf = document.createElement('p');

    overlay.className = 'overlay';
    overlayContent.className = 'overlay-content';
    paragraf.className = 'modal-message';

    let btnText = '';

    if (str === 'lose') {
      paragraf.textContent = 'Game over!';
      btnText = 'Try again';
    } else {
      paragraf.textContent = 'You win!';
      btnText = 'New game';
    }

    const btn = document.createElement('button');

    btn.className = 'start-game';
    btn.textContent = btnText;

    overlayContent.append(paragraf, btn);
    overlay.append(overlayContent);

    btn.addEventListener('click', () => {
      this.startNewGame();
      overlay.remove();
    });

    this.startBtn = btn;

    return overlay;
  }

  moveScore(num) {
    const scoreOverlayElem = document.createElement('span');

    this.info.style.position = 'relative';
    scoreOverlayElem.className = 'score-overlay';
    scoreOverlayElem.textContent = `+${num}`;
    this.scoreGame.after(scoreOverlayElem);

    const disappear = [
      { opacity: 0.8, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(-60px)' },
    ];

    const disappearTiming = {
      duration: 1000,
      iterations: 1,
      easing: 'ease-in',
    };

    const animation = scoreOverlayElem.animate(disappear, disappearTiming);

    animation.onfinish = () => {
      scoreOverlayElem.remove();
    };
  }
}

module.exports = Game;

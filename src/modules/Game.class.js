'use strict';

const BUCKET_ID = '5JGVQVX4yPRwAYL5V8n52V';
const RECORD_KEY = 'world_record';

function getRecord() {
  return fetch(`https://kvdb.io/${BUCKET_ID}/${RECORD_KEY}`)
    .then((response) => (response.ok ? response.text() : '0'))
    .then(Number);
}

function saveRecord(score) {
  return fetch(`https://kvdb.io/${BUCKET_ID}/${RECORD_KEY}`, {
    method: 'POST',
    body: String(score),
  })
    .then((response) => response.ok)
    .catch(() => false);
}

class Game {
  static StatusList = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(initialState) {
    this.state = initialState
      ? initialState.map((row) => [...row])
      : Game.getEmptyBoard();

    this.btn = document.querySelector('.button');
    this.cells = Array.from(document.querySelectorAll('.field-cell'));
    this.scoreEl = document.querySelector('.game-score');
    this.recordEl = document.querySelector('.game-record');
    this.msgStart = document.querySelector('.message-start');
    this.msgWin = document.querySelector('.message-win');
    this.msgLose = document.querySelector('.message-lose');

    getRecord().then((r) => this.setRecord(r));

    this.setupListeners();
  }

  static getEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  static spawnTiles(board, amountToAdd = 1) {
    const newBoard = board.map((row) => [...row]);

    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (newBoard[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    for (let i = 0; i < amountToAdd && emptyCells.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);

      const { row, col } = emptyCells.splice(randomIndex, 1)[0];

      newBoard[row][col] = Math.random() < 0.1 ? 4 : 2;
    }

    return newBoard;
  }

  static slideRowLeft(row) {
    const tiles = row.filter((val) => val !== 0);
    let rowScore = 0;

    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] === tiles[i + 1]) {
        tiles[i] *= 2;
        rowScore += tiles[i];
        tiles.splice(i + 1, 1);
      }
    }

    while (tiles.length < 4) {
      tiles.push(0);
    }

    return { result: tiles, rowScore };
  }

  static transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  static applySlide(board, direction) {
    const isVertical = direction === 'up' || direction === 'down';
    const isReversed = direction === 'right' || direction === 'down';

    let matrix = board.map((row) => [...row]);

    if (isVertical) {
      matrix = Game.transpose(matrix);
    }

    if (isReversed) {
      matrix = matrix.map((row) => [...row].reverse());
    }

    let moveScore = 0;

    matrix = matrix.map((row) => {
      const { result, rowScore } = Game.slideRowLeft(row);

      moveScore += rowScore;

      return result;
    });

    if (isReversed) {
      matrix = matrix.map((row) => [...row].reverse());
    }

    if (isVertical) {
      matrix = Game.transpose(matrix);
    }

    return { matrix, moveScore };
  }

  status = Game.StatusList.IDLE;
  score = 0;
  recordScore = 0;

  lastDirection = null;

  start() {
    this.initNewGame();
    this.msgStart.classList.add('hidden');
    this.activateRestartButton();
  }

  restart() {
    this.initNewGame();
  }

  initNewGame() {
    this.status = Game.StatusList.PLAYING;
    this.score = 0;
    this.lastDirection = null;
    this.state = Game.spawnTiles(Game.getEmptyBoard(), 2);

    this.hideMessages();
    this.renderView();
  }

  setRecord(value) {
    this.recordScore = value;
    this.recordEl.textContent = value;
  }

  tryUpdateRecord() {
    if (this.score > this.recordScore) {
      this.setRecord(this.score);
      saveRecord(this.score);
    }
  }

  move(direction) {
    if (this.status !== Game.StatusList.PLAYING) {
      return;
    }

    const { matrix, moveScore } = Game.applySlide(this.state, direction);

    if (!this.isBoardChanged(matrix)) {
      return;
    }

    this.lastDirection = direction;
    this.state = Game.spawnTiles(matrix, 1);
    this.score += moveScore;

    if (this.state.some((row) => row.includes(2048))) {
      this.status = Game.StatusList.WIN;
      this.tryUpdateRecord();
      this.renderView();
      this.msgWin.classList.remove('hidden');

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = Game.StatusList.LOSE;
      this.tryUpdateRecord();
      this.renderView();
      this.msgLose.classList.remove('hidden');

      return;
    }

    this.renderView();
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  isBoardChanged(newState) {
    const checkRow = (row, r) => row.some((v, c) => v !== newState[r][c]);

    return this.state.some(checkRow);
  }

  renderView() {
    this.renderBoard();

    const prevScore = Number(this.scoreEl.textContent);

    this.scoreEl.textContent = this.score;

    if (this.score > prevScore) {
      const infoEl = this.scoreEl.parentElement;

      infoEl.classList.remove('pop');
      void infoEl.offsetWidth;
      infoEl.classList.add('pop');
    }
  }

  renderBoard() {
    const flatBoard = this.state.flat();

    this.cells.forEach((cell, index) => {
      const newValue = flatBoard[index];
      const prevValue = Number(cell.textContent) || 0;

      cell.className = 'field-cell';

      if (newValue === 0) {
        cell.textContent = '';

        return;
      }

      cell.textContent = newValue;
      cell.classList.add(`field-cell--${newValue}`);

      if (newValue !== prevValue) {
        void cell.offsetWidth;

        const animationClass = `slide-${this.lastDirection ?? 'pop'}`;

        cell.classList.add(animationClass);
      }
    });
  }

  activateRestartButton() {
    this.btn.textContent = 'Restart';
    this.btn.classList.replace('start', 'restart');
  }

  hideMessages() {
    this.msgWin.classList.add('hidden');
    this.msgLose.classList.add('hidden');
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.move('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.move('down');
          break;
      }
    });

    this.btn.addEventListener('click', () => {
      if (this.status === Game.StatusList.IDLE) {
        this.start();
      } else {
        this.restart();
      }
    });

    let startX = 0;
    let startY = 0;

    document.addEventListener(
      'touchstart',
      (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
      },
      { passive: true },
    );

    document.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;

      if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) {
        return;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        this.move(dx > 0 ? 'right' : 'left');
      } else {
        this.move(dy > 0 ? 'down' : 'up');
      }
    });
  }
}

export default Game;

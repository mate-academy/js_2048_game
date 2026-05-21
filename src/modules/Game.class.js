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

    this._btn = document.querySelector('.button');
    this._cells = Array.from(document.querySelectorAll('.field-cell'));
    this._scoreEl = document.querySelector('.game-score');
    this._recordEl = document.querySelector('.game-record');
    this._msgStart = document.querySelector('.message-start');
    this._msgWin = document.querySelector('.message-win');
    this._msgLose = document.querySelector('.message-lose');

    getRecord().then((r) => this._setRecord(r));

    this.setupListeners();
  }

  static getEmptyBoard() {
    return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
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

  static _slideRowLeft(row) {
    const tiles = row.filter(Boolean);
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

  static _transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  static _applySlide(board, direction) {
    const isVertical = direction === 'up' || direction === 'down';
    const isReversed = direction === 'right' || direction === 'down';

    let matrix = board.map((row) => [...row]);

    if (isVertical) {
      matrix = Game._transpose(matrix);
    }

    if (isReversed) {
      matrix = matrix.map((row) => [...row].reverse());
    }

    let moveScore = 0;

    matrix = matrix.map((row) => {
      const { result, rowScore } = Game._slideRowLeft(row);

      moveScore += rowScore;

      return result;
    });

    if (isReversed) {
      matrix = matrix.map((row) => [...row].reverse());
    }

    if (isVertical) {
      matrix = Game._transpose(matrix);
    }

    return { matrix, moveScore };
  }

  status = Game.StatusList.IDLE;
  score = 0;
  recordScore = 0;

  _lastDirection = null;

  start() {
    this._initNewGame();
    this._msgStart.classList.add('hidden');
    this._activateRestartButton();
  }

  restart() {
    this._initNewGame();
  }

  _initNewGame() {
    this.status = Game.StatusList.PLAYING;
    this.score = 0;
    this._lastDirection = null;
    this.state = Game.spawnTiles(Game.getEmptyBoard(), 2);

    this._hideMessages();
    this._renderView();
  }

  _setRecord(value) {
    this.recordScore = value;
    this._recordEl.textContent = value;
  }

  _tryUpdateRecord() {
    if (this.score > this.recordScore) {
      this._setRecord(this.score);
      saveRecord(this.score);
    }
  }

  _move(direction) {
    if (this.status !== Game.StatusList.PLAYING) {
      return;
    }

    const { matrix, moveScore } = Game._applySlide(this.state, direction);

    if (!this._isBoardChanged(matrix)) {
      return;
    }

    this._lastDirection = direction;
    this.state = Game.spawnTiles(matrix, 1);
    this.score += moveScore;

    if (this.state.some((row) => row.includes(2048))) {
      this.status = Game.StatusList.WIN;
      this._tryUpdateRecord();
      this._renderView();
      this._msgWin.classList.remove('hidden');

      return;
    }

    if (!this._hasAvailableMoves()) {
      this.status = Game.StatusList.LOSE;
      this._tryUpdateRecord();
      this._renderView();
      this._msgLose.classList.remove('hidden');

      return;
    }

    this._renderView();
  }

  _hasAvailableMoves() {
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

  _isBoardChanged(newState) {
    const checkRow = (row, r) => row.some((v, c) => v !== newState[r][c]);

    return this.state.some(checkRow);
  }

  _renderView() {
    this._renderBoard();
    this._scoreEl.textContent = this.score;
  }

  _renderBoard() {
    const flatBoard = this.state.flat();

    this._cells.forEach((cell, index) => {
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

        const animationClass = `slide-${this._lastDirection ?? 'pop'}`;

        cell.classList.add(animationClass);
      }
    });
  }

  _activateRestartButton() {
    this._btn.textContent = 'Restart';
    this._btn.classList.replace('start', 'restart');
  }

  _hideMessages() {
    this._msgWin.classList.add('hidden');
    this._msgLose.classList.add('hidden');
  }

  setupListeners() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this._move('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          this._move('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          this._move('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          this._move('down');
          break;
      }
    });

    this._btn.addEventListener('click', () => {
      if (this.status === Game.StatusList.IDLE) {
        this.start();
      } else {
        this.restart();
      }
    });
  }
}

export default Game;

'use strict';

// ─── KV-store helpers ────────────────────────────────────────────────────────

const BUCKET_ID = '5JGVQVX4yPRwAYL5V8n52V';
const RECORD_KEY = 'world_record';

function getRecord() {
  return fetch(`https://kvdb.io/${BUCKET_ID}/${RECORD_KEY}`)
    .then((res) => (res.ok ? res.text() : '0'))
    .then(Number);
}

function saveRecord(score) {
  return fetch(`https://kvdb.io/${BUCKET_ID}/${RECORD_KEY}`, {
    method: 'POST',
    body: String(score),
  })
    .then((res) => res.ok)
    .catch(() => false);
}

// ─── Game ────────────────────────────────────────────────────────────────────

class Game {
  static StatusList = Object.freeze({
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  });

  // ── Board helpers (static, pure) ──────────────────────────────────────────

  static getEmptyBoard() {
    return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  }

  /**
   * Повертає копію дошки з `amountToAdd` новими тайлами (90% → 2, 10% → 4).
   * Якщо вільних клітинок не вистачає — додає скільки може.
   */
  static spawnTiles(board, amountToAdd = 1) {
    const next = board.map((row) => [...row]);

    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (next[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    for (let i = 0; i < amountToAdd && empty.length > 0; i++) {
      const idx = Math.floor(Math.random() * empty.length);
      const { r, c } = empty.splice(idx, 1)[0];

      next[r][c] = Math.random() < 0.1 ? 4 : 2;
    }

    return next;
  }

  // ── Slide / rotate helpers (static, pure) ─────────────────────────────────

  /**
   * Зсуває один рядок вліво: стискає нулі, об'єднує однакові сусіди,
   * доповнює нулями справа.
   * Повертає { result, rowScore }.
   */
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

  /**
   * Транспонує матрицю 4×4.
   * Використовується для перетворення up/down у left (без rotation trick).
   */
  static _transpose(matrix) {
    return matrix[0].map((_, c) => matrix.map((row) => row[c]));
  }

  /**
   * Застосовує зсув у заданому напрямку.
   * Повертає { matrix, moveScore }.
   *
   * Стратегія:
   *  left  — зсуваємо рядки вліво напряму
   *  right — реверсуємо рядки → left → реверсуємо назад
   *  up    — транспонуємо → left → транспонуємо назад
   *  down  — транспонуємо + реверс → left → реверс + транспонуємо назад
   */
  static _applySlide(state, direction) {
    const isVertical = direction === 'up' || direction === 'down';
    const isReversed = direction === 'right' || direction === 'down';

    let matrix = state.map((row) => [...row]);

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

  // ── Instance ───────────────────────────────────────────────────────────────

  status = Game.StatusList.IDLE;
  score = 0;
  recordScore = 0;

  /** Напрямок останнього ходу — використовується для CSS-анімації */
  _lastDirection = null;

  constructor(initialState) {
    this.state = initialState
      ? initialState.map((row) => [...row])
      : Game.getEmptyBoard();

    // DOM refs
    this._btn = document.querySelector('.button');
    this._cells = Array.from(document.querySelectorAll('.field-cell'));
    this._scoreEl = document.querySelector('.game-score');
    this._recordEl = document.querySelector('.game-record');
    this._msgStart = document.querySelector('.message-start');
    this._msgWin = document.querySelector('.message-win');
    this._msgLose = document.querySelector('.message-lose');

    getRecord()
      .then((record) => this._setRecord(record))
      .catch(() => this._setRecord(0));

    this._setupListeners();
  }

  // ── Public API ─────────────────────────────────────────────────────────────

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

  /**
   * Оновлює локальний рекорд і DOM.
   * Зберігає на сервер тільки якщо це дійсно новий рекорд.
   */
  _setRecord(value) {
    this.recordScore = value;
    this._recordEl.textContent = value;
  }

  _tryUpdateRecord() {
    if (this.score > this.recordScore) {
      this._setRecord(this.score);
      saveRecord(this.score); // fire-and-forget
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

    if (this._hasWon()) {
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

  _hasWon() {
    return this.state.some((row) => row.includes(2048));
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

  _isBoardChanged(newState) {
    const checkRow = (row, r) => row.some((v, c) => v !== newState[r][c]);

    return this.state.some(checkRow);
  }

  _renderView() {
    this._renderBoard();
    this._scoreEl.textContent = this.score;
  }

  _renderBoard() {
    const flat = this.state.flat();

    this._cells.forEach((cell, i) => {
      const value = flat[i];
      const prevValue = Number(cell.textContent) || 0;

      cell.className = 'field-cell';

      if (value === 0) {
        cell.textContent = '';

        return;
      }

      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);

      // Анімація тільки для тайлів що змінились
      if (value !== prevValue) {
        // void offsetWidth форсує reflow, щоб браузер "побачив" скинутий клас
        // перед тим як додати анімаційний —
        // без цього анімація не перезапускається
        void cell.offsetWidth;
        cell.classList.add(`slide-${this._lastDirection ?? 'pop'}`);
      }
    });
  }

  // ── UI helpers ─────────────────────────────────────────────────────────────

  _activateRestartButton() {
    this._btn.textContent = 'Restart';
    this._btn.classList.replace('start', 'restart');
  }

  _hideMessages() {
    this._msgWin.classList.add('hidden');
    this._msgLose.classList.add('hidden');
  }

  _setupListeners() {
    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.moveLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.moveRight();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.moveUp();
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.moveDown();
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

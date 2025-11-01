/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable max-len */
'use strict';

export const GAME_STATUS = {
  idle: 'idle',
  playing: 'playing',
  lose: 'lose',
  win: 'win',
};

const TABLE_SIZE = 4;
const ANIM_DURATION = 120;

export default class Game {
  gameStatus = GAME_STATUS.idle;
  gameTable = [[]];
  score = 0;
  prevTable = null;

  savePrevState() {
    this.prevTable = this.gameTable.map((row) => [...row]);
  }

  /**
   * @param {number[][]} initialState
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   */
  constructor(initialState) {
    let initialStateValid = true;

    if (initialState) {
      for (const row of initialState) {
        row.map((num) => {
          if (this.isPowerOfTwo(num) === false) {
            console.error(
              'All numbers in initialState must be power of two or zero',
            );
            initialStateValid = false;
          }
        });
      }

      if (initialStateValid) {
        this.gameTable = initialState.map((row) => [...row]);
      } else {
        this.createEmptyTable();
      }
    } else {
      this.createEmptyTable();
    }
  }

  async animateMove(direction) {
    if (!this.prevTable) {
      return;
    }

    const field = document.querySelector('.game-field');

    if (!field) {
      this.prevTable = null;

      return;
    }

    const rows = field.querySelectorAll('.field-row');

    if (rows.length === 0) {
      this.prevTable = null;

      return;
    }

    // helper to map row moves (left/right)
    const mapRowMoves = (oldRow, newRow, rowIdx, dir) => {
      const sources = [];
      const targets = [];

      const forward = dir === 'left';

      for (let c = 0; c < oldRow.length; c++) {
        if (oldRow[c] !== 0) {
          sources.push({ col: c, v: oldRow[c] });
        }
      }

      for (let c = 0; c < newRow.length; c++) {
        if (newRow[c] !== 0) {
          targets.push({ col: c, v: newRow[c] });
        }
      }

      // if direction is right, match from right/left
      const sList = forward ? sources : sources.slice().reverse();
      const tList = forward ? targets : targets.slice().reverse();

      const moves = [];

      for (let k = 0; k < sList.length; k++) {
        const src = sList[k];
        const tgt = tList[Math.min(k, tList.length - 1)];

        if (tgt) {
          moves.push({
            fromRow: rowIdx,
            fromCol: src.col,
            toRow: rowIdx,
            toCol: tgt.col,
          });
        }
      }

      return moves;
    };

    // map moves up/down
    const mapColMoves = (oldCol, newCol, colIdx, dir) => {
      const sources = [];
      const targets = [];

      for (let r = 0; r < oldCol.length; r++) {
        if (oldCol[r] !== 0) {
          sources.push({ row: r, v: oldCol[r] });
        }
      }

      for (let r = 0; r < newCol.length; r++) {
        if (newCol[r] !== 0) {
          targets.push({ row: r, v: newCol[r] });
        }
      }

      const forward = dir === 'up';
      const sList = forward ? sources : sources.slice().reverse();
      const tList = forward ? targets : targets.slice().reverse();

      const moves = [];

      for (let k = 0; k < sList.length; k++) {
        const src = sList[k];
        const tgt = tList[Math.min(k, tList.length - 1)];

        if (tgt) {
          moves.push({
            fromRow: src.row,
            fromCol: colIdx,
            toRow: tgt.row,
            toCol: colIdx,
          });
        }
      }

      return moves;
    };

    // build moves list from prevTable ti gameTable
    const moves = [];

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < TABLE_SIZE; r++) {
        moves.push(...mapRowMoves(this.prevTable[r], this.gameTable[r], r, direction));
      }
    } else {
      // up / down
      for (let c = 0; c < TABLE_SIZE; c++) {
        const oldCol = [];
        const newCol = [];

        for (let r = 0; r < TABLE_SIZE; r++) {
          oldCol.push(this.prevTable[r][c] ?? 0);
          newCol.push(this.gameTable[r][c] ?? 0);
        }
        moves.push(...mapColMoves(oldCol, newCol, c, direction));
      }
    }

    if (moves.length === 0) {
      this.render();
      this.prevTable = null;

      return;
    }

    // ensure field is posiioned for absolute overlay
    const prevFieldPosition = field.style.position;

    if (getComputedStyle(field).position === 'static') {
      field.style.position = 'relative';
    }

    const fieldRect = field.getBoundingClientRect();


    // create overlay container
    const overlay = document.createElement('div');

    overlay.className = 'move-overlay';
    overlay.style.position = 'absolute';
    overlay.style.left = `${fieldRect.left}px`;
    overlay.style.top = `${fieldRect.top}px`;
    overlay.style.width = `${fieldRect.width}px`;
    overlay.style.height = `${fieldRect.height}px`;
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '1000';
    document.body.append(overlay);


    // create clones from current dom
    const clones = moves.map((m) => {
      const rowEl = rows[m.fromRow];

      if (!rowEl) {
        return null;
      }

      const cellEls = rowEl.querySelectorAll('.field-cell');
      const sourceEl = cellEls[m.fromCol];

      if (!sourceEl) {
        return null;
      }

      const srcRect = sourceEl.getBoundingClientRect();
      const clone = sourceEl.cloneNode(true);

      clone.classList.add('tile-fly');
      clone.style.position = 'absolute';
      clone.style.left = `${srcRect.left - fieldRect.left}px`;
      clone.style.top = `${srcRect.top - fieldRect.top}px`;
      clone.style.width = `${srcRect.width}px`;
      clone.style.height = `${srcRect.height}px`;
      clone.style.margin = '0';
      clone.style.transform = 'translate(0, 0)';
      clone.style.transition = `transform ${ANIM_DURATION}ms ease`;
      overlay.appendChild(clone);

      return {
        el: clone,
        fromRect: srcRect,
        move: m,
      };
    }).filter(Boolean);

    // now update dom to final state
    this.render();

    // trigger animation next frame
    await new Promise((resolve) => {
      // allow browser to paint render() first
      requestAnimationFrame(() => {
        // compute target rects and animate clones
        clones.forEach((c) => {
          const targetRowEl = field.querySelectorAll('.field-row')[c.move.toRow];

          if (!targetRowEl) {
            return;
          }

          const targetCellEls = targetRowEl.querySelectorAll('.field-cell');
          const targetEl = targetCellEls[c.move.toCol];

          if (!targetEl) {
            return;
          }

          const tgtRect = targetEl.getBoundingClientRect();

          const dx = tgtRect.left - c.fromRect.left;
          const dy = tgtRect.top - c.fromRect.top;

          c.el.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        // wait animation duration
        setTimeout(() => {
          // clean up
          overlay.remove();
          // restore original position style if we changed it

          if (prevFieldPosition === '') {
            field.style.position = '';
          } else {
            field.style.position = prevFieldPosition;
          }
          resolve();
        }, ANIM_DURATION + 20);
      });
    });

    this.prevTable = null;
  }

  createCell() {
    this.updateScore();

    const emptyCels = [];

    for (let i = 0; i < TABLE_SIZE; i++) {
      for (let j = 0; j < TABLE_SIZE; j++) {
        if (this.gameTable[i][j] === 0) {
          emptyCels.push({ row: i, cell: j });
        } else if (this.gameTable[i][j] === 2048) {
          this.render();
          this.addScore(2048);
          this.gameWin();

          return;
        }
      }
    }

    if (emptyCels.length === 0) {
      if (this.isLose()) {
        this.gameLose();
      }

      return;
    }

    let numberToAdd = 2;

    const randomNum = Math.floor(Math.random() * emptyCels.length);
    const randomValue = Math.floor(Math.random() * 10);

    if (randomValue === 9) {// created cells with num 4 (10% chance of this event);
      numberToAdd = 4;
    }

    this.gameTable[emptyCels[randomNum].row][emptyCels[randomNum].cell] =
      numberToAdd;
    this.render();
  }

  async moveLeft() {
    this.savePrevState();

    for (let i = 0; i < TABLE_SIZE; i++) {
      const row = this.gameTable[i].filter((n) => n !== 0);

      for (let k = 0; k < row.length - 1; k++) {
        if (row[k] === row[k + 1]) {
          row[k] *= 2;
          this.addScore(row[k]);
          row.splice(k + 1, 1);
        }
      }

      while (row.length < TABLE_SIZE) {
        row.push(0);
      }

      this.gameTable[i] = row;
    }
    await this.animateMove('left');
    this.createCell();
  }

  async moveRight() {
    this.savePrevState();

    for (let i = 0; i < TABLE_SIZE; i++) {
      const row = this.gameTable[i].filter((n) => n !== 0);

      for (let k = row.length - 1; k > 0; k--) {
        if (row[k] === row[k - 1]) {
          row[k] *= 2;
          this.addScore(row[k]);
          row.splice(k - 1, 1);
        }
      }

      while (row.length < TABLE_SIZE) {
        row.unshift(0);
      }

      this.gameTable[i] = row;
    }
    await this.animateMove('right');
    this.createCell();
  }

  async moveUp() {
    this.savePrevState();

    for (let i = 0; i < TABLE_SIZE; i++) {
      const col = [];

      for (let r = 0; r < TABLE_SIZE; r++) {
        if (this.gameTable[r][i] !== 0) {
          col.push(this.gameTable[r][i]);
        }
      }

      for (let k = 0; k < col.length - 1; k++) {
        if (col[k] === col[k + 1]) {
          col[k] *= 2;
          this.addScore(col[k]);
          col.splice(k + 1, 1);
        }
      }

      while (col.length < TABLE_SIZE) {
        col.push(0);
      }

      for (let r = 0; r < TABLE_SIZE; r++) {
        this.gameTable[r][i] = col[r];
      }
    }
    await this.animateMove('up');
    this.createCell();
  }

  async moveDown() {
    this.savePrevState();

    for (let i = 0; i < TABLE_SIZE; i++) {
      const col = [];

      for (let r = 0; r < TABLE_SIZE; r++) {
        if (this.gameTable[r][i] !== 0) {
          col.push(this.gameTable[r][i]);
        }
      }

      for (let k = col.length - 1; k > 0; k--) {
        if (col[k] === col[k - 1]) {
          col[k] *= 2;
          this.addScore(col[k]);
          col.splice(k - 1, 1);
        }
      }

      while (col.length < TABLE_SIZE) {
        col.unshift(0);
      }

      for (let r = 0; r < TABLE_SIZE; r++) {
        this.gameTable[r][i] = col[r];
      }
    }
    await this.animateMove('down');
    this.createCell();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  addScore(num) {
    this.score += num;
  }

  updateScore() {
    const scoreElement = document.querySelector('.game-score');

    if (!scoreElement) {
      return;
    }
    scoreElement.textContent = this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.gameTable;
  }

  /**
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.gameStatus = GAME_STATUS.playing;
    this.score = 0;

    const button = document.querySelector('.button');

    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');

    const messageStart = document.querySelector('.message-start');
    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');

    if (messageStart) {
      messageStart.classList.add('hidden');
    }

    if (messageWin) {
      messageWin.classList.add('hidden');
    }

    if (messageLose) {
      messageLose.classList.add('hidden');
    }

    this.createCell();
    this.updateScore();
  }

  restart() {
    this.gameTable = Array.from({ length: TABLE_SIZE }, () =>
      Array(TABLE_SIZE).fill(0));
    this.score = 0;
    this.gameStatus = GAME_STATUS.playing;

    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');

    if (messageWin) {
      messageWin.classList.add('hidden');
    }

    if (messageLose) {
      messageLose.classList.add('hidden');
    }

    this.updateScore();
    this.createCell();
  }

  render() {
    const rows = document.querySelectorAll('.field-row');

    this.gameTable.forEach((rowGT, i) => {
      const cells = rows[i].querySelectorAll('.field-cell');

      rowGT.forEach((value, j) => {
        cells[j].className = `field-cell`;
        cells[j].textContent = '';

        if (value !== 0) {
          cells[j].textContent = value;
          cells[j].className = `field-cell field-cell--${value}`;
        }
      });
    });
    this.addTransitionEffect();
  }

  gameLose() {
    this.gameStatus = GAME_STATUS.lose;

    const message = document.querySelector('.message-lose');

    message.classList.remove('hidden');
  }

  gameWin() {
    this.gameStatus = GAME_STATUS.win;

    const message = document.querySelector('.message-win');

    message.classList.remove('hidden');
  }

  isLose() {
    // check ability to make not lose move
    for (let i = 1; i < TABLE_SIZE - 1; i++) {
      for (let j = 0; j < TABLE_SIZE; j++) {
        if (
          this.gameTable[i][j] === this.gameTable[i - 1][j] ||
          this.gameTable[i][j] === this.gameTable[i + 1][j]
        ) {
          return false;
        }
      }
    }

    for (let i = 0; i < TABLE_SIZE; i++) {
      for (let j = 1; j < TABLE_SIZE - 1; j++) {
        if (
          this.gameTable[i][j] === this.gameTable[i][j - 1] ||
          this.gameTable[i][j] === this.gameTable[i][j + 1]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  addTransitionEffect() {
    const rows = document.querySelectorAll('.field-row');

    this.gameTable.forEach((rowGT, i) => {
      const cells = rows[i].querySelectorAll('.field-cell');

      rowGT.forEach((_, j) => {
        cells[j].classList.add('transition-effect');
      });
    });
  }

  isPowerOfTwo(n) {
    return n > 0 && (n & (n - 1)) === 0 || n === 0;
  }

  createEmptyTable() {
    this.gameTable = Array.from({ length: TABLE_SIZE }, () =>
      Array(TABLE_SIZE).fill(0));
  }
}

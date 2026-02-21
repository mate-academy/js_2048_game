'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Game {
  field = document.querySelector('.tiles');
  restartButtons = document.querySelectorAll('.button-retry');
  continueButton = document.querySelector('.button-continue');
  lossMessage = document.querySelector('.message-loss');
  winMessage = document.querySelector('.message-win');
  scoreEl = document.querySelector('.game-score');
  bestEl = document.querySelector('.game-best');

  tiles = new Set();
  tilesToDelete = new Set();
  blocked = false;
  finished = false;
  score = 0;
  status = 'idle';

  constructor(initialState) {
    this.initialState = initialState || null;
    this.start();
  }

  // ─── Публічні методи (для тестів) ────────────────────────────

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  getState() {
    const state = Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));

    this.tiles.forEach((t) => {
      state[t.y][t.x] = t.value;
    });

    return state;
  }

  restart() {
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  moveLeft() {
    this.handleMovement(movementLeft);
  }

  moveRight() {
    this.handleMovement(movementRight);
  }

  moveUp() {
    this.handleMovement(movementUp);
  }

  moveDown() {
    this.handleMovement(movementDown);
  }

  // ─── Старт ────────────────────────────────────────────────────

  start() {
    this.lossMessage.classList.add('hidden');
    this.winMessage.classList.add('hidden');

    this.tilesToDelete.forEach((tile) => tile.delete());
    this.tilesToDelete.clear();
    this.tiles.forEach((tile) => tile.delete());
    this.tiles.clear();

    this.blocked = false;
    this.finished = false;
    this.status = 'playing';
    this.score = 0;

    this.updateScoreDisplay();

    if (this.initialState) {
      this.initialState.forEach((row, r) => {
        row.forEach((value, c) => {
          if (value !== 0) {
            this.addTile(value, c, r);
          }
        });
      });
    } else {
      this.addRandomTile();
      this.addRandomTile();
    }

    document.addEventListener('keydown', (e) => {
      const movementMap = {
        ArrowRight: movementRight,
        ArrowLeft: movementLeft,
        ArrowUp: movementUp,
        ArrowDown: movementDown,
      };

      const movement = movementMap[e.key];

      if (movement) {
        this.handleMovement(movement);
      }
    });

    this.restartButtons.forEach((button) => {
      button.addEventListener('click', () => this.restart());
    });

    this.continueButton.addEventListener('click', () => {
      this.winMessage.classList.add('hidden');
    });

    let startX = 0;
    let startY = 0;

    document.addEventListener('touchstart', (e) => {
      const { clientX, clientY } = e.touches[0];

      startX = clientX;
      startY = clientY;
    });

    document.addEventListener('touchend', (e) => {
      const { clientX, clientY } = e.changedTouches[0];
      const DIFF = 30;
      const diffX = Math.abs(clientX - startX);
      const diffY = Math.abs(clientY - startY);

      if (Math.abs(diffX - diffY) < DIFF) {
        return;
      }

      if (diffX > diffY) {
        this.handleMovement(clientX > startX ? movementRight : movementLeft);
      } else {
        this.handleMovement(clientY > startY ? movementDown : movementUp);
      }
    });
  }

  // ─── Обробка ходу ─────────────────────────────────────────────

  handleMovement(movement) {
    if (!movement || this.blocked) {
      return;
    }

    this.tilesToDelete.forEach((tile) => tile.delete());
    this.tilesToDelete.clear();
    this.tiles.forEach((tile) => tile.reset());

    const positionBefore = this.getPosition();

    this.move(movement);

    if (this.getPosition() === positionBefore) {
      return;
    }

    // Рахуємо score по злитих плитках
    this.tiles.forEach((t) => {
      if (t.isMerged) {
        this.score += t.value;
      }
    });

    this.status = 'playing';
    this.updateScoreDisplay();
    this.blockMovements();
    this.addRandomTile();

    if (!this.canMove()) {
      this.status = 'lose';
      this.lossMessage.classList.remove('hidden');
      this.winMessage.classList.add('hidden');

      return;
    }

    if (this.finished) {
      return;
    }

    if ([...this.tiles].some((t) => t.value === 2048)) {
      this.finished = true;
      this.status = 'win';
      this.winMessage.classList.remove('hidden');
    }
  }

  // ─── Оновлення рахунку в DOM ──────────────────────────────────

  updateScoreDisplay() {
    if (this.scoreEl) {
      this.scoreEl.textContent = this.score;
    }

    if (this.bestEl) {
      const current = parseInt(this.bestEl.textContent) || 0;

      if (this.score > current) {
        this.bestEl.textContent = this.score;
      }
    }
  }

  // ─── Внутрішні методи ─────────────────────────────────────────

  blockMovements() {
    this.blocked = true;
    setTimeout(() => (this.blocked = false), 50);
  }

  addTile(value, x, y, isMerged = false) {
    const tile = new Tile(value, x, y, isMerged);

    this.tiles.add(tile);
    this.field.append(tile.el);

    return tile;
  }

  removeTile(tile) {
    this.tiles.delete(tile);
    this.tilesToDelete.add(tile);
  }

  addRandomTile() {
    const [x, y] = this.getEmptyCell();
    const value = Math.random() < 0.8 ? 2 : 4;

    return this.addTile(value, x, y);
  }

  getEmptyCell() {
    const emptyCells = new Set(Array(16).keys());

    this.tiles.forEach((t) => emptyCells.delete(4 * t.y + t.x));

    const randomIndex = Math.floor(Math.random() * emptyCells.size);
    const place = [...emptyCells][randomIndex];

    return [place % 4, Math.floor(place / 4)];
  }

  canMove() {
    if (this.tiles.size < 16) {
      return true;
    }

    const dict = {};

    this.tiles.forEach((t) => {
      dict['' + t.x + t.y] = t.value;
    });

    return [...this.tiles].some(
      ({ x, y, value }) =>
        value === dict['' + (x + 1) + y] || value === dict['' + x + (y + 1)],
    );
  }

  move(movement) {
    let prev = {};

    [...this.tiles].sort(movement.compare).forEach((tile) => {
      const { x, y, value } = prev;

      if (!movement.isSameLine(tile, prev)) {
        tile.move(...movement.lastInLine(tile));
        prev = tile;
      } else if (!prev.isMerged && value === tile.value) {
        tile.move(x, y);

        this.removeTile(tile);
        this.removeTile(prev);

        prev = this.addTile(2 * value, x, y, true);
      } else {
        tile.move(...movement.prevInLine(prev));
        prev = tile;
      }
    });
  }

  getPosition() {
    const cells = Array(16).fill('');

    this.tiles.forEach((t) => {
      cells[4 * t.y + t.x] = '' + t.value;
    });

    return cells
      .map(
        (v, i) => (v ? v.padStart(3, ' ') : '___') + (i % 4 === 3 ? '\n' : ' '),
      )
      .join('');
  }
}

// ─── Напрямки руху ────────────────────────────────────────────

const movementLeft = {
  compare: (t1, t2) => 4 * dy(t1, t2) + dx(t1, t2),
  isSameLine: (t1, t2) => dy(t1, t2) === 0,
  prevInLine: ({ x, y }) => [x + 1, y],
  lastInLine: ({ y }) => [0, y],
};

const movementRight = {
  compare: (t1, t2) => -4 * dy(t1, t2) - dx(t1, t2),
  isSameLine: (t1, t2) => dy(t1, t2) === 0,
  prevInLine: ({ x, y }) => [x - 1, y],
  lastInLine: ({ y }) => [3, y],
};

const movementUp = {
  compare: (t1, t2) => 4 * dx(t1, t2) + dy(t1, t2),
  isSameLine: (t1, t2) => dx(t1, t2) === 0,
  prevInLine: ({ x, y }) => [x, y + 1],
  lastInLine: ({ x }) => [x, 0],
};

const movementDown = {
  compare: (t1, t2) => -4 * dx(t1, t2) - dy(t1, t2),
  isSameLine: (t1, t2) => dx(t1, t2) === 0,
  prevInLine: ({ x, y }) => [x, y - 1],
  lastInLine: ({ x }) => [x, 3],
};

const dx = (t1, t2) => t1.x - t2.x;
const dy = (t1, t2) => t1.y - t2.y;

// ─── Клас Tile ────────────────────────────────────────────────

class Tile {
  x = 0;
  y = 0;

  constructor(value, x, y, isMerged = false) {
    this.el = document.createElement('div');
    this.el.className = `tile tile-${value} tile-${isMerged ? 'merged' : 'new'}`;
    this.value = value;
    this.isMerged = isMerged;
    this.move(x, y);
  }

  move(x, y) {
    this.el.classList.remove(`tile-x${this.x}-y${this.y}`);
    this.el.classList.add(`tile-x${x}-y${y}`);
    this.x = +x;
    this.y = +y;
  }

  reset() {
    this.isMerged = false;
    this.el.classList.remove('tile-new');
    this.el.classList.remove('tile-merged');
  }

  delete() {
    this.el.remove();
  }
}

module.exports = Game;

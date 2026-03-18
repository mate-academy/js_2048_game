'use strict';

function cloneState(state) {
  return state.map((row) => [...row]);
}

function createEmptyState() {
  return Array.from({ length: 4 }, () => [0, 0, 0, 0]);
}

function getRandomTileValue() {
  // 10% chance for 4
  return Math.random() < 0.1 ? 4 : 2;
}

function areStatesEqual(a, b) {
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      if (a[i][j] !== b[i][j]) {
        return false;
      }
    }
  }

  return true;
}

function areLinesEqual(a, b) {
  for (let i = 0; i < 4; i += 1) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function hasAvailableMoves(state) {
  // empty cells
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      if (state[i][j] === 0) {
        return true;
      }
    }
  }

  // horizontal merges
  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      if (state[i][j] === state[i][j + 1]) {
        return true;
      }
    }
  }

  // vertical merges
  for (let j = 0; j < 4; j += 1) {
    for (let i = 0; i < 3; i += 1) {
      if (state[i][j] === state[i + 1][j]) {
        return true;
      }
    }
  }

  return false;
}

function transpose(state) {
  const result = createEmptyState();

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      result[i][j] = state[j][i];
    }
  }

  return result;
}

function slideAndMergeLine(line) {
  const filtered = line.filter(Boolean);
  const result = [];
  let score = 0;

  for (let i = 0; i < filtered.length; i += 1) {
    const current = filtered[i];
    const next = filtered[i + 1];

    if (next !== undefined && current === next) {
      const merged = current + next;

      result.push(merged);
      score += merged;
      i += 1; // skip next
    } else {
      result.push(current);
    }
  }

  while (result.length < 4) {
    result.push(0);
  }

  const moved = !areLinesEqual(line, result);

  return { line: result, score, moved };
}

class Game {
  constructor(initialState) {
    const initial = initialState
      ? cloneState(initialState)
      : createEmptyState();

    this._initialState = cloneState(initial);
    this._state = cloneState(initial);

    this._score = 0;
    this._status = 'idle';
  }

  getState() {
    return cloneState(this._state);
  }

  getScore() {
    return this._score;
  }

  getStatus() {
    return this._status;
  }

  start() {
    if (this._status !== 'idle') {
      return;
    }

    this._state = cloneState(this._initialState);
    this._score = 0;
    this._status = 'playing';

    this._addRandomTile();
    this._addRandomTile();

    this._updateStatus();
  }

  restart() {
    this._state = cloneState(this._initialState);
    this._score = 0;
    this._status = 'idle';
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

  _move(direction) {
    if (this._status !== 'playing') {
      return;
    }

    const previousState = cloneState(this._state);
    let scoreGain = 0;

    const applyLine = (line, reverse = false) => {
      const baseLine = reverse ? [...line].reverse() : [...line];
      const { line: merged, score } = slideAndMergeLine(baseLine);

      scoreGain += score;

      const newLine = reverse ? merged.reverse() : merged;

      return { newLine };
    };

    if (direction === 'left') {
      for (let i = 0; i < 4; i += 1) {
        const { newLine } = applyLine(this._state[i], false);

        this._state[i] = newLine;
      }
    }

    if (direction === 'right') {
      for (let i = 0; i < 4; i += 1) {
        const { newLine } = applyLine(this._state[i], true);

        this._state[i] = newLine;
      }
    }

    if (direction === 'up' || direction === 'down') {
      const transposed = transpose(this._state);

      for (let i = 0; i < 4; i += 1) {
        const { newLine } = applyLine(transposed[i], direction === 'down');

        transposed[i] = newLine;
      }

      this._state = transpose(transposed);
    }

    const moved = !areStatesEqual(previousState, this._state);

    if (!moved) {
      // No changes => no new tile, no score update
      return;
    }

    this._score += scoreGain;

    this._addRandomTile();

    this._updateStatus();
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        if (this._state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomCol] = emptyCells[randomIndex];

    this._state[randomRow][randomCol] = getRandomTileValue();
  }

  _updateStatus() {
    if (this._state.some((row) => row.includes(2048))) {
      this._status = 'win';

      return;
    }

    this._status = hasAvailableMoves(this._state) ? 'playing' : 'lose';
  }
}

module.exports = Game;

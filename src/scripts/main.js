'use strict';

const vectorCompactBegin = 0;
const vectorCompactSequence = 1;
const vectorCompactUndefined = 2;

class Vector extends Array {
  compact() {
    let changed = false;
    let score = 0;

    let state = vectorCompactBegin;
    let index = 0;
    let previous;

    for (let i = 0; i < this.length; i++) {
      const current = this[i];

      switch (state) {
        case vectorCompactBegin:
          if (current === undefined) {
            state = vectorCompactUndefined;
          } else {
            state = vectorCompactSequence;
            previous = current;
            this[index] = current;
          }
          break;

        case vectorCompactUndefined:
          if (current !== undefined) {
            state = vectorCompactSequence;
            previous = current;
            this[index] = current;
            changed = true;
          }
          break;

        case vectorCompactSequence:
          if (current !== undefined) {
            if (current === previous) {
              state = vectorCompactBegin;

              const sum = current + previous;

              this[index++] = sum;

              score = sum;
              changed = true;
            } else {
              previous = current;
              this[++index] = current;
            }
          }
          break;

        default:
          break;
      }
    }

    if (state === vectorCompactSequence) {
      index++;
    }

    while (index < this.length) {
      this[index++] = undefined;
    }

    return {
      changed, score,
    };
  }
}

class Grid {
  constructor(size) {
    this.grid = new Array(size * size);
    this.size = size;
    this.score = 0;
  }

  compact(fnIndex) {
    const vector = new Vector(this.size);
    let gridChanged = false;

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        vector[j] = this.grid[fnIndex(i, j)];
      }

      const { changed, score } = vector.compact();

      gridChanged = gridChanged || changed;
      this.score += score;

      for (let j = 0; j < this.size; j++) {
        this.grid[fnIndex(i, j)] = vector[j];
      }
    }

    return gridChanged;
  }

  compactUp() {
    return this.compact((i, j) => this.size * j + i);
  }

  compactDown() {
    return this.compact((i, j) => this.size * (3 - j) + i);
  }

  compactLeft() {
    return this.compact((i, j) => this.size * i + j);
  }

  compactRight() {
    return this.compact((i, j) => this.size * (4 - i) - 1 - j);
  }

  generate() {
    const gridLength = this.grid.length;
    const array = new Array(gridLength);
    let victory = false;
    let emptyCount = 0;

    for (let i = 0; i < gridLength; i++) {
      if (this.grid[i] === undefined) {
        array[emptyCount++] = i;
      } else if (this.grid[i] === 2048) {
        victory = true;
      }
    }

    // emptyCount cannot be 0
    // as there are at least one empty cell after success move

    const index = Math.floor(Math.random() * emptyCount);

    this.grid[array[index]] = Math.random() > 0.9 ? 4 : 2;

    // in case we have just filled the only remaining empty cell
    // we must check whether we are capable of making move or the game is over

    let hasMoves = emptyCount > 1;

    if (!hasMoves) {
      const tempGrid = new Grid(this.size);

      tempGrid.grid = [...this.grid];
      hasMoves = tempGrid.compactUp() || tempGrid.compactRight();
    }

    return {
      hasMoves, victory,
    };
  }

  start() {
    this.grid.fill(undefined);
    this.score = 0;

    this.generate();
    this.generate();
  }
}

class Game {
  constructor() {
    this.gameField = document.querySelector('.game-field');
    this.grid = new Grid(4);
    this.score = 0;
    this.started = false;
    this.buttonState = 'start';
  }

  render() {
    for (let i = 0; i < 16; i++) {
      const cell = this.gameField.rows[Math.floor(i / 4)].cells[i % 4];
      const value = this.grid.grid[i];

      if (value === undefined) {
        cell.textContent = '';
        cell.className = 'field-cell';
      } else {
        cell.textContent = value;
        cell.className = `field-cell field-cell--appear field-cell--${value}`;
      }
    }
  }

  handleKeyUp(key, score) {
    if (this.started) {
      let changed = false;

      switch (key) {
        case 'ArrowUp':
          changed = this.grid.compactUp();
          break;

        case 'ArrowDown':
          changed = this.grid.compactDown();
          break;

        case 'ArrowRight':
          changed = this.grid.compactRight();
          break;

        case 'ArrowLeft':
          changed = this.grid.compactLeft();
          break;
      }

      if (changed) {
        const { hasMoves, victory } = this.grid.generate();

        if (victory) {
          const messageWin = document.querySelector('.message-win');

          messageWin.classList.remove('hidden');
        }

        if (!hasMoves) {
          const messageLose = document.querySelector('.message-lose');

          messageLose.classList.remove('hidden');
        }
      }

      this.render();
      this.score = this.grid.score;
      score.innerText = this.score;

      if (this.grid.grid.includes(2048)) {
        const messageWin = document.querySelector('.message-win');

        messageWin.classList.remove('hidden');
      }
    }
  }

  start() {
    this.grid.start();
    this.started = true;
    this.score = 0;

    const messages = document.querySelectorAll('.message');

    for (const message of messages) {
      message.classList.add('hidden');
    }

    this.render();
  }

  run() {
    const startButton = document.querySelector('button');

    startButton.addEventListener('click', () => {
      if (this.buttonState === 'start') {
        this.start();
        this.buttonState = 'restart';

        startButton.classList.remove('start');
        startButton.classList.add('restart');
        startButton.textContent = 'Restart';
      } else if (this.buttonState === 'restart') {
        this.start();
        score.innerText = this.score;
      }
    });

    const score = document.querySelector('.game-score');

    score.innerText = this.score;

    document.addEventListener('keyup', (arrowClick) =>
      this.handleKeyUp(arrowClick.key, score)
    );
  }
}

window.onload = function() {
  const game = new Game();

  game.run();
  game.render();
};

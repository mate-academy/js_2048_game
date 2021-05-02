'use strict';

const gameField = document.querySelector('.game-field').tBodies[0];
const startButton = document.querySelector('.controls .button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const scoreHTML = document.querySelector('.game-score');

class GameField {
  constructor() {
    this.cells = Array.from(
      Array(GameField.MAX_ROWS), () => new Array(GameField.MAX_COLS).fill(0)
    );
    this.score = 0;
  }

  get availableCells() {
    return this.cells.reduce((available, row, rowIdx) => {
      return available.concat(
        row.map((cell, cellIdx) => {
          return {
            row: rowIdx,
            col: cellIdx,
            value: cell,
          };
        }).filter(cell => cell.value === 0)
      );
    }, []);
  }

  reset() {
    this.cells.forEach(row => {
      row.splice(0, row.length, ...Array(GameField.MAX_COLS).fill(0));
    });
    this.score = 0;
  }

  generateNewCells(count = 1) {
    const available = this.availableCells;

    const generate = () => {
      if (!available.length) {
        return;
      }

      const index = Math.floor(Math.random() * available.length);
      const [ position ] = available.splice(index, 1);
      const value = Math.random() < GameField.PROBABILITY
        ? GameField.INIT_VALUE_HIGH_PROBABILITY
        : GameField.INIT_VALUE_LOW_PROBABILITY;

      this.cells[position.row][position.col] = value;
    };

    for (let i = 0; i < count; i++) {
      generate();
    }
  }

  tryMoveCells(direction) {
    this.rotate(GameField.ROTATION[direction].to);

    const wasMoved = this.move();

    this.rotate(GameField.ROTATION[direction].from);

    return wasMoved;
  }

  rotate(count = 1) {
    const rotatedField = () => {
      const rotated = [];

      for (let col = 0; col < GameField.MAX_COLS; col++) {
        const rotatedRow = [];

        for (let row = GameField.MAX_ROWS - 1; row >= 0; row--) {
          rotatedRow.push(this.cells[row][col]);
        }

        rotated.push(rotatedRow);
      }

      return rotated;
    };

    for (let i = 0; i < count; i++) {
      this.cells = rotatedField();
    }
  }

  move() {
    let wasMoved = false;

    for (let idx = 0; idx < GameField.MAX_ROWS; idx++) {
      let row = this.cells[idx].filter(cell => cell !== 0);

      this.collapseCells(row);
      row = row.concat(Array(GameField.MAX_COLS - row.length).fill(0));

      wasMoved = wasMoved
        || row.some((cell, cellIdx) => cell !== this.cells[idx][cellIdx]);

      this.cells[idx] = row;
    }

    return wasMoved;
  }

  isMovePossible() {
    const movePossible = () => {
      return this.cells.some(row => {
        for (let i = 1; i < row.length; i++) {
          if (row[i] === row[i - 1]) {
            return true;
          }
        }

        return false;
      });
    };

    const movePossibleHorizontal = movePossible();

    this.rotate();

    const movePossibleVertical = movePossible();

    this.rotate(GameField.MAX_ROTATION - 1);

    return movePossibleHorizontal || movePossibleVertical;
  }

  collapseCells(row) {
    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1]) {
        row[j] *= 2;
        this.score += row[j];
        row.splice(j + 1, 1);
      }
    }
  }

  render() {
    [...gameField.rows].forEach((row, rowIdx) => {
      [...row.cells].forEach((cell, cellIdx) => {
        cell.className = 'field-cell';

        const cellValue = this.cells[rowIdx][cellIdx];

        if (cellValue !== 0) {
          cell.classList.add(`field-cell--${cellValue}`);
          cell.textContent = cellValue;
        } else {
          cell.textContent = '';
        }
      });
    });

    scoreHTML.textContent = this.score;
  }

  hasWon() {
    return this.cells.some(row => row.includes(GameField.WIN_SCORE));
  }

  hasLost() {
    const noCellsAvailable = this.availableCells.length === 0;

    return noCellsAvailable && !this.isMovePossible();
  }
}

GameField.MAX_ROWS = 4;
GameField.MAX_COLS = 4;
GameField.WIN_SCORE = 2048;
GameField.PROBABILITY = 0.9;
GameField.INIT_VALUE_HIGH_PROBABILITY = 2;
GameField.INIT_VALUE_LOW_PROBABILITY = 4;
GameField.MAX_ROTATION = 4;

GameField.ROTATION = {
  'Down': {
    to: 1,
    from: 3,
  },
  'Up': {
    to: 3,
    from: 1,
  },
  'Left': {
    to: 0,
    from: 0,
  },
  'Right': {
    to: 2,
    from: 2,
  },
};

class Game {
  constructor() {
    this.field = new GameField();
  }

  start() {
    this.reset();
    this.field.generateNewCells(2);
    this.render();
  }

  render() {
    this.field.render();
  }

  reset() {
    this.field.reset();

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  }

  checkGameOver() {
    if (this.field.hasWon()) {
      onGameOver();

      return;
    }

    if (this.field.hasLost()) {
      onGameOver(true);
    }
  }

  handleKeyDown(direction) {
    if (!this.field.tryMoveCells(direction)) {
      return;
    }

    this.field.generateNewCells();
    this.checkGameOver();
    this.render();
  }
}

const game = new Game();

startButton.addEventListener('click', onStart);

function onStart(e) {
  if (!e.target.matches('.button')) {
    return;
  }

  if (e.target.classList.contains('start')) {
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.textContent = 'Restart';

    document.body.addEventListener('keydown', onKeyDown);
  }

  game.start();
}

function onGameOver(lose = false) {
  document.body.removeEventListener('keydown', onKeyDown);

  if (lose) {
    messageLose.classList.remove('hidden');
  } else {
    messageWin.classList.remove('hidden');
  }

  startButton.classList.remove('restart');
  startButton.classList.add('start');
  startButton.textContent = 'Start';
}

function onKeyDown(e) {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    return;
  }

  const direction = e.code.replace('Arrow', '');

  game.handleKeyDown(direction);
}

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

  // TODO: refactor
  tryMoveCells(direction) {
    let wasMoved = false;

    switch (direction) {
      case 'Left':
        wasMoved = this.move();
        break;
      case 'Down':
        this.rotate(1);
        wasMoved = this.move();
        this.rotate(3);
        break;
      case 'Right':
        this.rotate(2);
        wasMoved = this.move();
        this.rotate(2);
        break;
      case 'Up':
        this.rotate(3);
        wasMoved = this.move();
        this.rotate(1);
        break;
    }

    return wasMoved;
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

    this.rotate(1);

    const movePossibleVertical = movePossible();

    this.rotate(3);

    return movePossibleHorizontal || movePossibleVertical;
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

class Game {
  constructor() {
    this.field = new GameField();
    this.isWin = false;
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

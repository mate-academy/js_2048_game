'use strict';

const gameField = document.querySelector('.game-field').tBodies[0];
const startButton = document.querySelector('.controls .button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

class GameField {
  constructor() {
    this.cells = Array.from(
      Array(Game.MAX_ROWS), () => new Array(Game.MAX_COLS)
    );

    this.reset();
  }

  get availableCells() {
    // return this.cells.reduce((available, row) => {
    //   return available.concat(
    //     row.filter(cell => cell.isEmpty())
    //   );
    // }, []);

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
      row.splice(0, row.length, ...Array(Game.MAX_COLS).fill(0));
    });
  }

  generateNewCell(count = 1) {
    const available = this.availableCells;

    for (let i = 0; i < count; i++) {
      if (!available.length) {
        break;
      }

      const index = Math.floor(Math.random() * available.length);
      const [ position ] = available.splice(index, 1);
      const value = Math.random() < 0.9 ? 2 : 4;

      this.cells[position.row][position.col] = value;
    }
  }

  rotate(count = 1) {
    const rotatedField = () => {
      const rotated = [];

      for (let col = 0; col < Game.MAX_COLS; col++) {
        const rotatedRow = [];

        for (let row = Game.MAX_ROWS - 1; row >= 0; row--) {
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

    for (let idx = 0; idx < Game.MAX_ROWS; idx++) {
      let row = this.cells[idx].filter(cell => cell !== 0);

      this.collapseCells(row);

      row = row.concat(Array(Game.MAX_COLS - row.length).fill(0));

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
        row.splice(j + 1, 1);

        // row[j] += row.splice(j + 1, 1);
        this.score += row[j];
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
  }
}

class Game {
  constructor() {
    this.field = new GameField();
    this.score = 0;
    this.isWin = false;
  }

  start() {
    this.reset();
    this.field.generateNewCell(2);
    // this.updateInfo();
    this.render();
  }

  render() {
    this.field.render();
    score.textContent = this.score;
  }

  reset() {
    this.field.reset();
    this.score = 0;

    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  }

  checkGameOver() {
    if (this.isWin) {
      onGameOver();

      return;
    }

    // no cells available AND there are no same cells next to each other
    // so no more moves possible
    if (this.field.availableCells.length === 0) {
      onGameOver(true);
    }
  }

  handleKeyDown(direction) {
    if (this.field.tryMoveCells(direction)) {
      this.field.generateNewCell();
      this.checkGameOver();
      this.render();
    }
  }
}

Game.MAX_ROWS = 4;
Game.MAX_COLS = 4;
Game.WIN_SCORE = 2048;

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

'use strict';

const click = require('../@assets/audio/ui-click-97915.mp3');
const audio = new Audio(click);

document.addEventListener('DOMContentLoaded', ready);

function ready() {
  class Game {
    constructor(tableSize = 4) {
      this.tableSize = tableSize;
      this.numberElements = [];

      this.handleMove = this.handleMove.bind(this);
      this.start = this.start.bind(this);

      this.initSelectors();
      this.initListeners();
    }

    initSelectors() {
      this.tableField = document.querySelector('table');
      this.tbody = document.createElement('tbody');
      this.gameScore = document.querySelector('.game-score');
      this.messageLose = document.querySelector('.message-lose');
      this.messageWin = document.querySelector('.message-win');
      this.messageStart = document.querySelector('.message-start');
      this.startButton = document.querySelector('.button');
    }

    initListeners() {
      window.addEventListener('keyup', this.handleMove);

      this.startButton.addEventListener('click', () => {
        this.start();
        audio.play();
      });
    }

    initGame() {
      for (let i = 0; i < this.tableSize; i++) {
        const row = document.createElement('tr');

        row.classList.add('field-row');
        this.tbody.append(row);
        this.tableField.append(this.tbody);

        for (let j = 0; j < this.tableSize; j++) {
          const cell = document.createElement('td');

          cell.classList.add('field-cell');
          row.append(cell);
        }
      }
    }

    start() {
      this.score = 0;
      this.gameOver = false;
      this.hasWon = false;

      this.matrix = new Array(this.tableSize)
        .fill([])
        .map(() => new Array(this.tableSize).fill(0));

      this.messageLose.classList.add('hidden');
      this.messageWin.classList.add('hidden');

      if (this.startButton.classList.contains('start')) {
        this.startButton.classList.remove('start');
        this.startButton.classList.add('restart');
        this.startButton.textContent = 'Restart';
        this.messageStart.classList.add('hidden');
      }

      this.addNumber();
      this.addNumber();
      this.render();
    }

    getRandomNumber() {
      return Math.random() >= 0.9 ? 4 : 2;
    }

    getRandomCell() {
      const freeCells = this.getFreeCells();

      return freeCells[Math.floor(Math.random() * freeCells.length)];
    }

    getFreeCells() {
      return this.matrix.reduce((freeCells, row, rowIndex) => {
        row.forEach(
          (val, colIndex) => val === 0 && freeCells.push([rowIndex, colIndex])
        );

        return freeCells;
      }, []);
    }

    addNumber() {
      const [y, x] = this.getRandomCell();

      this.matrix[y][x] = this.getRandomNumber();
      this.render();
    }

    canMove() {
      const freeCells = this.getFreeCells();

      if (freeCells.length > 0) {
        return true;
      }

      for (let i = 0; i < this.tableSize; i++) {
        for (let j = 0; j < this.tableSize; j++) {
          if (
            (this.matrix[i][j + 1]
              && this.matrix[i][j] === this.matrix[i][j + 1])
            || (this.matrix[i + 1]
              && this.matrix[i][j] === this.matrix[i + 1][j])
          ) {
            return true;
          }
        }
      }

      return false;
    }

    matrixShift() {
      const emptyCells = new Array(this.tableSize).fill(0);

      this.matrix = this.matrix.map((row) => {
        return row
          .filter((el) => el > 0)
          .concat(emptyCells)
          .slice(0, this.tableSize);
      });
    }

    matrixRotate(degree) {
      switch (degree) {
        case 90:
        case -270:
          this.matrix = this.matrix.map((_, rowIndex) =>
            this.matrix.map((row) => row[rowIndex]).reverse()
          );
          break;
        case 180:
        case -180:
          this.matrix = this.matrix.map((row) => row.reverse()).reverse();
          break;
        case 270:
        case -90:
          this.matrix = this.matrix.map((_, rowIndex) =>
            this.matrix.map((row) => [...row].reverse()[rowIndex])
          );
          break;
        case 0:
        case 360:
        case -360:
          return this.matrix;
        default:
          throw new Error('Degree must be not 0, 360, -360');
      }
    }

    // eslint-disable-next-line no-shadow
    handleMove(event) {
      if (this.gameOver) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          this.merge();
          this.render();
          break;
        case 'ArrowDown':
          this.matrixRotate(90);
          this.merge();
          this.matrixRotate(-90);
          this.render();
          break;
        case 'ArrowRight':
          this.matrixRotate(180);
          this.merge();
          this.matrixRotate(-180);
          this.render();
          break;
        case 'ArrowUp':
          this.matrixRotate(270);
          this.merge();
          this.matrixRotate(-270);
          this.render();
          break;
      }
    }

    hasMatrixChanged(matrixRef) {
      return this.matrix.some((row, y) =>
        row.some((val, x) => val !== matrixRef[y][x])
      );
    }

    merge() {
      const matrixRef = this.matrix.map((row) => row.slice());

      for (let i = 0; i < this.tableSize; i++) {
        for (let j = 0; j < this.tableSize - 1; j++) {
          this.matrixShift();

          if (this.matrix[i][j] === this.matrix[i][j + 1]) {
            this.matrix[i][j] *= 2;
            this.matrix[i][j + 1] = 0;
            this.score += this.matrix[i][j];
          }
        }
      }

      if (this.hasMatrixChanged(matrixRef)) {
        this.addNumber();
      }
    }

    render() {
      const { rows } = this.tableField;

      this.numberElements.forEach((el) => {
        el.textContent = '';
        el.className = 'field-cell';
      });
      this.numberElements = [];

      this.matrix.forEach((arr, rowIndex) =>
        arr.forEach((val, cellIndex) => {
          if (val) {
            const field = rows[rowIndex].cells[cellIndex];

            field.classList.add(`field-cell--${val}`);
            this.numberElements.push(field);
            this.gameScore.textContent = this.score;
          }
        })
      );

      if (
        this.matrix.some((row) => row.some((el) => el === 2048))
        && !this.hasWon
      ) {
        this.messageWin.classList.remove('hidden');
        this.hasWon = true;

        setTimeout(() => {
          this.messageWin.classList.add('hidden');
        }, 5000);
      }

      if (!this.canMove()) {
        this.messageLose.classList.remove('hidden');
        this.gameOver = true;
      }
    }
  }

  const game = new Game();

  game.initGame();
}

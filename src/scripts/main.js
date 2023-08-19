'use strict';

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
    this.tableEl = document.querySelector('table');
    this.scoreEl = document.querySelector('.game-score');
    this.messageLoseEl = document.querySelector('.message-lose');
    this.messageWinEl = document.querySelector('.message-win');
    this.messageStartEl = document.querySelector('.message-start');
    this.startButtonEl = document.querySelector('.button');
  }

  initListeners() {
    window.addEventListener('keyup', this.handleMove);
    this.startButtonEl.addEventListener('click', this.start);
  }

  init() {
    for (let y = 0; y < this.tableSize; y++) {
      const row = document.createElement('tr');

      row.classList.add('field-row');
      this.tableEl.append(row);

      for (let x = 0; x < this.tableSize; x++) {
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

    this.messageLoseEl.classList.add('hidden');
    this.messageWinEl.classList.add('hidden');

    if (this.startButtonEl.classList.contains('start')) {
      this.startButtonEl.classList.remove('start');
      this.startButtonEl.classList.add('restart');
      this.startButtonEl.textContent = 'Restart';
      this.messageStartEl.classList.add('hidden');
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
    // get coordinates of a random free cell
    const [y, x] = this.getRandomCell();

    // add a new number to the matrix using known coordinates
    this.matrix[y][x] = this.getRandomNumber();
    this.render();
  }

  canMove() {
    // first check if there are free cells
    const freeCells = this.getFreeCells();

    if (freeCells.length > 0) {
      return true;
    }

    for (let y = 0; y < this.tableSize; y++) {
      for (let x = 0; x < this.tableSize; x++) {
        if (
          (this.matrix[y][x + 1]
            && this.matrix[y][x] === this.matrix[y][x + 1])
          || (this.matrix[y + 1]
            && this.matrix[y][x] === this.matrix[y + 1][x])
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
        throw new Error('Degree must be one of 90, -90, 180, -180, 270, -270');
    }
  }

  handleMove(even) {
    // don't do anything if the game is over
    if (this.gameOver) {
      return;
    }

    switch (even.key) {
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
    // deeply clone matrix
    const matrixRef = this.matrix.map((row) => row.slice());

    for (let y = 0; y < this.tableSize; y++) {
      for (let x = 0; x < this.tableSize - 1; x++) {
        this.matrixShift();

        if (this.matrix[y][x] === this.matrix[y][x + 1]) {
          this.matrix[y][x] *= 2;
          this.matrix[y][x + 1] = 0;
          this.score += this.matrix[y][x];
        }
      }
    }

    if (this.hasMatrixChanged(matrixRef)) {
      this.addNumber();
    }
  }

  render() {
    const { rows } = this.tableEl;

    this.numberElements.forEach((el) => {
      el.textContent = '';
      el.className = 'field-cell';
    });
    this.numberElements = [];

    this.matrix.forEach((arr, rowIndex) =>
      arr.forEach((val, cellIndex) => {
        if (val) {
          const field = rows[rowIndex].cells[cellIndex];

          field.textContent = val;
          field.classList.add(`field-cell--${val}`);
          this.numberElements.push(field);
          this.scoreEl.textContent = this.score;
        }
      })
    );

    if (
      this.matrix.some((row) => row.some((el) => el === 2048))
      && !this.hasWon
    ) {
      this.messageWinEl.classList.remove('hidden');
      this.hasWon = true;

      setTimeout(() => {
        this.messageWinEl.classList.add('hidden');
      }, 8000);
    }

    if (!this.canMove()) {
      this.messageLoseEl.classList.remove('hidden');
      this.gameOver = true;
    }
  }
}

const game = new Game();

game.init();

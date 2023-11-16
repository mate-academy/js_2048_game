'use strict';

const FIELD_ROW_CLASS = 'field-row';
const FIELD_CELL_CLASS = 'field-cell';

const FIELD_SIZE = 4;
const WIN_SCORE = 2048;

class BaseClass {
  constructor() {
    this.setSelectors();
  }

  setSelectors() {
    this.fieldRows = document.getElementsByClassName(FIELD_ROW_CLASS);
    this.buttonStart = document.querySelector('.start');
    this.gameScore = document.querySelector('.game-score');
    this.loseMessage = document.querySelector('.message-lose');
    this.winMessage = document.querySelector('.message-win');
    this.startMessage = document.querySelector('.message-start');
  }

  setInitData() {
    this.score = 0;
    this.isGameOver = false;
    this.isGameStart = false;

    this.fields = Array(FIELD_SIZE).fill([]).map(() => (
      Array(FIELD_SIZE).fill(0)
    ));

    if (!this.loseMessage.classList.contains('hidden')) {
      this.loseMessage.classList.add('hidden');
    }

    if (!this.winMessage.classList.contains('hidden')) {
      this.winMessage.classList.add('hidden');
    }
  }

  startGame() {
    this.buttonStart.textContent = 'Restart';
    this.buttonStart.classList.remove('start');
    this.startMessage.classList.add('hidden');
    this.buttonStart.classList.add('restart');

    this.setRandomNumbers();
    this.setRandomNumbers();
    this.addKeydownListener();
  }

  restartGame() {
    this.buttonStart.textContent = 'Start';
    this.buttonStart.classList.remove('restart');
    this.buttonStart.classList.add('start');
    this.startMessage.classList.remove('hidden');

    this.setInitData();

    this.removeKeydownListener();
  }

  updateScore() {
    this.gameScore.textContent = this.score;
  }

  updateCells() {
    this.fields.forEach((row, rowIndex) => {
      const fieldRows = this.fieldRows[rowIndex];

      row.forEach((cell, cellIndex) => {
        const cells
          = fieldRows.getElementsByClassName(FIELD_CELL_CLASS)[cellIndex];

        cells.className = FIELD_CELL_CLASS;
        cells.textContent = cell || '';

        if (cell) {
          cells.classList.add(`${FIELD_CELL_CLASS}--${cell}`);
        }
      });
    });
  }

  checkIfGameIsContinue() {
    const gameIsContinue = this.fields.filter((row, rowIndex) => (
      row.some((cell, cellIndex) => {
        if (!cell) {
          return false;
        }

        const isSameNextCell = cell === row[cellIndex + 1];
        const nextRow = this.fields[rowIndex + 1];
        const isSameCellNextRow = nextRow && cell === nextRow[cellIndex];

        return isSameNextCell || isSameCellNextRow;
      })
    ));

    return gameIsContinue.length;
  }

  checkIfGameIsOver() {
    const freeRows = this.fields.filter((row) => row.some((cell) => !cell));
    const winFieldsRow = this.fields.filter((row) => row.some((cell) => (
      cell === WIN_SCORE
    )));

    if (winFieldsRow.length) {
      this.winMessage.classList.remove('hidden');
      this.isGameOver = true;
    }

    if (!freeRows.length && !this.checkIfGameIsContinue()) {
      this.loseMessage.classList.remove('hidden');
      this.isGameOver = true;
    }
  }

  getRandomIndex() {
    return Math.floor(Math.random() * FIELD_SIZE);
  }

  getRandomIndexes() {
    const [rowIndex, cellIndex]
      = [this.getRandomIndex(), this.getRandomIndex()];
    const cellValue = this.fields[rowIndex][cellIndex];

    if (cellValue) {
      return this.getRandomIndexes();
    } else {
      return [rowIndex, cellIndex];
    }
  }

  setRandomNumbers() {
    const [rowIndex, cellIndex] = this.getRandomIndexes();

    this.fields[rowIndex][cellIndex] = 2;
  }
}

class Move extends BaseClass {
  constructor() {
    super();

    this.isCellMoved = false;
  }

  setNewRowValues({ cell, rowIndex, cellIndex, prevCellIndex }) {
    const value = cell * 2;

    this.fields[rowIndex][prevCellIndex] = value;
    this.fields[rowIndex][cellIndex] = 0;

    this.score += value;
  }

  setNewColumnValues({ cell, columnIndex, prevColumnIndex, cellIndex }) {
    const value = cell * 2;

    this.fields[prevColumnIndex][cellIndex] = value;
    this.fields[columnIndex][cellIndex] = 0;

    this.score += value;
  }

  setPrevRowValues({ cell, rowIndex, cellIndex, index }) {
    this.fields[rowIndex][index] = cell;

    if (index !== cellIndex) {
      this.fields[rowIndex][cellIndex] = 0;
    }
  }

  setPrevColumnValues({ cell, columnIndex, cellIndex, index }) {
    this.fields[index][cellIndex] = cell;

    if (index !== columnIndex) {
      this.fields[columnIndex][cellIndex] = 0;
    }
  }

  goLeft() {
    for (let rowIndex = 0; rowIndex < FIELD_SIZE; rowIndex++) {
      let index = 0;

      for (let cellIndex = 0; cellIndex < FIELD_SIZE; cellIndex++) {
        const cell = this.fields[rowIndex][cellIndex];
        const prevCell = this.fields[rowIndex][index - 1];

        if (!cell) {
          continue;
        }

        if (cell && index === cellIndex && prevCell !== cell) {
          index++;
          continue;
        }

        if (index && prevCell === cell) {
          this.setNewRowValues({
            cell, rowIndex, cellIndex, prevCellIndex: index - 1,
          });
        } else {
          this.setPrevRowValues({
            cell, rowIndex, cellIndex, index,
          });
          index++;
        }

        this.isCellMoved = true;
      }
    }
  }

  goRight() {
    for (let rowIndex = FIELD_SIZE - 1; rowIndex >= 0; rowIndex--) {
      let index = FIELD_SIZE - 1;

      for (let cellIndex = FIELD_SIZE - 1; cellIndex >= 0; cellIndex--) {
        const cell = this.fields[rowIndex][cellIndex];
        const prevCell = this.fields[rowIndex][index + 1];

        if (!cell) {
          continue;
        }

        if (cell && index === cellIndex && prevCell !== cell) {
          index--;
          continue;
        }

        if (index !== FIELD_SIZE - 1 && prevCell === cell) {
          this.setNewRowValues({
            cell, rowIndex, cellIndex, prevCellIndex: index + 1,
          });
        } else {
          this.setPrevRowValues({
            cell, rowIndex, cellIndex, index,
          });
          index--;
        }

        this.isCellMoved = true;
      }
    }
  }

  goUp() {
    for (let cellIndex = 0; cellIndex < FIELD_SIZE; cellIndex++) {
      let index = 0;

      for (let columnIndex = 0; columnIndex < FIELD_SIZE; columnIndex++) {
        const cell = this.fields[columnIndex][cellIndex];
        const prevCell = index ? this.fields[index - 1][cellIndex] : null;

        if (!cell) {
          continue;
        }

        if (cell && index === columnIndex && prevCell !== cell) {
          index++;
          continue;
        }

        if (index && prevCell === cell) {
          this.setNewColumnValues({
            cell, columnIndex, prevColumnIndex: index - 1, cellIndex,
          });
        } else {
          this.setPrevColumnValues({
            cell, columnIndex, cellIndex, index,
          });
          index++;
        }

        this.isCellMoved = true;
      }
    }
  }

  goDown() {
    for (let cellIndex = FIELD_SIZE - 1; cellIndex >= 0; cellIndex--) {
      let index = FIELD_SIZE - 1;

      for (let columnIndex = FIELD_SIZE - 1; columnIndex >= 0; columnIndex--) {
        const cell = this.fields[columnIndex][cellIndex];
        const prevCell
          = index !== FIELD_SIZE - 1 ? this.fields[index + 1][cellIndex] : null;

        if (!cell) {
          continue;
        }

        if (cell && index === columnIndex && prevCell !== cell) {
          index--;
          continue;
        }

        if (index !== FIELD_SIZE - 1 && prevCell === cell) {
          this.setNewColumnValues({
            cell, columnIndex, prevColumnIndex: index + 1, cellIndex,
          });
        } else {
          this.setPrevColumnValues({
            cell, columnIndex, cellIndex, index,
          });
          index -= 1;
        }

        this.isCellMoved = true;
      }
    }
  }
}

class Game extends Move {
  constructor() {
    super();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  init() {
    this.setInitData();
    this.buttonStart.addEventListener('click', this.handleButtonClick);
  }

  handleKeydown({ key }) {
    this.isCellMoved = false;

    switch (key) {
      case 'ArrowDown':
        this.goDown();
        break;

      case 'ArrowLeft':
        this.goLeft();
        break;

      case 'ArrowUp':
        this.goUp();
        break;

      case 'ArrowRight':
        this.goRight();
        break;

      default:
        return;
    }

    if (!this.isGameOver && this.isCellMoved) {
      this.setRandomNumbers();
      this.updateCells();
      this.updateScore();
    }

    this.checkIfGameIsOver();
  }

  addKeydownListener() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  removeKeydownListener() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleButtonClick() {
    this.isGameStart = !this.isGameStart;

    if (this.isGameStart) {
      this.startGame();
    } else {
      this.restartGame();
    }

    this.updateCells();
  }
}

const newGame = new Game();

newGame.init();

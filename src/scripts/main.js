'use strict'

const BUTTON_CLASS = '.start';
const FIELD_ROW_CLASS = 'field-row';
const FIELD_CELL_CLASS = 'field-cell';
const GAME_SCORE_CLASS = '.game-score';
const START_MESSAGE_CLASS = '.message-start';
const LOSE_MESSAGE_CLASS = '.message-lose';
const WIN_MESSAGE_CLASS = '.message-win';
const HIDDEN_CLASS = 'hidden';

const RESTART_TEXT = 'Restart';
const START_TEXT = 'Start';

const RESTART_CLASS = RESTART_TEXT.toLocaleLowerCase();
const START_CLASS = START_TEXT.toLocaleUpperCase();

const FIELD_SIZE = 4;
const WIN_SCORE = 2048;

class BaseClass {
  constructor() {
    this.score = 0;
    this.fields = [];
    this.isGameOver = false;
    this.isGameStart = false;

    this.setSelectors();
  }

  setSelectors() {
    this.buttonEl = document.querySelector(BUTTON_CLASS);
    this.fieldRowsEl = document.getElementsByClassName(FIELD_ROW_CLASS);
    this.gameScoreEl = document.querySelector(GAME_SCORE_CLASS);
    this.loseMessageEl = document.querySelector(LOSE_MESSAGE_CLASS);
    this.winMessageEl = document.querySelector(WIN_MESSAGE_CLASS);
    this.startMessageEl = document.querySelector(START_MESSAGE_CLASS);
  }

  setInitData() {
    this.score = 0;

    this.fields = Array(FIELD_SIZE).fill([]).map(() => (
      Array(FIELD_SIZE).fill(0)
    ));

    if (!this.loseMessageEl.classList.contains(HIDDEN_CLASS)) {
      this.loseMessageEl.classList.add(HIDDEN_CLASS);
    }

    if (!this.winMessageEl.classList.contains(HIDDEN_CLASS)) {
      this.winMessageEl.classList.add(HIDDEN_CLASS);
    }
  }

  startGame() {
    this.buttonEl.textContent = RESTART_TEXT;
    this.buttonEl.classList.remove(START_CLASS);
    this.startMessageEl.classList.add(HIDDEN_CLASS);
    this.buttonEl.classList.add(RESTART_CLASS);

    this.setRandomNumbers();
    this.setRandomNumbers();
    this.addKeydownListener();
  }

  restartGame() {
    this.buttonEl.textContent = START_TEXT;
    this.buttonEl.classList.remove(RESTART_CLASS);
    this.buttonEl.classList.add(START_CLASS);
    this.startMessageEl.classList.remove(HIDDEN_CLASS);

    this.setInitData();

    this.removeKeydownListener();
  }

  updateScore() {
    this.gameScoreEl.textContent = this.score;
  }

  updateCells() {
    this.fields.forEach((row, rowIndex) => {
      const fieldRows = this.fieldRowsEl[rowIndex];

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

  checkForPossibilityToContinue() {
    const possibilityToContinue = this.fields.filter((row, rowIndex) => (
      row.some((cell, cellIndex) => {
        if (!cell) {
          return false;
        }

        const isSameNextCell = cell === row[cellIndex + 1];
        const isSameCellNextRow
          = row[rowIndex + 1] && cell === row[rowIndex + 1][cellIndex];

        return isSameNextCell || isSameCellNextRow;
      })
    ));

    return possibilityToContinue.length;
  }

  checkIfGameIsOver() {
    const freeRows = this.fields.filter((row) => row.some((cell) => !cell));
    const winFieldsRow = this.fields.filter((row) => row.some((cell) => (
      cell === WIN_SCORE
    )));

    if (winFieldsRow.length) {
      this.winMessageEl.classList.remove(HIDDEN_CLASS);
      this.isGameOver = true;
    }

    if (!freeRows.length && !this.checkForPossibilityToContinue()) {
      this.loseMessageEl.classList.remove(HIDDEN_CLASS);
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
    this.buttonEl.addEventListener('click', this.handleButtonClick);
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

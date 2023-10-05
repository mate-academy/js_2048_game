import {
  START_TEXT,
  RESTART_TEXT,
  BUTTON_CLASS,
  FIELD_ROW_CLASS,
  FIELD_SIZE,
  FIELD_CELL_CLASS,
  GAME_SCORE_CLASS,
  START_MESSAGE_CLASS,
  LOSE_MESSAGE_CLASS,
  WIN_MESSAGE_CLASS,
  HIDDEN_CLASS,
  WIN_SCORE,
} from './constants';

export class BaseClass {
  constructor() {
    this.score = 0;
    this.fields = [];
    this.isGameOver = false;
    this.isGameStart = false;
    this.restartClass = RESTART_TEXT.toLocaleLowerCase();
    this.startClass = START_TEXT.toLocaleLowerCase();

    this.setSelectors();
  }

  setSelectors() {
    this.buttonEl = document.getElementsByClassName(BUTTON_CLASS)[0];
    this.fieldRowsEl = document.getElementsByClassName(FIELD_ROW_CLASS);
    this.gameScoreEl = document.getElementsByClassName(GAME_SCORE_CLASS)[0];
    this.loseMessageEl = document.getElementsByClassName(LOSE_MESSAGE_CLASS)[0];
    this.winMessageEl = document.getElementsByClassName(WIN_MESSAGE_CLASS)[0];

    this.startMessageEl
      = document.getElementsByClassName(START_MESSAGE_CLASS)[0];
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
    this.buttonEl.classList.remove(this.startClass);
    this.startMessageEl.classList.add(HIDDEN_CLASS);
    this.buttonEl.classList.add(this.restartClass);

    this.setRandomNumbers();
    this.setRandomNumbers();
    this.addKeydownListener();
  }

  restartGame() {
    this.buttonEl.textContent = START_TEXT;
    this.buttonEl.classList.remove(this.restartClass);
    this.buttonEl.classList.add(this.startClass);
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

  checkIfGameIsOver() {
    const freeRows = this.fields.filter((row) => row.some((cell) => !cell));
    const winFieldsRow = this.fields.filter((row) => row.some((cell) => (
      cell === WIN_SCORE
    )));

    if (winFieldsRow.length) {
      this.winMessageEl.classList.remove(HIDDEN_CLASS);
      this.isGameOver = true;
    }

    if (!freeRows.length) {
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

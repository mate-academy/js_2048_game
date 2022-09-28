'use strict';
/*
  [
      [2, 4, 128, 2],
      [8, 32, 4, 8],
      [2, 256, 16, 4],
      [128, 4, 2, 2],
    ]

    this.fieldState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
*/

// write your code here
class Game {
  constructor(gameElement) {
    this.gameElement = gameElement;
    this.scoreElement = this.gameElement.querySelector('.header__score');
    this.playBtn = this.gameElement.querySelector('.header__button');
    this.messageElement = this.gameElement.querySelector('.message');
    this.fieldBody = this.gameElement.querySelector('.field');

    this.fieldSize = 4;
    this.fieldState = [];

    this.score = 0;
    this.gameOver = false;

    this.keyUpHandler = this.keyUpHandler.bind(this);
    this.pressHandler = this.pressHandler.bind(this);
    this.unpressHandler = this.unpressHandler.bind(this);

    this.mouseMoves = {
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0,
        y: 0,
      },
    };
  }

  init() {
    this.playBtn.addEventListener('click', () => {
      this.startGame();
      this.changePlayButtonToRestart();
      this.hidePromptMessage();
    });
  }

  startGame() {
    this.gameOver = false;

    this.fieldState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.generateMarkup();
    this.generateTileInRandomPlace();
    this.generateTileInRandomPlace();
    this.setFieldOpacity();
    this.setScore(0);

    document.addEventListener('keyup', this.keyUpHandler);

    document.addEventListener('mousedown', this.pressHandler);
    document.addEventListener('mouseup', this.unpressHandler);

    document.addEventListener('touchstart', this.pressHandler);
    document.addEventListener('touchend', this.unpressHandler);
  }

  finishGame() {
    this.gameOver = true;
    this.removeEventsListeners();

    if (this.isGameWon()) {
      this.showPromptMessage('Winner! Congrats! You did it!', 'win');
      this.setFieldOpacity('0.8');

      return;
    }

    this.showPromptMessage('You lose! Restart the game?');
    this.setFieldOpacity('0.5');
  }

  // Moves
  slideCurrentLine(line) {
    let filtredLine = this.removeZerosInLine(line);

    this.mergeTileInLine(filtredLine);

    filtredLine = this.removeZerosInLine(filtredLine);
    this.fillLineByZeros(filtredLine);

    return filtredLine;
  }

  slide(isReversed, isRow) {
    for (let i = 0; i < this.fieldSize; i++) {
      let line = isRow
        ? this.fieldState[i]
        : [
          this.fieldState[0][i],
          this.fieldState[1][i],
          this.fieldState[2][i],
          this.fieldState[3][i],
        ];

      line = this.reverseLineBy(isReversed, line);
      line = this.slideCurrentLine(line);
      line = this.reverseLineBy(isReversed, line);

      // if (isRow) {
      //   this.fieldState[i] = line;
      // }

      for (let j = 0; j < this.fieldSize; j++) {
        // if (!isRow) {
        //   this.fieldState[j][i] = line[j];
        // }

        const rowIndex = isRow ? i : j;
        const columnIndex = isRow ? j : i;

        this.fieldState[rowIndex][columnIndex] = line[j];

        this.updateTileByPosition(rowIndex, columnIndex);
      }
    }
  }

  slideLeft() {
    this.slide(false, true);
  }

  slideRight() {
    this.slide(true, true);
  }

  slideUp() {
    this.slide(false, false);
  }

  slideDown() {
    this.slide(true, false);
  }

  // Listeners
  getPressEventProperties(e) {
    let eventProperties = e;

    if (e.changedTouches) {
      eventProperties = eventProperties.changedTouches[0];
    }

    return eventProperties;
  }

  keyUpHandler(e) {
    const key = e.code;

    if (!this.gameOver) {
      switch (key) {
        case 'ArrowLeft':
          this.slideLeft();
          break;

        case 'ArrowRight':
          this.slideRight();
          break;

        case 'ArrowUp':
          this.slideUp();

          break;

        case 'ArrowDown':
          this.slideDown();
          break;

        default:
          return;
      }

      if (this.isGameWon() || this.isGameLosed()) {
        this.finishGame();
      }

      this.generateTileInRandomPlace();
    }
  }

  pressHandler(e) {
    const currentEvent = this.getPressEventProperties(e);

    this.mouseMoves.start.x = currentEvent.screenX;
    this.mouseMoves.start.y = currentEvent.screenY;
  }

  unpressHandler(e) {
    if (!this.gameOver) {
      const currentEvent = this.getPressEventProperties(e);

      this.mouseMoves.end.x = currentEvent.screenX;
      this.mouseMoves.end.y = currentEvent.screenY;

      const xDiference = this.mouseMoves.end.x - this.mouseMoves.start.x;
      const yDiference = this.mouseMoves.end.y - this.mouseMoves.start.y;

      const xAbsDiference = Math.abs(xDiference);
      const yAbsDiference = Math.abs(yDiference);

      if (xAbsDiference < 50 && yAbsDiference < 50) {
        return;
      }

      if (xAbsDiference > yAbsDiference) {
        xDiference > 0 ? this.slideRight() : this.slideLeft();
      } else {
        yDiference > 0 ? this.slideDown() : this.slideUp();
      }

      if (this.isGameWon() || this.isGameLosed()) {
        this.finishGame();
      }

      this.generateTileInRandomPlace();
    }
  }

  removeEventsListeners() {
    document.removeEventListener('keyup', this.keyupHandler);
    document.removeEventListener('mousedown', this.pressHandler);
    document.removeEventListener('mouseup', this.unpressHandler);
  }

  // Markup
  changePlayButtonToRestart() {
    this.playBtn.textContent = 'Restart';
    this.playBtn.classList.remove('header__button--start');
    this.playBtn.classList.add('header__button--restart');
  }

  showPromptMessage(text, type) {
    this.messageElement.textContent = text;
    this.messageElement.classList.value = 'message';

    if (type) {
      this.messageElement.classList.add(`message--${type}`);
    }
  }

  setFieldOpacity(opacity = null) {
    this.fieldBody.style.opacity = opacity;
  }

  hidePromptMessage() {
    this.messageElement.classList.add('message--hidden');
  }

  generateMarkup() {
    this.fieldBody.innerHTML = '';

    let fieldMarkup = '';

    for (let i = 0; i < this.fieldSize; i++) {
      const rowMarkup = `
        <tr class='field__row'>
          ${this.fieldState[i].map((_, j) => this.generateTile(i, j)).join('')}
        </tr>
      `;

      fieldMarkup += rowMarkup;
    }

    this.fieldBody.insertAdjacentHTML(
      'beforeend',
      `<tbody>${fieldMarkup}</tbody>`
    );
  }

  generateTile(rowIndex, columnIndex) {
    const tile = `
      <td class="field__cell" data-position="${rowIndex}-${columnIndex}">
        ${this.fieldState[rowIndex][columnIndex] || ''}
      </td>
    `;

    return tile;
  }

  setScore(value = 0) {
    this.score = value;
    this.scoreElement.textContent = this.score;
    this.animate(this.scoreElement);
  }

  // Utils
  isGameWon() {
    return this.fieldState.flat().includes(2048);
  }

  isGameLosed() {
    if (this.stateHasEmptyTile()) {
      return false;
    }

    for (let i = 0; i < this.fieldSize; i++) {
      for (let j = 0; j < this.fieldSize; j++) {
        const cell = this.fieldState[i][j];

        const cellUnderCurrCell = this.fieldState[i + 1]
          ? this.fieldState[i + 1][j]
          : null;

        const rightCellOfCurrCell = this.fieldState[i][j + 1] || null;

        if (cell !== 0) {
          if (cell === cellUnderCurrCell || cell === rightCellOfCurrCell) {
            return false;
          }
        }
      }
    }

    return true;
  }

  generateNewTileValue() {
    return Math.random() >= 0.9 ? 4 : 2;
  }

  generateRandomTileIndex() {
    return Math.floor(Math.random() * this.fieldSize);
  }

  generateRandomTilePosition() {
    return [this.generateRandomTileIndex(), this.generateRandomTileIndex()];
  }

  getTileElementByPosition(rowIndex, columnIndex) {
    return document.querySelector(
      `[data-position = '${rowIndex + '-' + columnIndex}']`
    );
  }

  generateTileInRandomPlace() {
    if (!this.stateHasEmptyTile()) {
      return;
    }

    let emptyTileFound = false;

    while (!emptyTileFound) {
      const [rowIndex, columnIndex] = this.generateRandomTilePosition();

      if (this.fieldState[rowIndex][columnIndex] === 0) {
        const tile = this.getTileElementByPosition(rowIndex, columnIndex);
        const tileValue = this.generateNewTileValue();

        this.fieldState[rowIndex][columnIndex] = tileValue;
        tile.textContent = tileValue;
        tile.classList.add(`field__cell--${tileValue}`);
        this.animate(tile);
        emptyTileFound = true;
      }
    }
  }

  updateTileByPosition(rowIndex, columnIndex) {
    const tile = this.getTileElementByPosition(rowIndex, columnIndex);
    const tileValue = this.fieldState[rowIndex][columnIndex];

    tile.textContent = '';
    tile.classList.value = 'field__cell';

    if (tileValue > 0) {
      tile.textContent = tileValue;
      tile.classList.add('field__cell--' + tileValue);
    }
  }

  animate(element) {
    element.animate(
      [{ transform: 'scale(0.5)' }, { transform: 'scale(1)' }],
      {
        duration: 400,
        easing: 'cubic-bezier(0.42, 0.97, 0.52, 1.2)',
      }
    );
  }

  fillLineByZeros(line) {
    while (line.length < this.fieldSize) {
      line.push(0);
    }
  }

  removeZerosInLine(line) {
    return line.filter((num) => num !== 0);
  }

  mergeTileInLine(line) {
    for (let i = 0; i < line.length - 1; i++) {
      if (line[i] === line[i + 1]) {
        line[i] *= 2;
        line[i + 1] = 0;
        this.setScore(this.score + line[i]);
      }
    }
  }

  reverseLineBy(condition, line) {
    return condition ? line.reverse() : line;
  }

  stateHasEmptyTile() {
    for (let i = 0; i < this.fieldSize; i++) {
      for (let j = 0; j < this.fieldSize; j++) {
        if (this.fieldState[i][j] === 0) {
          return true;
        }
      }
    }

    return false;
  }
}

const gameSlector = document.querySelector('.game');
const game = new Game(gameSlector);

game.init();

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
  constructor(gameSelector) {
    this.score = 0;
    this.game = gameSelector;
    this.scoreSelector = this.game.querySelector('.header__score');
    this.playBtn = this.game.querySelector('.header__button');
    this.messageSelector = this.game.querySelector('.message');
    this.fieldSize = 4;
    this.fieldBody = this.game.querySelector('.field');
    this.gameOver = false;

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

    this.playBtn.addEventListener('click', () => {
      this.init();
      this.playBtn.textContent = 'Restart';
      this.playBtn.classList.remove('header__button--start');
      this.playBtn.classList.add('header__button--restart');

      this.hideMessage();
    });
  }

  init() {
    this.gameOver = false;

    this.fieldState = [
      [2, 4, 128, 2],
      [8, 32, 4, 8],
      [2, 256, 16, 4],
      [128, 4, 2, 2],
    ];

    this.generateMarkup();
    this.setTwo();
    this.setTwo();

    const keyupHandler = (e) => {
      const key = e.code;

      console.log(key);


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

        if (this.isGameWon()) {
          this.gameOver = true;
          this.showMessage('Winner! Congrats! You did it!', 'win');
          document.removeEventListener('keyup', keyupHandler);
        }

        if (this.isGameLosed()) {
          this.gameOver = true;
          this.showMessage('You lose! Restart the game?');
          document.removeEventListener('keyup', keyupHandler);
        }

        this.setTwo();
      }
    };

    const mouseupHandler = (e) => {
      if (!this.gameOver) {
        this.mouseMoves.end.x = e.screenX;
        this.mouseMoves.end.y = e.screenY;

        const xDiference = this.mouseMoves.end.x - this.mouseMoves.start.x;
        const yDiference = this.mouseMoves.end.y - this.mouseMoves.start.y;

        if (xDiference === 0 && yDiference === 0) {
          return;
        }

        if (Math.abs(xDiference) > Math.abs(yDiference)) {
          xDiference > 0 ? this.slideRight() : this.slideLeft();
        } else {
          yDiference > 0 ? this.slideDown() : this.slideUp();
        }

        if (this.isGameWon()) {
          this.gameOver = true;
          this.showMessage('Winner! Congrats! You did it!', 'win');
          document.removeEventListener('mouseup', mouseupHandler);
        }

        if (this.isGameLosed()) {
          this.gameOver = true;
          this.showMessage('You lose! Restart the game?');
          document.removeEventListener('mouseup', mouseupHandler);
        }

        this.setTwo();
      }
    };

    document.addEventListener('keyup', keyupHandler);

    document.addEventListener('mousedown', (e) => {
      this.mouseMoves.start.x = e.screenX;
      this.mouseMoves.start.y = e.screenY;
    });

    // With this listener keyup make twice event
    document.addEventListener('mouseup', mouseupHandler);
  }

  // Moves
  slideCurrentLine(line) {
    let filtredLine = this.removeZerosInLine(line);

    this.mergeTileInLine(filtredLine);

    filtredLine = this.removeZerosInLine(filtredLine);
    this.fillLineByZeros(filtredLine);

    return filtredLine;
  }

  slide(isReversed = false, isRow = true) {
    this.sameLinesAmount = 0;

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

      if (isRow) {
        this.fieldState[i] = line;
      }

      for (let j = 0; j < this.fieldSize; j++) {
        if (!isRow) {
          this.fieldState[j][i] = line[j];
        }

        const rowIndex = isRow ? i : j;
        const columnIndex = isRow ? j : i;

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

  // Utils
  showMessage(text, type) {
    this.messageSelector.textContent = text;
    this.messageSelector.classList.value = 'message';

    if (type) {
      this.messageSelector.classList.add(`message--${type}`);
    }
  }

  hideMessage() {
    this.messageSelector.classList.add('message--hidden');
  }

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

    this.gameEnded = true;

    return true;
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
    this.score += value;
    this.scoreSelector.textContent = this.score;
  }

  setTwo() {
    if (!this.stateHasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      // find random row and column to place a 2 in
      const rowIndex = Math.floor(Math.random() * this.fieldSize);
      const columnIndex = Math.floor(Math.random() * this.fieldSize);

      if (this.fieldState[rowIndex][columnIndex] === 0) {
        this.fieldState[rowIndex][columnIndex] = 2;

        const tile = document.querySelector(
          `[data-position = '${rowIndex + '-' + columnIndex}']`
        );

        tile.textContent = '2';
        tile.classList.add('field__cell--2');
        found = true;
      }
    }
  }

  updateTileByPosition(rowIndex, columnIndex) {
    const tile = document.querySelector(
      `[data-position = '${rowIndex + '-' + columnIndex}']`
    );
    const tileValue = this.fieldState[rowIndex][columnIndex];

    tile.textContent = '';
    tile.classList.value = 'field__cell';

    if (tileValue > 0) {
      tile.textContent = tileValue;
      tile.classList.add('field__cell--' + tileValue);
    }
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
        this.setScore(line[i]);
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

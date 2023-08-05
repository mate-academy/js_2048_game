'use strict';

//==============================================================
//------------------- SERVICES ---------------------------------
//==============================================================

const getRandomNumber = (min, max) =>
  Math.floor(min + Math.random() * (max + 1 - min));

const filterZero = (values) => values.filter((value) => value !== 0);

const canShift = (grid) => {
  return grid.some((row) => {
    return row.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (cell === 0) {
        return false;
      }

      const targetCell = row[index - 1];

      return targetCell === 0 || targetCell === cell;
    });
  });
};

//==============================================================
//------------------- END SERVICES -----------------------------
//==============================================================

//==============================================================
//------------------- GAME LOGIC--------------------------------
//==============================================================
class Game {
  constructor() {
    this.gameData = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.isEndGame = false;
    this.isWin = false;
    this.canShiftUp = true;
    this.canShiftDown = true;
    this.canShiftLeft = true;
    this.canShiftRight = true;
  }

  initGame() {
    const firstFieldData = this.restartGameField();
    const secondFieldData = this.restartGameField();

    return {
      firstFieldData, secondFieldData,
    };
  }

  generateNewTile() {
    return getRandomNumber(0, 9) < 6 ? 2 : 4;
  }

  restartGameField() {
    const coords = {
      x: getRandomNumber(0, 3),
      y: getRandomNumber(0, 3),
    };

    const fieldValue = this.generateNewTile();

    if (this.gameData[coords.x][coords.y] > 0) {
      coords.x = getRandomNumber(0, 3);
      coords.y = getRandomNumber(0, 3);
    }

    this.gameData[coords.y][coords.x] = fieldValue;

    return {
      coords, fieldValue,
    };
  }

  resetGameData() {
    this.gameData = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.isEndGame = false;
    this.isWin = false;
    this.canShiftUp = true;
    this.canShiftDown = true;
    this.canShiftLeft = true;
    this.canShiftRight = true;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let y = 0; y < this.gameData.length; y++) {
      const row = this.gameData[y];

      for (let x = 0; x < row.length; x++) {
        if (this.gameData[y][x] === 0) {
          emptyCells.push({
            y, x,
          });
        }
      }
    }

    return emptyCells;
  }

  getRandomEmptyCell() {
    const emptyCells = this.getEmptyCells();
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  addNewValue() {
    const emptyCells = this.getRandomEmptyCell();

    if (!emptyCells) {
      return;
    }

    const { y, x } = emptyCells;
    const newValue = this.generateNewTile();

    this.gameData[y][x] = newValue;
  }

  mergedCells(cells) {
    const filterCells = filterZero(cells);

    for (let index = 0; index < filterCells.length - 1; index++) {
      const value = filterCells[index];
      const nextValue = filterCells[index + 1];

      if (value === nextValue) {
        const newValue = value + nextValue;

        filterCells[index] = newValue;
        filterCells[index + 1] = 0;

        this.score += newValue;

        if (newValue === 2048) {
          this.isWin = true;
        }
      }
    }

    const values = filterZero(filterCells);

    if (values.length !== 4) {
      for (let index = values.length; index < 4; index++) {
        values.push(0);
      }
    }

    return values;
  }

  getColumns() {
    const columns = [];

    for (let y = 0; y < this.gameData.length; y++) {
      const row = this.gameData[y];
      const column = [];

      for (let x = 0; x < row.length; x++) {
        column.push(this.gameData[x][y]);
      }

      columns.push(column);
    }

    return columns;
  }

  shiftUp() {
    const columns = this.getColumns();

    this.canShiftUp = canShift(columns);

    if (!this.canShiftUp) {
      return;
    }

    for (let x = 0; x < columns.length; x++) {
      const column = this.mergedCells(columns[x]);

      for (let y = 0; y < column.length; y++) {
        this.gameData[y][x] = column[y];
      }
    }

    this.addNewValue();
  }

  shiftDown() {
    const columns = this.getColumns().map((row) => row.reverse());

    this.canShiftDown = canShift(columns);

    if (!this.canShiftDown) {
      return;
    }

    for (let x = 0; x < columns.length; x++) {
      const column = this.mergedCells(columns[x]).reverse();

      for (let y = 0; y < column.length; y++) {
        this.gameData[y][x] = column[y];
      }
    }

    this.addNewValue();
  }

  shiftLeft() {
    this.canShiftLeft = canShift(this.gameData);

    if (!this.canShiftLeft) {
      return;
    }

    for (let y = 0; y < this.gameData.length; y++) {
      this.gameData[y] = this.mergedCells(this.gameData[y]);
    }

    this.addNewValue();
  }

  shiftRight() {
    const reverseGameData = this.gameData.map((row) => row.reverse());

    this.canShiftRight = canShift(reverseGameData);

    if (!this.canShiftRight) {
      return;
    }

    for (let y = 0; y < this.gameData.length; y++) {
      this.gameData[y] = this.mergedCells(this.gameData[y].reverse()).reverse();
    }

    this.addNewValue();
  }
}

const game = new Game();

//==============================================================
//------------------- END GAME LOGIC----------------------------
//==============================================================

//==============================================================
//------------------------ VIEW --------------------------------
//==============================================================
class ViewMessages {
  constructor() {
    this.messageFields = document.querySelector('.message-container');
  }

  showMessageField(messageName) {
    const selector = `.message-${messageName}`;
    const messageField = this.messageFields.querySelector(selector);

    messageField.classList.remove('hidden');
  }

  hideAllMessages() {
    const messages = this.messageFields.querySelectorAll('.message');

    messages.forEach((message) => message.classList.add('hidden'));
  }
}

const viewMessages = new ViewMessages();

class ViewGameField {
  constructor() {
    this.gameField = document.querySelector('.game-field');
    this.allFields = [];

    this.gameField.querySelectorAll('.field-row').forEach((row, index) => {
      this.allFields.push([]);

      row.querySelectorAll('.field-cell').forEach((cell) => {
        this.allFields[index].push(cell);
      });
    });
  }

  getGameCell(x, y) {
    const gameRow = this.gameField.querySelectorAll('.field-row')[y];

    return gameRow.querySelectorAll('.field-cell')[x];
  }

  addNumberToField(x, y, cellValue) {
    const gameCell = this.getGameCell(x, y);

    gameCell.textContent = cellValue;
    this.addClass(gameCell, cellValue);
  }

  updateGameField() {
    const { gameData } = game;

    for (let y = 0; y < gameData.length; y++) {
      const row = gameData[y];

      for (let x = 0; x < row.length; x++) {
        const value = gameData[y][x] || '';

        this.removeClass(this.allFields[y][x]);
        this.addNumberToField(x, y, value);
      }
    }
  }

  clearGameField() {
    game.resetGameData();

    this.gameField.querySelectorAll('.field-row').forEach((row) => {
      row.querySelectorAll('.field-cell').forEach((cell) => {
        cell.textContent = '';

        this.removeClass(cell);
      });
    });
  }

  addClass(gameCell, cellValue) {
    const cellClass = `field-cell--${cellValue}`;

    gameCell.classList.add(cellClass);
  }

  removeClass(cell) {
    cell.classList.remove(cell.classList[1]);
  }
}

const viewGameField = new ViewGameField();

class ViewControls {
  constructor() {
    this.scoreField = document.querySelector('.game-score');
    this.buttonStart = document.querySelector('.button.start');

    this.buttonStart.addEventListener('click', this.updateGame.bind(this));
  }

  updateGame({ target }) {
    const { textContent } = target;

    viewGameField.clearGameField();
    viewMessages.hideAllMessages();
    this.updateGameField();
    this.updateScoreField();

    if (textContent === 'Start') {
      target.classList.add('restart');
      target.textContent = 'Restart';
    }
  }

  updateGameField() {
    const startingData = game.initGame();

    for (const date of Object.values(startingData)) {
      const { coords, fieldValue } = date;

      viewGameField.addNumberToField(coords.x, coords.y, fieldValue);
    }
  }

  updateScoreField() {
    this.scoreField.textContent = game.score;
  }
};

const viewControls = new ViewControls();

class ViewKeyEvents {
  keyEvent() {
    const { isEndGame } = game;

    if (isEndGame) {
      return;
    }

    document.addEventListener('keydown', ({ key }) => {
      switch (key) {
        case 'ArrowUp':
          game.shiftUp();

          if (game.canShiftUp) {
            viewGameField.updateGameField();
            viewControls.updateScoreField();
          }

          break;
        case 'ArrowDown':
          game.shiftDown();

          if (game.canShiftDown) {
            viewGameField.updateGameField();
            viewControls.updateScoreField();
          }

          break;
        case 'ArrowRight':
          game.shiftRight();

          if (game.canShiftRight) {
            viewGameField.updateGameField();
            viewControls.updateScoreField();
          }

          break;
        case 'ArrowLeft':
          game.shiftLeft();

          if (game.canShiftLeft) {
            viewGameField.updateGameField();
            viewControls.updateScoreField();
          }

          break;
      }

      if (game.isEndGame) {
        viewMessages.showMessageField('lose');
      }

      if (game.isWin) {
        viewMessages.showMessageField('win');
      }
    });
  }
}

class View {
  constructor() {
    this.viewControls = new ViewControls();
    this.viewKeyEvents = new ViewKeyEvents();

    this.viewKeyEvents.keyEvent();
  }

  init() {};
}

const view = new View();

view.init();
//==============================================================
//------------------------ END VIEW ----------------------------
//===================================+==========================

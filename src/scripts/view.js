
import Game from './gameLogic';

const game = new Game();

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

export default View;

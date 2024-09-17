'use strict';

// Is it just me, or this script is really ugly?

// Model access
const Game = require('../modules/Game.class');
const game = new Game();

let debugMode = false;

// Element queries
const score = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const playingFieldCells = [
  ...document.querySelectorAll('.field-cell').values(),
];

const playingField = [];

for (let row = 0; row < Game.const.PLAYING_FIELD_SIZE; row++) {
  playingField[row] = new Array(Game.const.PLAYING_FIELD_SIZE);

  for (let column = 0; column < Game.const.PLAYING_FIELD_SIZE; column++) {
    playingField[row][column] =
      playingFieldCells[row * Game.const.PLAYING_FIELD_SIZE + column];
  }
}

// event listening
playingField.forEach((row, rowIndex) => {
  row.forEach((element, columnIndex) => {
    element.addEventListener('click', () => {
      debugIncrementCell(rowIndex, columnIndex);
    });
  });
});

startButton.addEventListener('click', startButtonClickHandler);
document.addEventListener('keydown', keydownEventHandler);

// functions
function startButtonClickHandler() {
  if (startButton.classList.contains('start')) {
    startButton.classList.replace('start', 'restart');
    startButton.textContent = 'Restart';

    messageStart.classList.add('hidden');
  }

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  game.restart();
  game.start();
  syncCellValues();
}

function keydownEventHandler(keydown) {
  let needSync = true;

  switch (keydown.key) {
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'F6':
      debugMode = !debugMode;
      // eslint-disable-next-line no-console
      console.log(`debug mode: ${debugMode}`);
      needSync = false;
      break;
    default:
      needSync = false;
      break;
  }

  if (needSync) {
    switch (game.getStatus()) {
      case Game.const.STATUS_WIN:
        messageWin.classList.remove('hidden');
        break;
      case Game.const.STATUS_LOSE:
        messageLose.classList.remove('hidden');
        break;
    }

    syncCellValues();
  }
}

function syncCellValues() {
  for (let row = 0; row < Game.const.PLAYING_FIELD_SIZE; row++) {
    for (let column = 0; column < Game.const.PLAYING_FIELD_SIZE; column++) {
      const viewCell = playingField[row][column];
      const value = game.getCell(row, column);

      for (let n = 2; n <= 2048; n *= 2) {
        viewCell.classList.remove(`field-cell--${n}`);
      }

      if (value === 0) {
        viewCell.textContent = ``;
      } else {
        viewCell.textContent = `${value}`;
        viewCell.classList.add(`field-cell--${value}`);
      }
    }
  }

  score.textContent = game.getScore().toString();
}

function debugIncrementCell(row, column) {
  if (debugMode) {
    const n = game.getCell(row, column);

    if (n === 0) {
      game.setCell(row, column, 2);
    } else if (n === 2048) {
      game.setCell(row, column, 0);
    } else {
      game.setCell(row, column, n * 2);
    }

    syncCellValues();
  }
}

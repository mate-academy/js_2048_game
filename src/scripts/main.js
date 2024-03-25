'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.start');
const messageStartGame = document.querySelector('.message-start');
const messageWinGame = document.querySelector('.message-win');
const messageLoseGame = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const [...cells] = document.getElementsByClassName('field-cell');

function stylingCells() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].className = 'field-cell';

    if (game.field.flat()[i]) {
      cells[i].classList.add(`field-cell--${game.field.flat()[i]}`);
    }
  }
}

function renderField() {
  for (let i = 0; i < cells.length; i++) {
    [...cells][i].innerText = game.field.flat()[i] || '';
  }
  gameScore.innerText = game.score;
}

function handleUpButtonClickAndUpdateField() {
  if (!game.checkVictory() && game.gameStatus === 'playing') {
    game.moveUp();
    game.addingNumberToField();
    renderField();
    stylingCells();
  }

  if (game.checkVictory()) {
    messageWinGame.classList.remove('hidden');
  }
}

function handleDownButtonClickAndUpdateField() {
  if (!game.checkVictory() && game.gameStatus === 'playing') {
    game.moveDown();
    game.addingNumberToField();
    renderField();
    stylingCells();
  }

  if (game.checkVictory()) {
    messageWinGame.classList.remove('hidden');
  }
}

function handleRightButtonClickAndUpdateField() {
  if (!game.checkVictory() && game.gameStatus === 'playing') {
    game.moveRight();
    game.addingNumberToField();
    renderField();
    stylingCells();
  }

  if (game.checkVictory()) {
    messageWinGame.classList.remove('hidden');
  }
}

function handleLeftButtonClickAndUpdateField() {
  if (!game.checkVictory() && game.gameStatus === 'playing') {
    game.moveLeft();
    game.addingNumberToField();
    renderField();
    stylingCells();
  }

  if (game.checkVictory()) {
    messageWinGame.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (!startButton.classList.contains('start')) {
    game.restart();
    messageLoseGame.classList.add('hidden');
    messageWinGame.classList.add('hidden');
    gameScore.innerText = game.score;
  }

  if (startButton.classList.contains('start')) {
    game.start();
    startButton.classList.add('restart');
    startButton.classList.remove('start');
    startButton.innerText = 'Restart';
    messageStartGame.classList.add('hidden');
  }

  renderField();
  stylingCells();
});

document.addEventListener('keyup', (action) => {
  switch (action.key) {
    case 'ArrowUp':
      if (game.canMoveCellsUp()) {
        handleUpButtonClickAndUpdateField();
      }

      if (
        !game.canMoveCellsDown() &&
        !game.canMoveCellsUp() &&
        !game.canMoveCellsRight() &&
        !game.canMoveCellsLeft()
      ) {
        game.gameStatus = 'lose';
        messageLoseGame.classList.remove('hidden');
      }
      break;
    case 'ArrowLeft':
      if (game.canMoveCellsLeft()) {
        handleLeftButtonClickAndUpdateField();
      }

      if (
        !game.canMoveCellsDown() &&
        !game.canMoveCellsUp() &&
        !game.canMoveCellsRight() &&
        !game.canMoveCellsLeft()
      ) {
        game.gameStatus = 'lose';
        messageLoseGame.classList.remove('hidden');
      }
      break;
    case 'ArrowDown':
      if (game.canMoveCellsDown()) {
        handleDownButtonClickAndUpdateField();
      }

      if (
        !game.canMoveCellsDown() &&
        !game.canMoveCellsUp() &&
        !game.canMoveCellsRight() &&
        !game.canMoveCellsLeft()
      ) {
        game.gameStatus = 'lose';
        messageLoseGame.classList.remove('hidden');
      }
      break;
    case 'ArrowRight':
      if (game.canMoveCellsRight()) {
        handleRightButtonClickAndUpdateField();
      }

      if (
        !game.canMoveCellsDown() &&
        !game.canMoveCellsUp() &&
        !game.canMoveCellsRight() &&
        !game.canMoveCellsLeft()
      ) {
        game.gameStatus = 'lose';
        messageLoseGame.classList.remove('hidden');
      }
      break;
    default:
      break;
  }
});

export { renderField, stylingCells };

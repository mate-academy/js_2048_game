'use strict';

const Game = require('../modules/Game.class');

const initialBoard = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const UIBoard = document.querySelector('.game-field').querySelector('tbody');
const UIScore = document.querySelector('.game-score');
const UIButton = document.querySelector('.button');
const UIInput = document.querySelector('.input');

const UIMessageContainer = document.querySelector('.message-container');
const UIMessageLose = UIMessageContainer.querySelector('.message-lose');
const UIMessageWin = UIMessageContainer.querySelector('.message-win');
const UIMessageStart = UIMessageContainer.querySelector('.message-start');

const UITitle = document.querySelector('.title');

const game = new Game(
  initialBoard,
  UIBoard,
  UIScore,
  UIButton,
  UIInput,
  UIMessageLose,
  UIMessageWin,
  UIMessageStart,
  UITitle,
);

UIInput.addEventListener('change', (e) => {
  const size = Number(e.target.value);

  if (size > game.maxSize) {
    e.target.value = game.maxSize;
  }

  if (size < game.minSize) {
    e.target.value = game.minSize;
  }

  game.renderZeroBoard(size);
});

UIButton.addEventListener('click', (e) => {
  if (game.gameStatus === 'idle') {
    game.start();

    return;
  }

  if (game.gameStatus !== 'idle') {
    game.restart();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.gameStatus === 'playing') {
    switch (e.key) {
      case 'ArrowRight':
        game.moveHorizontally('right');
        break;

      case 'ArrowLeft':
        game.moveHorizontally('left');
        break;

      case 'ArrowDown':
        game.moveVertically('down');
        break;

      case 'ArrowUp':
        game.moveVertically('up');
        break;
    }
  }
});

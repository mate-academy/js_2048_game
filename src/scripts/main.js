'use strict';

const Game = require('../modules/Game.class');
const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

const body = document.querySelector('body');
const field = body.querySelector('.game-field tbody');
const startBtn = document.querySelector('button.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');

body.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      game.updateField(field);
      break;
    case 'ArrowRight':
      game.moveRight();
      game.updateField(field);
      break;
    case 'ArrowUp':
      game.moveUp();
      game.updateField(field);
      break;
    case 'ArrowDown':
      game.moveDown();
      game.updateField(field);
      break;
  }

  gameScore.textContent = game.score;

  if (!game.isMovesPossible()) {
    messageLose.classList.remove('hidden');
    game.status = 'lose';
  }

  if (game.isWinning()) {
    messageWin.classList.remove('hidden');
    game.status = 'win';
  }
});

startBtn.addEventListener('click', (e) => {
  if (e.target.classList.contains('restart')) {
    game.restart();
    e.target.classList = 'button start';
    e.target.textContent = 'Start';
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  } else {
    game.start();
    e.target.classList = 'button restart';
    e.target.textContent = 'Restart';
  }

  messageStart.classList.toggle('hidden');
  gameScore.textContent = game.score;
  game.updateField(field);
});

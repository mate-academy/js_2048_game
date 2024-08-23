'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.getElementsByClassName('button start')[0];
const score = document.getElementsByClassName('game-score')[0];
const controls = document.getElementsByClassName('controls')[0];
const startMessage = document.getElementsByClassName(
  'message message-start',
)[0];
const winMessage = document.getElementsByClassName(
  'message message-win hidden',
)[0];
const loseMessage = document.getElementsByClassName(
  'message message-lose hidden',
)[0];
const restart = document.createElement('button');

restart.className = 'button restart';
restart.style.display = 'none';
restart.innerText = 'Restart';

controls.appendChild(restart);

startButton.addEventListener('click', () => {
  game.start();
  game.score = 'playing';

  document.addEventListener('keydown', handleKeyPress);
  checkGameStatus();

  startButton.style.display = 'none';
  restart.style.display = '';
  startMessage.classList.add('hidden');
});

function handleKeyPress(e) {
  const prevState = game.initialState.map((row) => [...row]);

  switch (e.code) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  if (game.stateChanged(prevState)) {
    game.createPlate();
  }

  score.innerText = game.getScore();

  checkGameStatus();
}

function checkGameStatus() {
  if (game.isWin()) {
    game.status = 'win';
    winMessage.classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyPress);

    return;
  }

  if (game.isGameOver()) {
    game.status = 'lose';

    loseMessage.classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyPress);
  }
}

restart.addEventListener('click', () => {
  game.restart();
  game.status = 'idle';
  startButton.style.display = '';
  restart.style.display = 'none';
  score.innerText = game.getScore();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
});

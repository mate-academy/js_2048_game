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
  // Проверка на победу
  if (game.isWin()) {
    winMessage.classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyPress);

    return;
  }

  // Проверка на поражение
  if (game.isGameOver()) {
    loseMessage.classList.remove('hidden');
    document.removeEventListener('keydown', handleKeyPress);
  }
}

restart.addEventListener('click', () => {
  game.restart();
  startButton.style.display = '';
  restart.style.display = 'none';
  score.innerText = game.getScore();

  // Сбрасываем сообщения о победе и поражении при перезапуске
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  // Повторная активация слушателя клавиш после перезапуска
  startButton.click();
});

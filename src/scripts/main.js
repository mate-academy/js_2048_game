'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const initialState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const game = new Game(initialState);

// Write your code here
const startBtn = document.querySelector('.button.start');

startBtn.addEventListener('click', () => {
  const score = document.querySelector('.game-score');
  const isIdle = game.gameStatus === 'idle';

  if (game.gameStatus === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  game.renderGameBoard(game.gameBoard);
  score.textContent = game.getScore();

  startBtn.classList.toggle('start', !isIdle);
  startBtn.classList.toggle('restart', isIdle);
  startBtn.textContent = isIdle ? 'Restart' : 'Start';

  updateMessages(game.gameStatus);
});

document.addEventListener('keydown', (e) => {
  if(game.gameStatus === 'idle') {
    return
  }
  
  const score = document.querySelector('.game-score');

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
  }
  score.textContent = game.getScore();
  updateMessages(game.gameStatus);
});

function updateMessages(gameStatus) {
  const messageStart = document.querySelector('.message-start');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');

  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  switch (gameStatus) {
    case 'idle':
      messageStart.classList.remove('hidden');
      break;
    case 'win':
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageLose.classList.remove('hidden');
      break;
  }
}

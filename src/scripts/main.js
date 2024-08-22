'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.getElementsByClassName('button start')[0];
const score = document.getElementsByClassName('game-score')[0];
const controls = document.getElementsByClassName('controls')[0];
const startMessage = document.getElementsByClassName(
  'message message-start',
)[0];
const restart = document.createElement('button');

restart.className = 'button restart';
restart.style.display = 'none';
restart.innerText = 'Restart';

controls.appendChild(restart);

startButton.addEventListener('click', (e) => {
  game.start();

  document.addEventListener('keydown', (y) => {
    switch (y.code) {
      case 'ArrowLeft':
        game.moveLeft();
        score.innerText = game.getScore();
        break;
      case 'ArrowRight':
        game.moveRight();
        score.innerText = game.getScore();
        break;
      case 'ArrowUp':
        game.moveUp();
        score.innerText = game.getScore();
        break;
      case 'ArrowDown':
        game.moveDown();
        score.innerText = game.getScore();
        break;
    }
  });
  startButton.style.display = 'none';
  restart.style.display = '';
  startMessage.className += ' hidden';
});

restart.addEventListener('click', () => {
  game.restart();
  startButton.style.display = '';
  restart.style.display = 'none';
  score.innerText = game.getScore();

});

'use strict';

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const Game = require('../modules/Game.class');
const game = new Game();
const audio = new Audio(new URL('../sounds/soundtrack.mp3', import.meta.url));

button.addEventListener('click', (e) => {
  score.textContent = '0';

  if (e.target.classList.contains('start')) {
    game.start();

    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.textContent = 'Restart';

    game.visualizeTable();
  } else if (e.target.classList.contains('restart')) {
    e.target.classList.remove('restart');
    e.target.classList.add('start');
    e.target.textContent = 'Start';
    game.restart();

    game.visualizeTable();
  }

  messageRedactor();
});

document.addEventListener('click', () => {
  audio.volume = 0.3;
  audio.loop = true;

  audio.play();
});

let canMove = true;

document.addEventListener('keydown', (e) => {
  if (!canMove) {
    return;
  }

  canMove = false;

  handleKey(e.key);

  setTimeout(() => {
    canMove = true;
  }, 100);
});

function handleKey(key) {
  switch (key) {
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
  messageRedactor();
}

function messageRedactor() {
  messageStart.classList.toggle('hidden', game.getStatus() !== 'idle');
  messageWin.classList.toggle('hidden', game.getStatus() !== 'win');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');
}

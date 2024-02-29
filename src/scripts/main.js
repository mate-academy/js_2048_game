'use strict';

const Game = require('../modules/Game.class');

const gameRefs = {
  score: document.querySelector('[data-score="score"]'),
  best: document.querySelector('[data-best="best"]'),
  rows: document.querySelectorAll('.field__cell'),
  start: document.querySelector('.button'),
  field: document.querySelector('.game__field'),
  messageWin: document.querySelector('.message__content--win'),
  messageLose: document.querySelector('.message__content--lose'),
  messageStart: document.querySelector('.message__content--start'),
};

let countKeyPress = 0;

const game = new Game();

if (gameRefs.score) {
  gameRefs.score.innerText = game.getScore();
}

if (gameRefs.best) {
  gameRefs.best.innerText = game.getBestScore();
}

function updateElement() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = document.getElementById(`${r}-${c}`);
      const num = game.getState()[r][c];

      game.updateTile(tile, num);
      gameRefs.best.innerText = game.getBestScore();
    }
  }
}

updateElement();

gameRefs.start.addEventListener('click', () => {
  if (gameRefs.start.textContent === 'Start') {
    game.start();
    updateElement();
    game.updateScore(gameRefs.score);
    gameRefs.messageStart.classList.add('hidden');
  }

  if (gameRefs.start.textContent === 'Restart') {
    if (game.getStatus() === 'win') {
      gameRefs.messageWin.classList.add('hidden');
    }

    if (game.getStatus() === 'lose') {
      gameRefs.messageLose.classList.add('hidden');
    }
    game.restart();
    gameRefs.start.innerText = 'Start';
    gameRefs.start.classList.add('start');
    gameRefs.start.classList.remove('restart');
    countKeyPress = 0;
    updateElement();
    game.updateScore(gameRefs.score);
    gameRefs.messageStart.classList.remove('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault();
  }
});

document.addEventListener('keyup', (e) => {
  switch (game.getStatus()) {
    case 'playing':
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
        default:
          break;
      }

      updateElement();
      countKeyPress++;
      break;
    case 'win':
      gameRefs.messageWin.classList.remove('hidden');
      break;
    case 'lose':
      gameRefs.messageLose.classList.remove('hidden');
      break;
    default:
      break;
  }

  game.updateScore(gameRefs.score);

  const user = window.localStorage.getItem('user');

  game.setBestScore(game.getScore(), user);

  if (countKeyPress >= 1) {
    gameRefs.start.innerText = 'Restart';
    gameRefs.start.classList.remove('start');
    gameRefs.start.classList.add('restart');
  }
});

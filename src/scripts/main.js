'use strict';

const Game = require('../modules/Game.class');

const gameRefs = {
  score: document.querySelector('[data-score="score"]'),
  best: document.querySelector('[data-best="best"]'),
  rows: document.querySelectorAll('.field__cell'),
  start: document.querySelector('.button--start'),
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
  if (game.getStatus() === 'playing') {
    if (e.code === 'ArrowLeft') {
      game.moveLeft();
      updateElement();
      countKeyPress++;
    } else if (e.code === 'ArrowRight') {
      game.moveRight();
      updateElement();
      countKeyPress++;
    } else if (e.code === 'ArrowUp') {
      game.moveUp();
      updateElement();
      countKeyPress++;
    } else if (e.code === 'ArrowDown') {
      game.moveDown();
      updateElement();
      countKeyPress++;
    }
  }
  game.updateScore(gameRefs.score);

  const user = window.localStorage.getItem('user');

  game.setBestScore(game.getScore(), user);

  if (game.getStatus() === 'win') {
    gameRefs.messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    gameRefs.messageLose.classList.remove('hidden');
  }

  if (countKeyPress >= 1) {
    gameRefs.start.innerText = 'Restart';
  }
});

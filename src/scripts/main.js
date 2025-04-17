'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();
const score = document.querySelector('.game-score');

document.addEventListener('click', (e) => {
  e.preventDefault();

  if (e.target.classList.contains('start')) {
    game.start();
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.textContent = 'Restart';
  }

  if (e.target.classList.contains('restart')) {
    game.restart();
    score.innerHTML = '0';

    document.querySelectorAll('.message').forEach((ev) => {
      ev.classList.add('hidden');
    });
  }

  if (game.status === 'playing') {
    document.querySelector('.message-start').classList.add('hidden');
  }
});

document.addEventListener('keydown', (e) => {
  const oldState = JSON.parse(JSON.stringify(game.board));

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      break;
  }

  game.printTiles();

  score.textContent = game.score;

  if (gridsAreDifferent(oldState, game.board)) {
    game.createRandomTile();
  }

  game.winGame();
  game.loseGame();

  if (game.status === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (game.status === 'lose') {
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.remove('hidden');
  }
});

function gridsAreDifferent(grid1, grid2) {
  for (let row = 0; row < grid1.length; row++) {
    for (let col = 0; col < grid1[row].length; col++) {
      if (grid1[row][col] !== grid2[row][col]) {
        return true;
      }
    }
  }

  return false;
}

'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

function updateScoreUI() {
  document.querySelector('.game-score').innerText = game.score;
}

function updateCell(cell, num) {
  cell.className = 'field-cell';

  if (num > 0) {
    cell.classList.add(`field-cell--${num}`);
    cell.innerText = num;
  } else {
    cell.innerText = '';
  }
}

function updateBoardHTML() {
  for (let r = 0; r < game.size; r++) {
    for (let c = 0; c < game.size; c++) {
      const cell = game.tr[r].children[c];
      const num = game.board[r][c];

      updateCell(cell, num);
    }
  }

  updateScoreUI();
}

document.querySelector('.button.start').addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  updateBoardHTML();
});

document.addEventListener('keyup', (e) => {
  game.sideMovement(e);
  updateBoardHTML();
});

'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  // start button
  const startBtn = document.querySelector('#start-btn');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (game.getStatus() === 'idle') {
        game.start();
      } else {
        game.restart();
      }
      render();
    });
  }

  // keyboard moves
  document.addEventListener('keydown', (ev) => {
    switch (ev.key) {
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
    render();
  });

  render();
});

function render() {
  const board = game.getState();
  const score = game.getScore();
  const stat = game.getStatus();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const cell = document.querySelector(`#cell-${r}-${c}`);

      if (cell) {
        cell.textContent = board[r][c] || '';
        cell.className = `field-cell ${board[r][c] ? 'field-cell--' + board[r][c] : ''}`;
      }
    }
  }

  const scoreEl = document.querySelector('#score');

  if (scoreEl) {
    scoreEl.textContent = score;
  }

  const statusEl = document.querySelector('#status');

  if (statusEl) {
    statusEl.textContent = stat;
  }
}

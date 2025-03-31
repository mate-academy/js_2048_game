import { Game } from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const cells = Array.from(document.querySelectorAll('.field-cell'));
  const scoreElement = document.querySelector('.game-score');
  const startButton = document.querySelector('.button');
  const messageStart = document.querySelector('.message-start');
  const messageWin = document.querySelector('.message-win');
  const messageLose = document.querySelector('.message-lose');

  function updateUI(movedTiles = [], newTile = null) {
    const state = game.getState();

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4); // Здесь мы предполагаем 4 столбца
      const col = index % 4; // Здесь мы предполагаем 4 столбца
      const value = state[row][col];
      const prevValue = cell.textContent ? parseInt(cell.textContent) : 0;

      cell.textContent = value || '';
      cell.className = `field-cell${value ? ` field-cell--${value}` : ''}`;

      // Анимация слияния
      const wasMerged = movedTiles.some(([r, c]) => r === row && c === col);

      if (wasMerged) {
        cell.style.animation = 'merge-animation 0.3s ease';

        setTimeout(() => {
          cell.style.animation = '';
        }, 300);
      }

      // Анимация появления новой плитки
      if (
        newTile &&
        row === newTile[0] &&
        col === newTile[1] &&
        value !== prevValue
      ) {
        cell.style.animation = 'appear-animation 0.3s ease';

        setTimeout(() => {
          cell.style.animation = '';
        }, 300);
      }
    });

    scoreElement.textContent = game.getScore();
    messageStart.classList.toggle('hidden', game.getStatus() !== 'idle');
    messageWin.classList.toggle('hidden', game.getStatus() !== 'won');
    messageLose.classList.toggle('hidden', game.getStatus() !== 'lost');
    startButton.classList.toggle('start', game.getStatus() === 'idle');
    startButton.classList.toggle('restart', game.getStatus() !== 'idle');
    startButton.textContent = game.getStatus() === 'idle' ? 'Start' : 'Restart';
  }

  startButton.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
    }
    updateUI();
  });

  document.addEventListener('keydown', (e) => {
    if (game.getStatus() !== 'playing') {
      return;
    }

    let moved = false;
    let mergedTiles = [];
    let newTile = null;

    switch (e.key) {
      case 'ArrowLeft':
        [moved, mergedTiles, newTile] = game.moveLeft();
        break;
      case 'ArrowRight':
        [moved, mergedTiles, newTile] = game.moveRight();
        break;
      case 'ArrowUp':
        [moved, mergedTiles, newTile] = game.moveUp();
        break;
      case 'ArrowDown':
        [moved, mergedTiles, newTile] = game.moveDown();
        break;
    }

    if (moved) {
      updateUI(mergedTiles, newTile);
    }
  });

  updateUI();
});

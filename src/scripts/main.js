'use strict';

import Game from '../modules/Game.class';

const game = new Game();

document.addEventListener('DOMContentLoaded', () => {
  const statusElement = document.getElementsByClassName('message')[0];

  // Перевіряємо, чи існує елемент
  if (statusElement) {
    statusElement.textContent = game.getStatus();
  } else {
    return "Елемент з класом 'message' не знайдено.";
  }

  document.querySelector('.start').addEventListener('click', () => {
    game.start();
    game.updateBoard(); // Оновлюємо поле гри
    statusElement.textContent = game.getStatus();
  });

  document.addEventListener('keydown', (e) => {
    if (game.isGameOver || game.isWin) {
      return; // Більше не приймаємо хід
    }

    if (e.key === 'ArrowLeft') {
      game.moveLeft();
    } else if (e.key === 'ArrowRight') {
      game.moveRight();
    } else if (e.key === 'ArrowUp') {
      game.moveUp();
    } else if (e.key === 'ArrowDown') {
      game.moveDown();
    }

    // Оновлюємо статус та поле гри
    statusElement.textContent = game.getStatus();
    game.updateBoard();
  });
});

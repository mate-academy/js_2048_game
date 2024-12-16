/* eslint-disable no-shadow */
'use strict';
import Game from '../modules/Game.class.js';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const startButton = document.querySelector('.button.start');
  const restartButton = document.querySelector('.button.restart');
  const scoreElement = document.querySelector('.game-score');
  const messageLose = document.querySelector('.message-lose');
  const messageWin = document.querySelector('.message-win');
  const messageStart = document.querySelector('.message-start');
  const gameField = document.querySelector('.game-field');

  function updateUI() {
    // Обновление счета
    scoreElement.textContent = game.getScore();

    // Проверка на выигрыш или окончание игры
    if (game.getStatus() === 'game-win') {
      messageLose.classList.add('hidden');
      messageStart.classList.add('hidden');
      messageWin.classList.remove('hidden');
    } else if (game.getStatus() === 'game-over') {
      messageWin.classList.add('hidden');
      messageStart.classList.add('hidden');
      messageLose.classList.remove('hidden');
    }

    // Обновление игрового поля
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = gameField.rows[row].cells[col];
        const value = game.getState()[row][col];

        if (value) {
          cell.textContent = value;
          cell.classList.add(`field-cell--${value}`);
        } else {
          cell.textContent = '';
          cell.classList.remove(/field-cell--\d+/);
        }
      }
    }
  }

  startButton.addEventListener('click', () => {
    game.start();
    startButton.classList.add('hidden');
    updateUI();
  });

  restartButton.addEventListener('click', () => {
    game.restart();
    updateUI();
  });

  // Слушаем нажатия клавиш со стрелками
  document.addEventListener('keydown', (event) => {
    if (game.getStatus() === 'game-start') {
      return;
    }
    game.handleKeyPress(event);
    updateUI();
  });

  updateUI();
});

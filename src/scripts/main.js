/* eslint-disable max-len */
/* eslint-disable no-shadow */
'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

document.addEventListener('keydown', (event) => {
  if (game.status === 'playing') {
    switch (event.key) {
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
  }

  workingWithHTMLFile();
});

function workingWithHTMLFile() {
  // заповнення комірок html
  const board = game.getState();
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, i) => {
    const value = board[Math.floor(i / 4)][i % 4];

    cell.textContent = value || '';
    cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
  });
  // //////////

  // вивід тексту на екран в залежності від результату win/lose
  const status = game.getStatus();

  if (status === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (status === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
  // ////////

  // початок/перезапуск гри
  document.querySelector('.button').addEventListener('click', () => {
    if (game.getStatus() === 'playing') {
      game.restart();
      document.querySelector('.message-container').classList.add('hidden');
    } else {
      game.start();
    }

    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.button').classList.remove('start');
    document.querySelector('.button').classList.add('restart'); // заміняємо клас для button
    document.querySelector('.button').textContent = 'Restart'; // заміняємо текст button

    workingWithHTMLFile();
  });
  // ///////

  // добавлення score на екран
  document.querySelector('.game-score').textContent = game.getScore();
  // ////////
}

// запускаємо дошку вперше
workingWithHTMLFile();

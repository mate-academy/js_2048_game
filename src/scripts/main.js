'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const start = document.querySelector('.button');

start.addEventListener('click', () => {
  if (start.classList.contains('start')) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.textContent = 'Restart';
  } else {
    start.classList.add('start');
    start.classList.remove('restart');
    start.textContent = 'Start';
  }
});

const rows = Array.from(document.querySelectorAll('.field-row')).map((row) => {
  return Array.from(row.querySelectorAll('.field-cell'));
});

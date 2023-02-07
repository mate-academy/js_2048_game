// 'use strict';

import { Game } from './Components/Game';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message');

let game;

button.addEventListener('click', () => {
  if (game) {
    game.reset();
    game = new Game();
  } else {
    game = new Game();
  }

  button.classList.remove('start');
  button.classList.add('restart');
  button.innerHTML = 'Restart';
  messageStart.remove();
});

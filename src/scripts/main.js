'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const buttonStart = document.querySelector('.start');

buttonStart.addEventListener('click', () => {
  game.start();
});

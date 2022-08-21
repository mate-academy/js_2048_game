'use strict';

const Game2048 = require('./classes/Game2048');

const addGameBtn = document.querySelector('.page__button-new');

addGameBtn.addEventListener('click', () => {
  const gameContainer = document.createElement('section');

  gameContainer.className = 'app';
  addGameBtn.before(gameContainer);

  const newGame = new Game2048(gameContainer, 4);

  newGame.create();
});

const baseGame = new Game2048('.app', 4);

baseGame.create();

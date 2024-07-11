'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

// Write your code here

const startButton = document.querySelector('.button.start');

startButton.addEventListener('click', () => {
  game.start();
});

'use strict';

// Uncomment the next lines to use your game instance in the browser

import Game from '../modules/Game.class.js';
import toggleGameMode from './toggleGameMode.js';

const game = new Game();

// Write your code here
const button = document.querySelector('button');

const App = () => {
  button.addEventListener('click', () => {
    toggleGameMode(game, button);
  });
};

App();

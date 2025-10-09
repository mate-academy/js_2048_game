'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

import Game from '../modules/Game.class.js';

const game = new Game();

game.start();
// eslint-disable-next-line no-console
console.table(game.getState());
// console.log(game.getScore(), game.getStatus());

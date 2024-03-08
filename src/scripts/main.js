'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.getElementById('start-button');

startButton.addEventListener('click', game.start);
// Write your code here

'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const mainButton = document.querySelector('button');

mainButton.addEventListener('click', (e) => game.handleMainButtonClicks(e));

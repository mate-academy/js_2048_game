'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const gameRef = document.getElementById('game-2048');

if (gameRef) {
  game.initialize(gameRef);
}

'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

const startButton = document.querySelector('.button')

startButton.onclick = () => {
    if (startButton.textContent === 'Start'){
        game.start();
    } else {
        game.restart();
    }
}

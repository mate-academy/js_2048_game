'use strict';

const Game = require('../modules/Game.class');

// eslint-disable-next-line no-unused-vars
const game = new Game();

window.addEventListener('load', () => {
  const startBtn = document.querySelector('.button.start');
  const startMsg = document.querySelector('.message.message-start');
  const backgroundMusic = document.getElementById('background-music');
  const clickSound = document.getElementById('click-sound');
  const swipeSound = document.getElementById('swipe-sound');

  if (!startBtn) {
    throw new Error('Start button is not found!');
  }

  startBtn.addEventListener('click', () => {
    game.start();

    startMsg.classList.add('hidden');

    if (backgroundMusic) {
      backgroundMusic.loop = true;
      backgroundMusic.play();
    }

    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play();
    }
  });

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowUp':
        game.move('up', swipeSound);
        break;
      case 'ArrowDown':
        game.move('down', swipeSound);
        break;
      case 'ArrowLeft':
        game.move('left', swipeSound);
        break;
      case 'ArrowRight':
        game.move('right', swipeSound);
        break;
    }
  });
});

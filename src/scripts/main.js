'use strict';

const Game = require('../modules/Game.class');

const scoreColEls = [...document.querySelectorAll('.score-col')];

export function resetScore() {
  if (scoreColEls.length) {
    for (let i = 0; i < scoreColEls.length; i++) {
      // Remove class that starts with score-col-- if it exists
      const classToRemove = [...scoreColEls[i].classList].find((className) => {
        return className.startsWith('score-col--');
      });

      if (classToRemove) {
        scoreColEls[i].classList.remove(classToRemove);
      }
    }
  }
}

window.addEventListener('load', () => {
  const startBtn = document.querySelector('.button.start');
  const startMsg = document.querySelector('.message.message-start');
  const backgroundMusic = document.getElementById('background-music');
  const clickSound = document.getElementById('click-sound');

  if (!startBtn) {
    throw new Error('Start button is not found!');
  }

  function initializeGame() {
    const game = new Game();

    game.start();

    startMsg.classList.add('hidden');

    if (backgroundMusic) {
      backgroundMusic.loop = true;
      backgroundMusic.play();
    }

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
          game.move('up');
          break;
        case 'ArrowDown':
          game.move('down');
          break;
        case 'ArrowLeft':
          game.move('left');
          break;
        case 'ArrowRight':
          game.move('right');
          break;
      }
    });
  }

  startBtn.addEventListener('click', () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play();
    }

    resetScore();
    initializeGame();

    startBtn.classList.add('restart');
    startBtn.classList.remove('start');
    startBtn.textContent = 'restart';
  });
});

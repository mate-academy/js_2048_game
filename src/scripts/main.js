'use strict';

const Game = require('../modules/Game.class');

const scoreColEls = [...document.querySelectorAll('.score-col')];
const loseMsgEl = document.querySelector('.message.message-lose');
const winMsgEl = document.querySelector('.message.message-win');

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

export function resetMsgs() {
  if (loseMsgEl) {
    loseMsgEl.classList.add('hidden');
  }

  if (winMsgEl) {
    winMsgEl.classList.add('hidden');
  }
}

export function stopBgMusic(bgMusic) {
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    bgMusic.currentTime = 0;
  }
}

window.addEventListener('load', () => {
  const startBtn = document.querySelector('.button.start');
  const startMsg = document.querySelector('.message.message-start');
  const clickSound = document.getElementById('click-sound');
  const backgroundMusic = document.getElementById('background-music');

  let keydownEventHandler;

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

    keydownEventHandler = (e) => {
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
    };

    document.addEventListener('keydown', keydownEventHandler);
  }

  startBtn.addEventListener('click', () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play();
    }

    if (keydownEventHandler) {
      document.removeEventListener('keydown', keydownEventHandler);
    }

    resetScore();
    resetMsgs();
    initializeGame();

    startBtn.classList.add('restart');
    startBtn.classList.remove('start');
    startBtn.textContent = 'restart';
  });
});

'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameScore = document.querySelector('.game-score');

button.addEventListener('click', activateGame);

function activateGame() {
  button.classList.toggle('restart');
  button.classList.toggle('start');
  messageStart.classList.toggle('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  gameScore.textContent = 0;

  if (button.className.includes('start')) {
    button.textContent = 'Start';

    game.restart();
  }

  if (button.className.includes('restart')) {
    button.textContent = 'Restart';

    game.start();
  }

  document.addEventListener('keydown', handleKeydown);
}

//     if (this.status === 'idle'
//       || this.status === 'lose'
//       || this.status === 'win'
//     ) {
//       this.start();
//     } else {
//       this.restart();
//     }

//     this.updateUI();
//     document.querySelector('.message-win').classList.add('hidden');
//     document.querySelector('.message-lose').classList.add('hidden');
//   });
// }

function handleKeydown(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  game.updateUI();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

game.updateUI();

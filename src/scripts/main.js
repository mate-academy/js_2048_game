import { Tile } from './tile.js';

const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const gameField = document.querySelector('.game-field');

function keydownFunction(e) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';

      messageStart.classList.add('hidden');
    }
  }

  switch (e.key) {
    case 'ArrowLeft':
      for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {

        }
      }

      break;
    case 'ArrowRight':
      break;
    case 'ArrowUp':
      break;
    case 'ArrowDown':
      break;
  }
}

function buttonClickFunction() {
  if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
    messageLose.classList.add('hidden');

    messageStart.classList.remove('hidden');
  }

  Tile.clearField();

  Tile.initNewTile();
  Tile.initNewTile();
}

window.onload = () => {
  buttonClickFunction();
};

window.addEventListener('keydown', keydownFunction);
button.addEventListener('click', buttonClickFunction);

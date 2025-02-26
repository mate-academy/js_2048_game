import Game from '../modules/Game.class';
import { GAME_STATUS } from '../constants';

const game = new Game();

const score = document.querySelector('.game-score');
const buttonStart = document.querySelector('.button.start');
const gameCells = document.querySelectorAll('.field-cell');
const messages = document.querySelectorAll('.message');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

buttonStart.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  switch (gameStatus) {
    case GAME_STATUS.IDLE:
    case GAME_STATUS.LOSE:
    case GAME_STATUS.WIN:
      game.start();
      buttonStart.textContent = 'Restart';
      buttonStart.classList.remove('start');
      buttonStart.classList.add('restart');
      break;
    default:
      game.restart();
      buttonStart.textContent = 'Start';
      buttonStart.classList.remove('restart');
      buttonStart.classList.add('start');
      break;
  }

  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== GAME_STATUS.PLAYING) {
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
    default:
      return;
  }

  updateUI();
});

function updateUI() {
  const state = game.getState();

  gameCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  score.textContent = game.getScore();

  const gameStatus = game.getStatus();

  messages.forEach((msg) => msg.classList.add('hidden'));

  switch (gameStatus) {
    case GAME_STATUS.WIN:
      messageWin.classList.remove('hidden');
      break;
    case GAME_STATUS.LOSE:
      messageLose.classList.remove('hidden');
      break;
    case GAME_STATUS.IDLE:
      messageStart.classList.remove('hidden');
      break;
  }
}

updateUI();

import { field, resetField, spawn, checkIsOver } from './field';

const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

export const score = document.querySelector('.game-score');
export let started = false;

export function resetGame() {
  resetField();
  spawn();
  spawn();

  started = true;
  score.innerText = 0;
}

export function winGame(i, j) {
  if (field[i][j] === 2048) {
    winMessage.classList.remove('hidden');
    started = false;

    return true;
  }

  return false;
}

export function loseGame() {
  if (checkIsOver()) {
    loseMessage.classList.remove('hidden');
    started = false;
  }
}

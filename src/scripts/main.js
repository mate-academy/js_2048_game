import { Game } from '../modules/Game.class.js';

const game = new Game();
const scoreElement = document.querySelector('.game-score');
const mainButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const cells = document.querySelectorAll('.field-cell');

function updateUI() {
  const state = game.getState();
  const gameStatus = game.getStatus();

  // 1. Atualizar Score
  scoreElement.textContent = game.getScore();

  // 2. Atualizar Grelha
  let cellIndex = 0;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const value = state[r][c];
      const cell = cells[cellIndex];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }
      cellIndex++;
    }
  }

  // 3. Gerir mensagens de fim de jogo
  if (gameStatus === 'won') {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'lost') {
    loseMessage.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  if (!keys.includes(keyboardEvent.key)) {
    return;
  }

  // CORREÇÃO: Captura se o movimento realmente ocorreu
  let moved = false;

  if (keyboardEvent.key === 'ArrowLeft') {
    moved = game.moveLeft();
  }

  if (keyboardEvent.key === 'ArrowRight') {
    moved = game.moveRight();
  }

  if (keyboardEvent.key === 'ArrowUp') {
    moved = game.moveUp();
  }

  if (keyboardEvent.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  // CORREÇÃO: Só atualiza o estado inicial se houve movimento
  if (moved) {
    startMessage.classList.add('hidden');
    mainButton.textContent = 'Restart';
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
  }

  updateUI();
});

mainButton.addEventListener('click', () => {
  game.restart();
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');
  mainButton.textContent = 'Restart';
  mainButton.classList.remove('start');
  mainButton.classList.add('restart');
  updateUI();
});

updateUI();

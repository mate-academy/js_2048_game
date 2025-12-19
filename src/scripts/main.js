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
    // CORRIGIDO: gameStatus em vez de status
    loseMessage.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (keyboardEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

  // CORRIGIDO: keyboardEvent em vez de event
  if (!keys.includes(keyboardEvent.key)) {
    return;
  }

  if (keyboardEvent.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (keyboardEvent.key === 'ArrowRight') {
    game.moveRight();
  }

  if (keyboardEvent.key === 'ArrowUp') {
    game.moveUp();
  }

  if (keyboardEvent.key === 'ArrowDown') {
    game.moveDown();
  }

  // Esconder mensagem inicial e mudar botão no primeiro movimento
  startMessage.classList.add('hidden');
  mainButton.textContent = 'Restart';
  mainButton.classList.remove('start');
  mainButton.classList.add('restart');

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

import { Game } from '../modules/Game.class';

const startBtn = document.querySelector('.start');
const scoreSpan = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');

let game;

// Atualiza a interface com base no estado do jogo
function updateView() {
  const state = game.getState();
  let index = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = cells[index];
      const value = state[row][col];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      index++;
    }
  }

  scoreSpan.textContent = game.getScore();

  messageStart.classList.add('hidden');
  messageWin.classList.toggle('hidden', game.getStatus() !== 'win');
  messageLose.classList.toggle('hidden', game.getStatus() !== 'lose');
}

// Movimentos
function handleMove(direction) {
  if (!game || game.getStatus() !== 'playing') {
    return;
  }

  switch (direction) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      return;
  }

  updateView();
}

// Inicia o jogo
startBtn.addEventListener('click', () => {
  game = new Game();
  game.start();
  updateView();

  startBtn.textContent = 'Restart';
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
});

// Movimentação com teclado
document.addEventListener('keydown', (e) => {
  handleMove(e.key);
});

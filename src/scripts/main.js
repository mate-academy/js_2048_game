import { Game } from './modules/Game.class.js';

let game = new Game();
let firstMoveMade = false;

const boardContainer = document.querySelector('.board');
const scoreEl = document.querySelector('.score');
const statusEl = document.querySelector('.status');
const startBtn = document.querySelector('.start-btn');
const startMsg = document.querySelector('.start-msg');

const render = () => {
  if (!game) return;
  boardContainer.innerHTML = '';
  game.getState().forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'row';
    row.forEach(cell => {
      const cellEl = document.createElement('div');
      cellEl.className = `cell field-cell--${cell}`;
      cellEl.textContent = cell || '';
      rowEl.appendChild(cellEl);
    });
    boardContainer.appendChild(rowEl);
  });
  scoreEl.textContent = game.getScore();
  statusEl.textContent = game.getStatus();
};

document.addEventListener('keydown', (e) => {
  if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) {
    const moved = {
      ArrowLeft: () => game.moveLeft(),
      ArrowRight: () => game.moveRight(),
      ArrowUp: () => game.moveUp(),
      ArrowDown: () => game.moveDown()
    }[e.key]();
    if (moved && !firstMoveMade) {
      firstMoveMade = true;
      startBtn.textContent = 'Restart';
      startBtn.classList.add('restart');
      startMsg.classList.add('hidden');
    }
    render();
  }
});

startBtn.addEventListener('click', () => {
  if (firstMoveMade) game.restart();
  else {
    startMsg.classList.add('hidden');
    firstMoveMade = true;
  }
  render();
});

render();

import { Game } from './modules/Game.class.js';
const game = new Game();
const startMsgEl = document.querySelector('#startMessage');
const winMsgEl = document.querySelector('#winMessage');
const overMsgEl = document.querySelector('#gameOverMessage');
const mainBtn = document.querySelector('#restartBtn');
const hide = (el) => el && el.classList.add('hidden');
const show = (el) => el && el.classList.remove('hidden');
let hasMadeFirstMove = false;
function setInitialUIState() {
  show(startMsgEl);
  hide(winMsgEl);
  hide(overMsgEl);
  if (mainBtn) {
    mainBtn.textContent = 'Start';
    mainBtn.classList.remove('restart');
    mainBtn.classList.add('start');
  }
}
game.start();
setInitialUIState();
updateUI();
function onFirstMove() {
  if (!hasMadeFirstMove) {
    hasMadeFirstMove = true;
    hide(startMsgEl);
    if (mainBtn) {
      mainBtn.textContent = 'Restart';
      mainBtn.classList.remove('start');
      mainBtn.classList.add('restart');
    }
  }
}
document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') return;
  switch (e.key) {
    case 'ArrowLeft':  game.moveLeft();  onFirstMove(); break;
    case 'ArrowRight': game.moveRight(); onFirstMove(); break;
    case 'ArrowUp':    game.moveUp();    onFirstMove(); break;
    case 'ArrowDown':  game.moveDown();  onFirstMove(); break;
    default: return;
  }
  updateUI();
});
function updateUI() {
  const boardEl = document.querySelector('#board');
  boardEl.innerHTML = '';
  game.getState().forEach((row) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'row';
    row.forEach((cell) => {
      const cellEl = document.createElement('div');
      cellEl.className = 'field-cell';
      if (cell > 0) cellEl.classList.add(`field-cell--${cell}`);
      cellEl.textContent = cell === 0 ? '' : cell;
      rowEl.appendChild(cellEl);
    });
    boardEl.appendChild(rowEl);
  });
  document.querySelector('#score').textContent = game.getScore();
  const status = game.getStatus();
  if (status === 'win') {
    hide(startMsgEl);
    show(winMsgEl);
    hide(overMsgEl);
  } else if (status === 'over') {
    hide(startMsgEl);
    hide(winMsgEl);
    show(overMsgEl);
  } else {
    hide(winMsgEl);
    hide(overMsgEl);
  }
}
mainBtn.addEventListener('click', () => {
  game.restart();
  hasMadeFirstMove = false;
  setInitialUIState();
  updateUI();
});

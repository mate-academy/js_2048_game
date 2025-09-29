// src/scripts/main.js

// Надійний імпорт: працює і з CJS (module.exports), і з ESM (export default)
import MaybeCJS from '../modules/Game.class.js';

const Game = MaybeCJS?.default || MaybeCJS;

const game = new Game();

// ----- DOM -----
const scoreEl = document.querySelector('.game-score');
const btnEl = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

// 16 клітинок уже є в таблиці:
const cells = Array.from(document.querySelectorAll('.field-cell'));

// Прибираємо старі модифікатори значень
function clearValueClass(cell) {
  const classes = Array.from(cell.classList);

  for (let i = 0; i < classes.length; i++) {
    if (classes[i].startsWith('field-cell--')) {
      cell.classList.remove(classes[i]);
    }
  }
}

// ----- Рендер -----
function render() {
  const state = game.getState();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const v = state[r][c];
      const cell = cells[r * 4 + c];

      if (!cell) {
        continue;
      }

      clearValueClass(cell);
      cell.textContent = '';

      if (v) {
        cell.classList.add('field-cell--' + v);
        cell.textContent = String(v);
      }
    }
  }

  // рахунок
  if (scoreEl) {
    scoreEl.textContent = String(game.getScore());
  }

  // повідомлення
  const gameStatus = game.getStatus();

  if (msgStart) {
    msgStart.classList.toggle('hidden', gameStatus !== 'idle');
  }

  if (msgWin) {
    msgWin.classList.toggle('hidden', gameStatus !== 'win');
  }

  if (msgLose) {
    msgLose.classList.toggle('hidden', gameStatus !== 'lose');
  }

  // кнопка
  if (btnEl) {
    if (gameStatus === 'idle') {
      btnEl.textContent = 'Start';
      btnEl.classList.add('start');
      btnEl.classList.remove('restart');
    } else {
      btnEl.textContent = 'Restart';
      btnEl.classList.remove('start');
      btnEl.classList.add('restart');
    }
  }
}

// ----- Кнопка -----
if (btnEl) {
  btnEl.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
    }
    render();
  });
}

// ----- Клавіатура -----
document.addEventListener('keydown', (e) => {
  // не блокуємо набір у формах
  const t = e.target;

  if (
    t &&
    (t.tagName === 'INPUT' ||
      t.tagName === 'TEXTAREA' ||
      t.tagName === 'SELECT' ||
      t.isContentEditable)
  ) {
    return;
  }

  if (e.repeat) {
    return;
  }

  const wasIdle = game.getStatus() === 'idle';
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
    case 'a':
    case 'A':
      e.preventDefault();
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      e.preventDefault();
      moved = game.moveRight();
      break;
    case 'ArrowUp':
    case 'w':
    case 'W':
      e.preventDefault();
      moved = game.moveUp();
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      e.preventDefault();
      moved = game.moveDown();
      break;
    default:
      return;
  }

  // якщо перша стрілка лише стартанула гру → все одно перемальовуємо
  if (moved || (wasIdle && game.getStatus() === 'playing')) {
    render();
  }
});

// Початковий рендер (порожнє поле + стартове повідомлення)
render();

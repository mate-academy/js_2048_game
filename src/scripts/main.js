'use strict';

// korzystamy z window.Game wystawionego przez Game.class.js
const game = new window.Game();

const startBtn =
  document.querySelector('.button.start') || document.querySelector('.start');
const scoreEl = document.querySelector('.game-score');
const fieldCells = Array.from(
  document.querySelectorAll('.game-field .field-cell'),
);
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const score = game.getScore();

  const scoreText = score === 0 ? '' : String(score);

  if (scoreEl) {
    scoreEl.textContent = scoreText;
    scoreEl.setAttribute('value', scoreText);

    try {
      scoreEl.value = scoreText;
    } catch (e) {
      // ignore
    }
  }

  // Aktualizacja 16 komórek wierszowo (r*4 + c)
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      const cell = fieldCells[idx];

      if (!cell) {
        continue;
      }

      const val = state[r][c];

      cell.className = 'field-cell';
      cell.textContent = val === 0 ? '' : String(val);

      if (val) {
        cell.classList.add(`field-cell--${val}`);
      }
    }
  }

  // Przycisk Start/Restart — test oczekuje klas .button.start i .button.restart
  if (startBtn) {
    if (game.getStatus() === 'idle') {
      startBtn.textContent = 'Start';
      startBtn.classList.add('start');
      startBtn.classList.remove('restart');
    } else {
      startBtn.textContent = 'Restart';
      startBtn.classList.remove('start');
      startBtn.classList.add('restart');
    }
  }

  // wiadomości
  if (msgStart) {
    msgStart.classList.toggle('hidden', game.getStatus() !== 'idle');
  }

  if (msgWin) {
    msgWin.classList.toggle('hidden', game.getStatus() !== 'win');
  }

  if (msgLose) {
    msgLose.classList.toggle('hidden', game.getStatus() !== 'lose');
  }
}

function handleKeyPress(e) {
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
  render();
}

document.addEventListener('keydown', handleKeyPress);

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (game.getStatus() === 'idle' || game.getStatus() === 'lose') {
      game.start();
    } else {
      game.restart();
    }
    render();
  });
}
// initial render
render();

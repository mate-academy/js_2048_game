'use strict';

import GameModule from '../modules/Game.class.js';

const Game = GameModule.default || GameModule;

const game = new Game();

const fieldTable = document.querySelector('.game-field');
const rows = Array.from(fieldTable.querySelectorAll('.field-row'));
const cells = rows.map((r) => Array.from(r.querySelectorAll('.field-cell')));

const scoreEl = document.querySelector('.game-score');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const loseMsg = document.querySelector('.message-lose');
const btn = document.querySelector('.button');

function setScoreText(str) {
  scoreEl.textContent = str;
  scoreEl.setAttribute('value', str);
}

function renderField() {
  const state = game.getState();

  for (let r = 0; r < state.length; r++) {
    for (let c = 0; c < state[r].length; c++) {
      const td = cells[r][c];
      const v = state[r][c];

      td.className = 'field-cell';
      td.textContent = v ? String(v) : '';

      if (v) {
        td.classList.add(`field-cell--${v}`);
      }
    }
  }
}

function renderMessages() {
  const st = game.getStatus();

  startMsg.classList.add('hidden');
  winMsg.classList.add('hidden');
  loseMsg.classList.add('hidden');

  if (st === 'idle') {
    startMsg.classList.remove('hidden');
  }

  if (st === 'win') {
    winMsg.classList.remove('hidden');
  }

  if (st === 'lose') {
    loseMsg.classList.remove('hidden');
  }
}

function renderScore() {
  const st = game.getStatus();
  const val = game.getScore();

  if (st === 'idle') {
    setScoreText('');
  } else if (st === 'playing' && val === 0) {
    setScoreText('');
  } else {
    setScoreText(String(val));
  }
}

function renderAll() {
  renderField();
  renderMessages();
  renderScore();
}

btn.addEventListener('click', () => {
  if (btn.classList.contains('start')) {
    game.start();
    btn.classList.remove('start');
    btn.classList.add('restart');
    btn.textContent = 'Restart';
    renderAll();
  } else {
    game.restart();
    btn.classList.remove('restart');
    btn.classList.add('start');
    btn.textContent = 'Start';
    renderAll();
  }
});

document.addEventListener('keydown', (e) => {
  const st = game.getStatus();

  if (!['playing', 'running'].includes(st)) {
    return;
  }

  const map = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const fn = map[e.key];

  if (fn) {
    fn();
    renderAll();
  }
});

renderAll();

'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreEl = document.querySelector('.game-score');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

let started = false;
let firstMoveDone = false;

function render() {
  const gameStatus = game.getStatus();
  const score = game.getScore();

  scoreEl.textContent = score;

  const tilesEl = document.querySelector('.tiles-container');
  const renderedTiles = Array.from(tilesEl.children);
  const activeTiles = game.getTiles();

  activeTiles.forEach((tile) => {
    let tileEl = document.getElementById(`tile-${tile.id}`);

    if (!tileEl) {
      tileEl = document.createElement('div');
      tileEl.id = `tile-${tile.id}`;
      tilesEl.appendChild(tileEl);
    }

    tileEl.className = `tile tile--${tile.value} field-cell--${tile.value}`;

    if (tile.isNew) {
      tileEl.classList.add('is-new');
    } else {
      tileEl.classList.remove('is-new');
    }

    if (tile.isMerged) {
      tileEl.classList.add('is-merged');
    } else {
      tileEl.classList.remove('is-merged');
    }

    tileEl.textContent = tile.value;

    tileEl.style.setProperty('--r', tile.r);
    tileEl.style.setProperty('--c', tile.c);
  });

  const activeIds = new Set(activeTiles.map((t) => `tile-${t.id}`));

  renderedTiles.forEach((el) => {
    if (!activeIds.has(el.id)) {
      el.remove();
    }
  });

  if (gameStatus === 'playing') {
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  } else if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
    msgStart.classList.add('hidden');
    msgLose.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
  } else if (gameStatus === 'idle') {
    msgStart.classList.remove('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');
  }
}

startButton.addEventListener('click', () => {
  if (!started) {
    game.start();
    started = true;
    render();
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');

    started = false;
    firstMoveDone = false;
    render();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const oldState = JSON.stringify(game.getState());

  if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') {
    game.moveDown();
  }

  if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
    game.moveRight();
  }

  const newState = JSON.stringify(game.getState());

  if (oldState !== newState && !firstMoveDone) {
    firstMoveDone = true;
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  }

  render();
});

render();

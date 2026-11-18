'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.game-header .button');

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');

const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const slideDuration = 140;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let renderTimer;

function renderBoard(board) {
  const values = board.flat();

  cells.forEach((cell, index) => {
    const value = values[index];

    cell.replaceChildren();

    if (value) {
      const tile = document.createElement('span');

      tile.className = 'tile field-cell--' + value;
      tile.textContent = value;
      cell.append(tile);
    }
  });
}

function render() {
  clearTimeout(renderTimer);
  renderBoard(game.getState());
  renderStatus();
}

function renderStatus() {
  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');
  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');

  score.textContent = game.getScore();
  startMessage.classList.toggle('hidden', game.getStatus() !== 'idle');
}

function animateSlides(slides, previousBoard) {
  if (!slides.length || reducedMotion.matches) {
    render();

    return;
  }

  clearTimeout(renderTimer);
  renderStatus();
  renderBoard(previousBoard);

  for (const { from, to } of slides) {
    const start = cells[from].getBoundingClientRect();
    const end = cells[to].getBoundingClientRect();
    const tile = cells[from].firstElementChild;
    const x = end.x - start.x;
    const y = end.y - start.y;

    tile.style.zIndex = '1';

    tile.animate(
      [{ transform: 'none' }, { transform: `translate(${x}px, ${y}px)` }],
      { duration: slideDuration, easing: 'ease-out', fill: 'forwards' },
    );
  }

  renderTimer = setTimeout(() => renderBoard(game.getState()), slideDuration);
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    button.disabled = true;
  } else {
    game.restart();
    button.textContent = 'Start';
    button.classList.replace('restart', 'start');
  }

  render();
});

document.addEventListener('keydown', (keyEvent) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const previousBoard = game.getState();
  let slides;

  switch (keyEvent.key) {
    case 'ArrowLeft':
      slides = game.moveLeft();
      break;
    case 'ArrowRight':
      slides = game.moveRight();
      break;
    case 'ArrowUp':
      slides = game.moveUp();
      break;
    case 'ArrowDown':
      slides = game.moveDown();
      break;
    default:
      return;
  }

  keyEvent.preventDefault();

  if (slides.length && button.disabled) {
    button.disabled = false;
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
  }

  animateSlides(slides, previousBoard);
});

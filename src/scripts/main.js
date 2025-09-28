'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const button = document.querySelector('.button');

const field = document.querySelector('.game-field');

const scoreElement = document.querySelector('.game-score');
const bestScoreElement = document.querySelector('.best-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const ANIMATION_DURATION = 100;
const CELL_OFFSET = 83;

let prevMoveEnded = true;

bestScoreElement.textContent = localStorage.getItem('bestScore') || 0;

function saveScore() {
  localStorage.setItem('bestScore', game.getScore());
}

function animateAndRender(result) {
  result.transitions.forEach((t) => {
    const cell = document.getElementById(`cell-${t.id}`);

    if (!cell) {
      return;
    }

    if (t.type === 'move' || t.type === 'merge') {
      cell.style.transform = `translate(${t.to[1] * CELL_OFFSET}px, ${t.to[0] * CELL_OFFSET}px)`;
    }
  });

  setTimeout(() => {
    result.transitions.forEach((t) => {
      if (t.type === 'merge') {
        const disappearingCell = document.getElementById(`cell-${t.id}`);
        const cell = document.getElementById(`cell-${t.mergeIntoId}`);

        if (disappearingCell) {
          disappearingCell.remove();
        }

        if (cell) {
          const cellObject = game.state[t.to[0]][t.to[1]];
          const newValue = cellObject ? cellObject.value : 0;

          cell.textContent = newValue;
          cell.className = `cell cell--${cell.textContent}`;
        }
      }

      if (t.type === 'spawn') {
        const cell = createCellElement(t.value, t.to[0], t.to[1], t.id);

        field.appendChild(cell);
      }
    });

    scoreElement.textContent = game.getScore();

    if (game.getScore() > parseInt(bestScoreElement.textContent)) {
      bestScoreElement.textContent = game.getScore();
      saveScore();
    }

    if (game.status === 'lose') {
      messageLose.classList.remove('hidden');
    }

    if (game.status === 'win') {
      messageWin.classList.remove('hidden');
    }

    prevMoveEnded = true;
  }, ANIMATION_DURATION);
}

function gameCallback(e) {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
  }

  if (game.status !== 'playing') {
    return;
  }

  if (prevMoveEnded) {
    let result;
    let direction = null;

    if (
      e.type === 'keydown' &&
      e.key &&
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)
    ) {
      direction = e.key.replace('Arrow', '').toUpperCase();
    }

    if (['LEFT', 'RIGHT', 'UP', 'DOWN'].includes(direction)) {
      result = game.performMove(direction);
    } else {
      return;
    }

    if (result.moved) {
      prevMoveEnded = false;

      animateAndRender(result);
    } else {
    }
  }
}

function createCellElement(value, row, col, id) {
  const cell = document.createElement('div');

  cell.id = `cell-${id}`;
  cell.className = `cell cell--${value}`;
  cell.textContent = value;
  cell.style.transform = `translate(${col * 83}px, ${row * 83}px)`;

  return cell;
}

function clearBoard() {
  const cells = field.querySelectorAll('.cell');

  cells.forEach((cell) => cell.remove());
}

function initialiseBoard(boardState) {
  for (let i = 0; i < boardState.length; i++) {
    for (let j = 0; j < boardState[i].length; j++) {
      const cellObj = boardState[i][j];
      const value = cellObj ? cellObj.value : 0;

      if (value !== 0) {
        const cell = createCellElement(value, i, j, cellObj.id);

        field.appendChild(cell);
      }
    }
  }
}

button.addEventListener('click', () => {
  if (game.status !== 'idle') {
    game.restart();
    clearBoard();

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');

    scoreElement.textContent = game.getScore();

    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    document.removeEventListener('keydown', gameCallback);

    if (game.status === 'idle' && button.textContent === 'Start') {
      return;
    }
  }

  if (button.textContent === 'Start') {
    game.start();

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');

    messageStart.classList.add('hidden');

    initialiseBoard(game.getState());

    scoreElement.textContent = game.getScore();

    document.addEventListener('keydown', gameCallback);
  }
});

'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';
import constants from './constants';

const {
  BOARD_SIZE,
  EMPTY_CELL,
  CELL_SIZE,
  CELL_GAP,
  MOVE_ANIMATION_MS,
  MERGE_ANIMATION_MS,
  SPAWN_ANIMATION_MS,
  MERGE_SCALE,
  SPAWN_INITIAL_SCALE,
  SPAWN_INITIAL_OPACITY,
} = constants;

const game = new Game();

// Write your code here
const button = document.querySelector('.button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const elementInCell = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const CELL_STEP = CELL_SIZE + CELL_GAP;

button.addEventListener('click', (e) => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();

  button.className = 'button restart';
  button.textContent = 'Restart';
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moveMeta = runMove(e.key);

  if (!moveMeta) {
    return;
  }

  e.preventDefault();
  render();
  handleMoveMeta(moveMeta);
});

function runMove(key) {
  if (key === 'ArrowLeft') {
    return game.moveLeft();
  }

  if (key === 'ArrowRight') {
    return game.moveRight();
  }

  if (key === 'ArrowUp') {
    return game.moveUp();
  }

  if (key === 'ArrowDown') {
    return game.moveDown();
  }

  return null;
}

function handleMoveMeta(moveMeta) {
  if (!moveMeta.moved) {
    return;
  }

  moveMeta.moves.forEach((move) => {
    const toIndex = move.to.row * BOARD_SIZE + move.to.col;
    const toCell = elementInCell[toIndex];

    if (!toCell) {
      return;
    }

    const dx = (move.from.col - move.to.col) * CELL_STEP;
    const dy = (move.from.row - move.to.row) * CELL_STEP;

    toCell.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: 'translate(0, 0)' },
      ],
      {
        duration: MOVE_ANIMATION_MS,
        easing: 'ease-out',
      },
    );
  });

  moveMeta.merges.forEach((merge) => {
    const intoIndex = merge.into.row * BOARD_SIZE + merge.into.col;
    const intoCell = elementInCell[intoIndex];

    if (!intoCell) {
      return;
    }

    intoCell.animate(
      [
        { transform: 'scale(1)' },
        { transform: `scale(${MERGE_SCALE})` },
        { transform: 'scale(1)' },
      ],
      {
        duration: MERGE_ANIMATION_MS,
        easing: 'ease-out',
        delay: MOVE_ANIMATION_MS,
      },
    );
  });

  if (moveMeta.spawnedTile) {
    const spawnIndex =
      moveMeta.spawnedTile.row * BOARD_SIZE + moveMeta.spawnedTile.col;
    const spawnCell = elementInCell[spawnIndex];

    if (spawnCell) {
      spawnCell.animate(
        [
          {
            transform: `scale(${SPAWN_INITIAL_SCALE})`,
            opacity: SPAWN_INITIAL_OPACITY,
          },
          { transform: 'scale(1)', opacity: 1 },
        ],
        {
          duration: SPAWN_ANIMATION_MS,
          easing: 'ease-out',
          delay: MOVE_ANIMATION_MS,
        },
      );
    }
  }
}

function render() {
  let index = 0;

  game.getState().map((row) => {
    row.map((el) => {
      if (el !== EMPTY_CELL) {
        elementInCell[index].textContent = el;
        elementInCell[index].className = `field-cell field-cell--${el}`;
        index++;
      } else {
        elementInCell[index].textContent = '';
        elementInCell[index].className = 'field-cell';
        index++;
      }
    });
  });

  if (game.getStatus() === 'win') {
    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageStart.classList.add('hidden');
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    button.className = 'button start';
    button.textContent = 'Start';
  }

  score.textContent = `${game.getScore()}`;
}

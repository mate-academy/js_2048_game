'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const tbody = document.querySelector('tbody');
const buttonStart = document.querySelector('.button');
const ANIMATION_DURATION = 200;
const ANIMATION_OPTIONS = {
  duration: ANIMATION_DURATION,
  fill: 'forwards',
  easing: 'ease',
};
let isStarted = false;

function generatePlayingTilesContainer(isCreate) {
  if (isCreate) {
    const playingTiles = document.createElement('div');

    playingTiles.classList.add('generated-field');

    document.querySelector('.container').prepend(playingTiles);

    return;
  }

  document.querySelector('.game-score').textContent = game.getScore();
  document.querySelector('.generated-field').remove();
}

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    isStarted = true;
    game.start();
    generatePlayingTilesContainer(true);
    updateField();
    document.querySelector('.message-start').classList.add('hidden');
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.textContent = 'Restart';

    return;
  }

  if (buttonStart.classList.contains('restart')) {
    isStarted = false;
    game.restart();
    generatePlayingTilesContainer(false);
    document.querySelector('.message-start').classList.remove('hidden');
    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');
    buttonStart.textContent = 'Start';

    if (!document.querySelector('.message-win').classList.contains('hidden')) {
      document.querySelector('.message-win').classList.add('hidden');
    }

    if (!document.querySelector('.message-lose').classList.contains('hidden')) {
      document.querySelector('.message-lose').classList.add('hidden');
    }
  }

  buttonStart.blur();
});

document.addEventListener('keydown', (e) => {
  if (!isStarted) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  const moveResult = moveAnimation(e.key);

  if (moveResult) {
    setTimeout(() => {
      updateField();
    }, ANIMATION_DURATION);
  } else {
    updateField();
  }

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
    isStarted = false;
  }

  if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
    isStarted = false;
  }
});

function updateField() {
  if (document.querySelector('.generated-field') !== null) {
    document.querySelector('.generated-field').innerHTML = '';
  }

  const newTop = document.createDocumentFragment();
  const score = game.getScore();
  const state = game.getState();

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (state[i][j] !== 0) {
        const cellRect = tbody.rows[i].cells[j].getBoundingClientRect();

        newTop.append(document.createElement('div'));

        newTop.lastElementChild.classList.add(
          'generated-cell',
          `generated-cell--${state[i][j]}`,
        );
        newTop.lastElementChild.dataset.x = j;
        newTop.lastElementChild.dataset.y = i;
        newTop.lastElementChild.textContent = state[i][j];
        newTop.lastElementChild.style.left = cellRect.left + 'px';
        newTop.lastElementChild.style.top = cellRect.top + 'px';

        newTop.lastElementChild.animate(
          {
            transform: ['scale(1)', 'scale(1.03)', 'scale(1)'],
          },
          ANIMATION_OPTIONS,
        );
      }
    }
  }

  if (document.querySelector('.generated-field') !== null) {
    document.querySelector('.generated-field').append(newTop);
  }
  document.querySelector('.game-score').textContent = score;
}

function moveAnimation(arrow) {
  const generatedField = document.querySelector('.generated-field');
  const movedCells = game.getMovedCells();
  const isChanged = movedCells.some((movedCell) => {
    return movedCell.changed;
  });

  if (!isChanged) {
    return false;
  }

  for (const generatedCell of generatedField.children) {
    if (generatedCell.getAnimations().length > 0) {
      generatedCell.getAnimations()[0].cancel();
    }
  }

  switch (arrow) {
    case 'ArrowLeft':
      for (const generatedCell of generatedField.children) {
        const generatedCellRect = generatedCell.getBoundingClientRect();
        let x = 0;

        for (const movedCell of movedCells) {
          if (
            movedCell.changed &&
            movedCell.x === Number(generatedCell.dataset.x) &&
            movedCell.y === Number(generatedCell.dataset.y)
          ) {
            const cellRect =
              tbody.rows[movedCell.y].cells[
                movedCell.newX
              ].getBoundingClientRect();

            x = generatedCellRect.left - cellRect.left;
          }
        }

        generatedCell.animate(
          {
            transform: ['translateX(0)', `translateX(${-x}px)`],
          },
          ANIMATION_OPTIONS,
        );
      }
      break;

    case 'ArrowRight':
      for (const generatedCell of generatedField.children) {
        const generatedCellRect = generatedCell.getBoundingClientRect();
        let x = 0;

        for (const movedCell of movedCells) {
          if (
            movedCell.changed &&
            movedCell.x === Number(generatedCell.dataset.x) &&
            movedCell.y === Number(generatedCell.dataset.y)
          ) {
            const cellRect =
              tbody.rows[movedCell.y].cells[
                movedCell.newX
              ].getBoundingClientRect();

            x = cellRect.left - generatedCellRect.left;
          }
        }

        generatedCell.animate(
          {
            transform: ['translateX(0)', `translateX(${x}px)`],
          },
          ANIMATION_OPTIONS,
        );
      }
      break;

    case 'ArrowUp':
      for (const generatedCell of generatedField.children) {
        const generatedCellRect = generatedCell.getBoundingClientRect();
        let y = 0;

        for (const movedCell of movedCells) {
          if (
            movedCell.changed &&
            movedCell.x === Number(generatedCell.dataset.x) &&
            movedCell.y === Number(generatedCell.dataset.y)
          ) {
            const cellRect =
              tbody.rows[movedCell.newY].cells[
                movedCell.x
              ].getBoundingClientRect();

            y = generatedCellRect.top - cellRect.top;
          }
        }

        generatedCell.animate(
          {
            transform: ['translateY(0)', `translateY(${-y}px)`],
          },
          ANIMATION_OPTIONS,
        );
      }
      break;

    case 'ArrowDown':
      for (const generatedCell of generatedField.children) {
        const generatedCellRect = generatedCell.getBoundingClientRect();
        let y = 0;

        for (const movedCell of movedCells) {
          if (
            movedCell.changed &&
            movedCell.x === Number(generatedCell.dataset.x) &&
            movedCell.y === Number(generatedCell.dataset.y)
          ) {
            const cellRect =
              tbody.rows[movedCell.newY].cells[
                movedCell.x
              ].getBoundingClientRect();

            y = cellRect.top - generatedCellRect.top;
          }
        }

        generatedCell.animate(
          {
            transform: ['translateY(0)', `translateY(${y}px)`],
          },
          ANIMATION_OPTIONS,
        );
      }
      break;
  }

  return true;
}


import { checkLose } from './helpers/checkLose';
import { createCleanBoard } from './helpers/createCleanBoard';
import { resetBeforeMove, afterMove } from './helpers/beforeAfterMove';
import { addNewTile } from './helpers/addNewTile';
import { makeMoveBy } from './helpers/makeMoveBy';

export const rows = 4;
export const cols = 4;

export const quantityRows = rows - 1;
export const quantityCols = cols - 1;
export let board = createCleanBoard();
export const letVariables = {
  emptyCells: rows * cols,
  moves: 1,
  dontAddCells: [],
};

const button = document.querySelector('.button');

export const score = document.querySelector('.game-score');
export const messageLose = document.querySelector('.message-lose');
export const messageWin = document.querySelector('.message-win');
export const messageStart = document.querySelector('.message-start');
export const table = document.querySelector('.game-field');

export const trs = [];

const trsTbody = [...document.querySelector('tbody').children];

trsTbody.forEach(tr => {
  trs.push([...tr.children]);
});

button.addEventListener('click', () => {
  if (button.innerText === 'Restart') {
    letVariables.moves = 1;
    letVariables.emptyCells = rows * cols;
    score.innerHTML = 0;
    table.style.opacity = 1;

    trs.map(tr => tr.map(td => {
      td.removeAttribute('class');
      td.innerText = '';
      td.classList.add('field-cell');
    }));

    board = createCleanBoard();
    addNewTile();
    addNewTile();
  }

  if (button.innerText === 'Start') {
    addNewTile();
    addNewTile();
    button.innerText = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    messageStart.innerText = 'Press "Restart" to new game';
    addEventsKeyboard();
  }

  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageStart.classList.remove('hidden');
});

function addEventsKeyboard() {
  document.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft') {
      resetBeforeMove();
      makeMoveBy(true, true);
      afterMove();
      checkLose();
    }

    if (e.code === 'ArrowRight') {
      resetBeforeMove();
      makeMoveBy(true, false);
      afterMove();
      checkLose();
    }

    if (e.code === 'ArrowDown') {
      resetBeforeMove();
      makeMoveBy(false, false);
      afterMove();
      checkLose();
    }

    if (e.code === 'ArrowUp') {
      resetBeforeMove();
      makeMoveBy(false, true);
      afterMove();
      checkLose();
    }
  });
}

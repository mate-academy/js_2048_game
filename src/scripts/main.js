'use strict';

// const GAME_SCORE = document.getElementById('score');
const BT_START = document.getElementById('start');
const MS_START = document.getElementById('message_start');
// const MS_LOSE = document.getElementById('lose');
// const MS_WIN = document.getElementById('win');
const FIELD = document.getElementById('field');
const CELLS = document.getElementsByClassName('field-cell');
const collectionOfNumbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
let index = Math.floor(Math.random() * collectionOfNumbers.length);

BT_START.addEventListener('click', () => {
  if (BT_START.classList.contains('start')) {
    BT_START.classList.remove('start');
    BT_START.classList.add('restart');
    BT_START.innerHTML = 'Restart';
    MS_START.innerHTML = 'Press "Restart" to begin new game.';

    const block1 = CELLS[Math.floor(Math.random() * CELLS.length)];
    const block2 = CELLS[Math.floor(Math.random() * CELLS.length)];

    index = Math.floor(Math.random() * collectionOfNumbers.length);
    block1.classList.add(`field-cell--${collectionOfNumbers[index]}`);

    index = Math.floor(Math.random() * collectionOfNumbers.length);
    block1.innerHTML = `${collectionOfNumbers[index]}`;
    block2.classList.add(`field-cell--${collectionOfNumbers[index]}`);
    block2.innerHTML = `${collectionOfNumbers[index]}`;
  } else if (BT_START.classList.contains('restart')) {
    BT_START.classList.remove('restart');
    BT_START.classList.add('start');
    BT_START.innerHTML = 'Start';
    MS_START.innerHTML = 'Press "Start" to begin game. Good luck!';

    for (const element of CELLS) {
      for (const num of [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]) {
        element.classList.remove(`field-cell--${num}`);
        element.classList.add('field-cell');
        element.innerHTML = '';
      }
    }
  }
});

let row;
let col;
let nextCell;

document.addEventListener('keydown', () => {
  // якщо є місце, якщо нерівні значення клітинок, то зміщуємо
  // об'єднати
  // якщо ні об'єднати, ні змістити - програш

  for (const cell of CELLS) {
    row = cell.getAttribute('id').split('-')[0];
    col = cell.getAttribute('id').split('-')[1];
    nextCell = document.getElementById(`${+row + 1}-${+col}`);

    const num = cell.textContent;
    // const nextNum = nextCell.textContent;

    if (row < FIELD.rows.length
      && cell.classList.contains(`field-cell--${num}`)) {
      // console.log(nextCell);
      nextCell.classList.add(`field-cell--${num}`);
      nextCell.innerHTML = `${num}`;
      cell.classList.remove(`field-cell--${num}`);
      cell.innerHTML = '';
    }
    // else if (cell.classList.contains(`field-cell--${num}`)
    // && num === +nextCell.outerText
    // && nextCell.outerText) {
    //   nextCell.innerHTML = +nextCell.textContent * 2;
    //   cell.classList.remove(`field-cell${num}`);
    //   cell.innerHTML = '';
    // }
  }
});

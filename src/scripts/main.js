'use strict';

const table = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const fields = document.querySelectorAll('.field-cell');
const button = document.querySelector('.button');

function updateGameFields() {
  for (let i = 0; i < fields.length; i++) {
    const indexRow = Math.floor(i / 4);
    const indexCol = i - (indexRow * 4);
    const tableValue = table[indexRow][indexCol];

    fields[i].textContent = tableValue;

    if (tableValue !== 0) {
      fields[i].classList = ['field-cell'];
      fields[i].classList.add(`field-cell--${tableValue}`);
    }
  }
}

updateGameFields();

function appearingOneRandomCell() {
  updateGameFields();

  const fieldIndex = getRandonCell();
  const rowIndex = Math.floor(fieldIndex / 4);
  const colIndex = fieldIndex - (rowIndex * 4);

  const firstRandomNum = Math.floor(Math.random() * 10);

  if (firstRandomNum === 4) {
    table[rowIndex][colIndex] = 4;
  } else {
    table[rowIndex][colIndex] = 2;
  }

  updateGameFields();
}

function restart() {
  updateGameFields();

  for (let i = 0; i < fields.length; i++) {
    const rowIndex = Math.floor(i / 4);
    const colIndex = i - (rowIndex * 4);

    table[rowIndex][colIndex] = 0;
  }

  updateGameFields();
}

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'restart';

    appearingOneRandomCell();
    appearingOneRandomCell();
  } else {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'start';

    restart();
  }
});

function getRandonCell() {
  updateGameFields();

  let randomIndex = Math.floor(Math.random() * 15);
  const indexRow = Math.floor(randomIndex / 4);
  const indexCol = randomIndex - (indexRow * 4);

  while (
    table[indexRow][indexCol] !== 0
  ) {
    randomIndex = Math.floor(Math.random() * 15);
  }

  return randomIndex;
}

function moveLeft() {
  // console.log('left');
  // console.log(table);
  appearingOneRandomCell();
}

function moveRight() {
  // console.log('right');
}

function moveUp() {
  // console.log('up');
}

function moveDown() {
  // console.log('down');
}

addEventListener('keydown', (eventParam) => {
  if (eventParam.code === 'ArrowLeft') {
    moveLeft();
  }

  if (eventParam.code === 'ArrowRight') {
    moveRight();
  }

  if (eventParam.code === 'ArrowUp') {
    moveUp();
  }

  if (eventParam.code === 'ArrowDown') {
    moveDown();
  }
});

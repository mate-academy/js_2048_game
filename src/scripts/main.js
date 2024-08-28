'use strict';

const buttonStart = document.querySelector('.button.start');

const messageStart = document.querySelector('.message-start');

const cells = Array.from(document.querySelectorAll('.field-cell'));

const cellsArr = Array.from(document.querySelectorAll('.field-row')).map(
  (row) => Array.from(row.children)
);

function startGame() {
  buttonStart.textContent = 'Restart';
  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');

  messageStart.classList.add('hidden');

  clearField();
  cellAppear();
  cellAppear();
}

function clearField() {
  cells.forEach((cell) => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });
}

function cellAppear() {
  const emptyCells = cells.filter((cell) => cell.classList.length === 1);

  const index = getRandomIntInclusive(0, emptyCells.length - 1);

  const cellValue = getNewValue();

  emptyCells[index].classList.add(`field-cell--${cellValue}`);
  emptyCells[index].textContent = cellValue;
}

function getRandomIntInclusive(minimum, maximum) {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNewValue() {
  const random = Math.random();

  if (random >= 0.9) {
    return '4';
  }

  return '2';
}

function swap(arr, from, to) {
  const tmpTextContent = arr[from].textContent;
  const tmpClassName = arr[from].className;

  arr[from].textContent = arr[to].textContent;
  arr[from].className = arr[to].className;

  arr[to].textContent = tmpTextContent;
  arr[to].className = tmpClassName;
}

function move(rowCells) {
  for (let i = 0; i < rowCells.length; i++) {
    if (rowCells[i].textContent === '') {
      for (let j = i; j < rowCells.length; j++) {
        if (rowCells[j].textContent !== '') {
          swap(rowCells, i, j);
          break;
        }
      }
    }
  }
}

buttonStart.onclick = () => {
  startGame();
};

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      break;

    case 'ArrowDown':
      break;

    case 'ArrowRight':
      cellsArr.forEach((part) => move([...part].reverse()));
      cellAppear();

      break;

    case 'ArrowLeft':
      cellsArr.forEach((part) => move(part));
      cellAppear();
      break;

    default:
      break;
  }
});

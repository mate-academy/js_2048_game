'use strict';

const buttonStart = document.querySelector('.button.start');

const messageStart = document.querySelector('.message-start');

const cells = [...document.querySelectorAll('.field-cell')];

const rowsArray = [...document.querySelectorAll('.field-row')].map((row) => [
  ...row.children,
]);

function startGame() {
  buttonStart.textContent = 'Restart';
  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');

  messageStart.classList.add('hidden');

  clearField();
  cellAppear();
  cellAppear();
}

function cellAppear() {
  const emptyCells = cells.filter((cell) => cell.classList.length === 1);

  const index = getRandomIntInclusive(0, emptyCells.length - 1);
  const cellValue = getNewValue();

  emptyCells[index].classList.add(`field-cell--${cellValue}`);
  emptyCells[index].dataset.value = cellValue;
  emptyCells[index].textContent = cellValue;
}

function cleanCell(cell) {
  cell.className = 'field-cell';
  cell.dataset.value = '0';
  cell.textContent = '';
}

function clearField() {
  cells.forEach((cell) => {
    cleanCell(cell);
  });
}

function getRandomIntInclusive(minimum, maximum) {
  const min = Math.ceil(minimum);
  const max = Math.floor(maximum);

  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getNewValue() {
  const random = Math.random();

  return random >= 0.9 ? '4' : '2';
}

function compressRow(cellsInRow) {
  const updatedRow = [];

  for (let i = 0; i < cellsInRow.length; i++) {
    if (cellsInRow[i].dataset.value !== '0') {
      const currentValue = Number(cellsInRow[i].dataset.value);

      if (
        i < cellsInRow.length - 1 &&
        cellsInRow[i].dataset.value === cellsInRow[i + 1].dataset.value
      ) {
        updatedRow.push(currentValue * 2);
        cellsInRow[i + 1].dataset.value = '0';
        i++;
      } else {
        updatedRow.push(currentValue);
      }
    }
  }

  return updatedRow;
}

function shiftLeft(cellsInRow) {
  const newElements = compressRow(cellsInRow);

  for (let i = 0; i < cellsInRow.length; i++) {
    const newValue = newElements[i];

    if (newValue) {
      cellsInRow[i].className = `field-cell field-cell--${newValue}`;
      cellsInRow[i].dataset.value = newValue;
      cellsInRow[i].textContent = newValue;
    } else {
      cleanCell(cellsInRow[i]);
    }
  }
}

function shiftRight(cellsInRow) {
  const newElements = compressRow(cellsInRow);

  let j = newElements.length - 1;

  for (let i = cellsInRow.length - 1; i >= 0; i--) {
    if (j >= 0) {
      const newValue = newElements[j];

      cellsInRow[i].className = `field-cell field-cell--${newValue}`;
      cellsInRow[i].dataset.value = newValue;
      cellsInRow[i].textContent = newValue;
      j--;
    } else {
      cleanCell(cellsInRow[i]);
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
      rowsArray.forEach((part) => shiftRight(part));
      cellAppear();

      break;

    case 'ArrowLeft':
      rowsArray.forEach((part) => shiftLeft(part));
      cellAppear();
      break;

    default:
      break;
  }
});

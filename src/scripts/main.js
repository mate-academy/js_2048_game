'use strict';

const table = document.querySelector('table');
const buttonStart = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const collLength = 4;
const rowLenght = 4;
const gameScore = document.querySelector('.game-score');
let emptyCell = [];
let count = 0;

function randomNumbersTwoAndFour() {
  const randomNumber = Math.floor(Math.random() * 10);

  if (randomNumber <= 0) {
    return 2;
  } else if (randomNumber <= 0.9) {
    return 4;
  } else {
    return 2;
  }
}

function searchEmptyCell() {
  const arr = [];

  for (let i = 0; i < rowLenght; i++) {
    for (let j = 0; j < collLength; j++) {
      if (table.rows[i].cells[j].textContent === '') {
        arr.push([i, j]);
      }
    }
  }

  emptyCell = [...arr];

  return emptyCell.length > 0;
}

function addNewCell() {
  if (searchEmptyCell()) {
    const lengthArr = emptyCell.length - 1;
    const index = Math.floor(Math.random() * (lengthArr - 0 + 1) + 0);
    const element = emptyCell[index];
    const [rowsIndex, colIndex] = element;
    const number = randomNumbersTwoAndFour();

    table.rows[rowsIndex].cells[colIndex].textContent = number;

    table.rows[rowsIndex].cells[colIndex]
      .classList.add(`field-cell--${number}`);
  }
}

buttonStart.addEventListener('click', () => {
  buttonStart.classList.add('restart');
  buttonStart.classList.remove('start');
  buttonStart.textContent = 'Restart';
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  if (emptyCell.length > 0) {
    emptyCell = [];

    for (let i = 0; i < rowLenght; i++) {
      for (let j = 0; j < collLength; j++) {
        if (table.rows[i].cells[j].textContent) {
          const content = table.rows[i].cells[j].textContent;

          table.rows[i].cells[j].textContent = '';
          table.rows[i].cells[j].classList.remove(`field-cell--${content}`);
        }
      }
    }
  }
  addNewCell();
  addNewCell();
});

document.body.addEventListener('keydown', (e) => {
  const oldArr = [];

  for (let i = 0; i < rowLenght; i++) {
    for (let j = 0; j < collLength; j++) {
      oldArr.push(table.rows[i].cells[j].textContent);
    }
  }

  switch (e.key) {
    case 'ArrowRight':
      handleMove('right', oldArr);
      checkingForMoves();
      break;
    case 'ArrowLeft':
      handleMove('left', oldArr);
      checkingForMoves();
      break;
    case 'ArrowUp':
      handleMove('up', oldArr);
      checkingForMoves();
      break;
    case 'ArrowDown':
      handleMove('down', oldArr);
      checkingForMoves();
      break;
  }
});

function handleMove(direction, oldArr) {
  fillEmptyCells(direction);

  const x = (direction === 'right' || direction === 'down')
    ? rowLenght - 1 : 0;
  const y = (direction === 'right' || direction === 'left')
    ? collLength - 1 : 0;

  for (let i = 0; i < rowLenght; i++) {
    for (let j = 0; j < collLength; j++) {
      if ((i === x && j === y) || table.rows[i].cells[j].textContent === '') {
        continue;
      }

      const current = table.rows[i].cells[j];
      let nextI = i;
      let nextJ = j;

      while (true) {
        nextI += direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
        nextJ += direction === 'left' ? -1 : direction === 'right' ? 1 : 0;

        if (nextI < 0
          || nextI >= rowLenght
          || nextJ < 0 || nextJ
          >= collLength
        ) {
          nextI -= direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
          nextJ -= direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
          break;
        }

        if (table.rows[nextI].cells[nextJ].textContent === '') {
          continue;
        }

        if (table.rows[nextI].cells[nextJ].textContent
          !== current.textContent) {
          nextI -= direction === 'up' ? -1 : direction === 'down' ? 1 : 0;
          nextJ -= direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
          break;
        }

        const cl = `field-cell--${current.textContent}`;
        const next = table.rows[nextI].cells[nextJ];

        next.classList.remove(cl);
        current.classList.remove(cl);
        current.classList.add(`field-cell--${next.textContent * 2}`);
        current.textContent = next.textContent * 2;
        next.textContent = '';
        count += +current.textContent;

        if (current.textContent === '2048') {
          messageWin.classList.remove('hidden');
        }
        break;
      }
    }
  }

  fillEmptyCells(direction);
  gameScore.textContent = count;

  if (!checkingChanges(oldArr)) {
    addNewCell();
  };
}

function fillEmptyCells(direction) {
  const rows = table.rows;

  switch (direction) {
    case 'right':
      for (let i = 0; i < rowLenght; i++) {
        let emptyCellIndex = -1;

        for (let j = collLength - 1; j >= 0; j--) {
          const currentCell = rows[i].cells[j];

          if (currentCell.textContent === '') {
            if (emptyCellIndex === -1) {
              emptyCellIndex = j;
            }
          } else if (emptyCellIndex !== -1) {
            const cl = `field-cell--${currentCell.textContent}`;

            rows[i].cells[emptyCellIndex].textContent = currentCell.textContent;
            rows[i].cells[emptyCellIndex].classList.add(cl);
            currentCell.classList.remove(cl);
            currentCell.textContent = '';
            emptyCellIndex--;
          }
        }
      }
      break;

    case 'left':
      for (let i = 0; i < rowLenght; i++) {
        let emptyCellIndex = -1;

        for (let j = 0; j < collLength; j++) {
          const currentCell = rows[i].cells[j];

          if (currentCell.textContent === '') {
            if (emptyCellIndex === -1) {
              emptyCellIndex = j;
            }
          } else if (emptyCellIndex !== -1) {
            const cl = `field-cell--${currentCell.textContent}`;

            rows[i].cells[emptyCellIndex].textContent = currentCell.textContent;
            rows[i].cells[emptyCellIndex].classList.add(cl);
            currentCell.classList.remove(cl);
            currentCell.textContent = '';
            emptyCellIndex++;
          }
        }
      }
      break;
    case 'down':
      for (let j = 0; j < collLength; j++) {
        let emptyCellIndex = -1;

        for (let i = rowLenght - 1; i >= 0; i--) {
          const currentCell = rows[i].cells[j];

          if (currentCell.textContent === '') {
            if (emptyCellIndex === -1) {
              emptyCellIndex = i;
            }
          } else if (emptyCellIndex !== -1) {
            const cl = `field-cell--${currentCell.textContent}`;

            rows[emptyCellIndex].cells[j].textContent = currentCell.textContent;
            rows[emptyCellIndex].cells[j].classList.add(cl);
            currentCell.classList.remove(cl);
            currentCell.textContent = '';
            emptyCellIndex--;
          }
        }
      }
      break;
    case 'up':
      for (let j = 0; j < rowLenght; j++) {
        let emptyCellIndex = -1;

        for (let i = 0; i < collLength; i++) {
          const currentCell = rows[i].cells[j];

          if (currentCell.textContent === '') {
            if (emptyCellIndex === -1) {
              emptyCellIndex = i;
            }
          } else if (emptyCellIndex !== -1) {
            const cl = `field-cell--${currentCell.textContent}`;

            rows[emptyCellIndex].cells[j].textContent = currentCell.textContent;
            rows[emptyCellIndex].cells[j].classList.add(cl);
            currentCell.classList.remove(cl);
            currentCell.textContent = '';
            emptyCellIndex++;
          }
        }
      }
      break;
  }
};

function checkingChanges(arr) {
  const newArr = [];

  for (let i = 0; i < rowLenght; i++) {
    for (let j = 0; j < collLength; j++) {
      newArr.push(table.rows[i].cells[j].textContent);
    }
  }

  return newArr.every((value, index) => value === arr[index]);
}

function checkingForMoves() {
  for (let i = 0; i < rowLenght; i++) {
    for (let j = 0; j < collLength; j++) {
      if (table.rows[i].cells[j].textContent === '') {
        return;
      }
    }
  }

  for (let i = 0; i < rowLenght; i++) {
    for (let j = 0; j < collLength - 1; j++) {
      if (table.rows[i].cells[j].textContent
        === table.rows[i].cells[j + 1].textContent) {
        return;
      }
    }
  }

  for (let j = 0; j < collLength; j++) {
    for (let i = 0; i < rowLenght - 1; i++) {
      if (table.rows[i].cells[j].textContent
        === table.rows[i + 1].cells[j].textContent) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}

'use strict';
const startButton = document.querySelector('.start');
startButton.insertAdjacentHTML('afterend', `
  <button class="button restart hidden">Reset</button>
  `);
const restartButton = document.querySelector('.restart');
const messageStart = document.querySelector('.message-start');
const gameField = document.querySelector('.game-field').firstElementChild;
const fieldCells = document.querySelectorAll('.field-cell');

const getRandomCellValue = () => {
  return Math.floor(Math.random() * 10) < 9 ? 2 : 4;
};

const getFreeRandomCell = () => {
  const freeCells = [...fieldCells].filter(el => el.classList.length === 1);
  const randomIndex = Math.floor(Math.random() * freeCells.length);
  return freeCells[randomIndex];
};

const fillNewCell = () => {
  const cell = getFreeRandomCell();
  const value = getRandomCellValue();

  cell.textContent = value;
  cell.classList.add(`field-cell--${value}`);
};

const firstMove = () => {
  fillNewCell();
  fillNewCell();
};

const toggleHidden = (element) => {
  element.classList.toggle('hidden');
}

startButton.addEventListener('click', () => {
  firstMove();
  toggleHidden(startButton);
  toggleHidden(restartButton);
});

restartButton.addEventListener('click', () => {
  [...fieldCells].map(item => {
    item.textContent = '';
    item.className = 'field-cell';
  });
  toggleHidden(restartButton);
  toggleHidden(startButton);
})

// moves

const getCellInfo = (cell) => {
  const parentRow = cell.parentElement;
  const colIndex = [...parentRow.children].findIndex(el => el === cell);
  const rowIndex = [...parentRow.parentElement.children].findIndex(el => el === parentRow);

  return {col: colIndex, row: rowIndex, value: cell.textContent};
};

const isChange = (prev) => {
  const curr = getValuesSum();
  return prev === curr ? false : true;

}

const getValuesSum = () => {
  return [...fieldCells].reduce((acc, item) => {
    return acc + +item.textContent;
  }, 0)
};

const checkEmptyCells = () => {
const activeCells = [...fieldCells].filter(item => item.classList.length === 2);

 if (activeCells.length === 16){
  console.log('finish');
  return;
 }
}


document.addEventListener('keydown', (e) => {
if (e.key === 'ArrowDown') {
  fillNewCell();
  checkEmptyCells();
}
});




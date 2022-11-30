'use strict';

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const startButton = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const cells = document.querySelectorAll('td');
const width = 4;
let square;
let score = 0;

function generateNewCell(elements) {
  const randomNumber = ((Math.random() * 100) < 10) ? 4 : 2;
  const randomIndex = Math.floor(Math.random() * cells.length);

  if (cells[randomIndex].innerHTML === '') {
    cells[randomIndex].innerHTML = randomNumber;
    cells[randomIndex].className = `field-cell field-cell--${randomNumber}`;
  } else {
    generateNewCell(elements);
    checkIfGameOver();
  }
}

let isStartButton = true;

startButton.addEventListener('click', e => {
  if (isStartButton) {
    e.target.className = 'button restart';
    e.target.innerHTML = 'Restart';
    messageStart.classList.add('hidden');
    isStartButton = false;

    for (const cell of cells) {
      square = cell;

      for (let i = 0; i < 16; i++) {
        square.innerHTML = '';
      }
    }

    generateNewCell(cells);
    generateNewCell(cells);
    cells.forEach(cell => updateInfo(cell));
  } else {
    e.target.className = 'button start';
    e.target.innerHTML = 'Start';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    isStartButton = true;
    resetInfo();
  }
});

move();

function resetInfo() {
  const existedCells = document.querySelectorAll('[class*="field-cell--"]');

  existedCells.forEach(cell => {
    const lastClass = cell.classList[cell.classList.length - 1];

    cell.classList.remove(lastClass);
    cell.innerHTML = '';
    gameScore.innerHTML = 0;
  });
}

function updateInfo(item) {
  if (item.innerHTML !== '') {
    item.className = `field-cell field-cell--${item.innerHTML}`;
  } else {
    item.className = 'field-cell';
  }

  gameScore.innerHTML = score;
}

function mergeRow() {
  let mergedTotal;

  for (let i = 0; i < cells.length - 1; i++) {
    if (cells[i].innerHTML === cells[i + 1].innerHTML
      && cells[i].parentElement === cells[i + 1].parentElement) {
      mergedTotal = parseInt(cells[i].innerHTML)
      + parseInt(cells[i + 1].innerHTML);
      cells[i].innerHTML = mergedTotal;
      cells[i + 1].innerHTML = '';

      if (mergedTotal === parseInt(mergedTotal)) {
        score += mergedTotal;
      };
    } else {
      isPossiblePlay();
    }
  }
  checkIfWin();
}

function mergeColumn() {
  let mergedTotal;

  for (let i = 0; i < cells.length - 4; i++) {
    if (cells[i].innerHTML === cells[i + width].innerHTML) {
      mergedTotal = parseInt(cells[i].innerHTML)
      + parseInt(cells[i + width].innerHTML);
      cells[i].innerHTML = mergedTotal;
      cells[i + width].innerHTML = '';

      if (mergedTotal === parseInt(mergedTotal)) {
        score += mergedTotal;
      };
    } else {
      isPossiblePlay();
    }
  }
  checkIfWin();
}

function isPossiblePlay() {
  for (let i = 0; i < cells.length - 4; i++) {
    if (cells[i].innerHTML === cells[i + width].innerHTML) {
      return true;
    }
  }

  for (let i = 0; i < cells.length - 1; i++) {
    if (cells[i].innerHTML === cells[i + 1].innerHTML
      && cells[i].parentElement === cells[i + 1].parentElement) {
      return true;
    }
  }

  return false;
}

function moveRight() {
  for (let i = 0; i < cells.length; i++) {
    if (i % 4 === 0) {
      const totalOne = cells[i].innerHTML;
      const totalTwo = cells[i + 1].innerHTML;
      const totalThree = cells[i + 2].innerHTML;
      const totalFour = cells[i + 3].innerHTML;
      const row = [parseInt(totalOne), parseInt(totalTwo),
        parseInt(totalThree), parseInt(totalFour)];

      const filteredRow = row.filter(num => num);
      const zeros = Array(4 - filteredRow.length).fill('');
      const newRow = zeros.concat(filteredRow);

      cells[i].innerHTML = newRow[0];
      cells[i + 1].innerHTML = newRow[1];
      cells[i + 2].innerHTML = newRow[2];
      cells[i + 3].innerHTML = newRow[3];
      cells.forEach(item => updateInfo(item));
    }
  }
}

function moveLeft() {
  for (let i = 0; i < cells.length; i++) {
    if (i % 4 === 0) {
      const totalOne = cells[i].innerHTML;
      const totalTwo = cells[i + 1].innerHTML;
      const totalThree = cells[i + 2].innerHTML;
      const totalFour = cells[i + 3].innerHTML;
      const row = [parseInt(totalOne), parseInt(totalTwo),
        parseInt(totalThree), parseInt(totalFour)];

      const filteredRow = row.filter(num => num);
      const zeros = Array(4 - filteredRow.length).fill('');
      const newRow = filteredRow.concat(zeros);

      cells[i].innerHTML = newRow[0];
      cells[i + 1].innerHTML = newRow[1];
      cells[i + 2].innerHTML = newRow[2];
      cells[i + 3].innerHTML = newRow[3];
      cells.forEach(item => updateInfo(item));
    }
  }
}

function moveUp() {
  for (let i = 0; i < width; i++) {
    const totalOne = cells[i].innerHTML;
    const totalTwo = cells[i + width].innerHTML;
    const totalThree = cells[i + (width * 2)].innerHTML;
    const totalFour = cells[i + (width * 3)].innerHTML;
    const column = [parseInt(totalOne), parseInt(totalTwo),
      parseInt(totalThree), parseInt(totalFour)];

    const filteredColumn = column.filter(num => num);
    const zeros = Array(4 - filteredColumn.length).fill('');
    const newColumn = filteredColumn.concat(zeros);

    cells[i].innerHTML = newColumn[0];
    cells[i + width].innerHTML = newColumn[1];
    cells[i + (width * 2)].innerHTML = newColumn[2];
    cells[i + (width * 3)].innerHTML = newColumn[3];
    cells.forEach(item => updateInfo(item));
  }
}

function moveDown() {
  for (let i = 0; i < width; i++) {
    const totalOne = cells[i].innerHTML;
    const totalTwo = cells[i + width].innerHTML;
    const totalThree = cells[i + (width * 2)].innerHTML;
    const totalFour = cells[i + (width * 3)].innerHTML;
    const column = [parseInt(totalOne), parseInt(totalTwo),
      parseInt(totalThree), parseInt(totalFour)];

    const filteredColumn = column.filter(num => num);
    const zeros = Array(4 - filteredColumn.length).fill('');
    const newColumn = zeros.concat(filteredColumn);

    cells[i].innerHTML = newColumn[0];
    cells[i + width].innerHTML = newColumn[1];
    cells[i + (width * 2)].innerHTML = newColumn[2];
    cells[i + (width * 3)].innerHTML = newColumn[3];
    cells.forEach(item => updateInfo(item));
  }
}

function move() {
  document.body.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowLeft':
        moveLeft();
        mergeRow();
        moveLeft();
        generateNewCell(cells);
        break;

      case 'ArrowRight':
        moveRight();
        mergeRow();
        moveRight();
        generateNewCell(cells);
        break;

      case 'ArrowUp':
        moveUp();
        mergeColumn();
        moveUp();
        generateNewCell(cells);
        break;

      case 'ArrowDown':
        moveDown();
        mergeColumn();
        moveDown();
        generateNewCell(cells);
        break;
    }
  });
}

function checkIfWin() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerHTML === '2048') {
      messageWin.classList.remove('hidden');
      messageStart.classList.add('hidden');
      messageLose.classList.add('hidden');
    }
  }
}

function checkIfGameOver() {
  let emptyCells = 0;

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerHTML === '') {
      emptyCells++;
    }
  }

  if (emptyCells === 0 && !isPossiblePlay()) {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  }
}

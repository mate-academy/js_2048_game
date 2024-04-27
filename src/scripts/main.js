'use strict';

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const gameScore = document.querySelector('.game-score');
const start = document.querySelector('.start');
const game = document.querySelector('.game');

const table = document.createElement('table');

table.classList.add('game-field');

const rows = 4;
const cols = 4;
let score = 0;

for (let i = 0; i < rows; i++) {
  const row = document.createElement('tr');

  row.classList.add('field-row');

  for (let j = 0; j < cols; j++) {
    const cell = document.createElement('td');

    cell.classList.add('field-cell');
    cell.textContent = null;
    row.appendChild(cell);
  }

  table.appendChild(row);
}

game.appendChild(table);

const cells = document.querySelectorAll('.field-cell');
const cellsArray = Array.from(cells);

const generate = () => {
  const emptyCells = cellsArray.filter((e) => !e.textContent);
  const numEmptyCells = emptyCells.length;
  const randomIndex = Math.floor(Math.random() * numEmptyCells);
  const randomEmptyCell = emptyCells[randomIndex];
  const randomNumber = Math.random() < 0.9 ? 2 : 4;

  randomEmptyCell.textContent = randomNumber;
  start.textContent = 'Reset';
  start.classList.add('restart');

  if (!checkAvailableMoves()) {
    gameOver();
  }

  addColours();
};

const starting = () => {
  score = 0;
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  generate();
  generate();
};

starting();

start.addEventListener('click', () => {
  cellsArray.forEach((e) => (e.textContent = null));
  starting();
});

function checkAvailableMoves() {
  for (let i = 0; i < cellsArray.length; i++) {
    if (!cellsArray[i].textContent) {
      return true;
    }
  }

  for (let i = 0; i < cellsArray.length - width; i++) {
    if (
      cellsArray[i].textContent === cellsArray[i + width].textContent
      && cellsArray[i].textContent !== ''
    ) {
      return true;
    }
  }

  // Перевірка об'єднання вниз
  for (let i = width; i < cellsArray.length; i++) {
    if (
      cellsArray[i].textContent === cellsArray[i - width].textContent
      && cellsArray[i].textContent !== ''
    ) {
      return true;
    }
  }

  for (let i = 0; i < cellsArray.length; i++) {
    if (i % width !== 0) {
      if (
        cellsArray[i].textContent === cellsArray[i - 1].textContent
        && cellsArray[i].textContent !== ''
      ) {
        return true;
      }
    }
  }

  return false;
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowUp') {
    keyUp();
    console.log('Натиснута клавіша "Вгору"');
  } else if (event.key === 'ArrowDown') {
    keyDown();
    console.log('Натиснута клавіша "Вниз"');
  } else if (event.key === 'ArrowLeft') {
    keyLeft();
    console.log('Натиснута клавіша "Вліво"');
  } else if (event.key === 'ArrowRight') {
    keyRight();
    console.log('Натиснута клавіша "Вправо"');
  }
});

const width = 4;

function moveUp() {
  for (let i = 0; i < 4; i++) {
    const index = [i, i + width, i + width * 2, i + width * 3];
    const column = [index.map((e) => cellsArray[e].textContent)];
    const filteredColumn = column[0].filter((num) => num);
    const missing = 4 - filteredColumn.length;
    const zeros = Array(missing).fill(0);
    const newColumn = filteredColumn.concat(zeros);

    index.forEach((e, index) => {
      cellsArray[e].textContent
        = newColumn[index] === 0 ? '' : newColumn[index];
    });
  }
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    const index = [i, i + width, i + width * 2, i + width * 3];
    const column = index.map((e) => cellsArray[e].textContent);
    const filteredColumn = column.filter((num) => num);
    const missing = 4 - filteredColumn.length;
    const zeros = Array(missing).fill(0);
    const newColumn = zeros.concat(filteredColumn);

    index.forEach((e, index) => {
      cellsArray[e].textContent
        = newColumn[index] === 0 ? '' : newColumn[index];
    });
  }
}

function moveLeft() {
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      const index = [i, i + 1, i + 2, i + 3];
      const row = index.map((e) => parseInt(cellsArray[e].textContent));
      const filteredRow = row.filter((num) => num);
      const missing = 4 - filteredRow.length;
      const zeros = Array(missing).fill(0);
      const newRow = filteredRow.concat(zeros);

      index.forEach((e, index) => {
        cellsArray[e].textContent = newRow[index] === 0 ? '' : newRow[index];
      });
    }
  }
}

function moveRight() {
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      const index = [i, i + 1, i + 2, i + 3];
      const row = index.map((e) => parseInt(cellsArray[e].textContent));
      const filteredRow = row.filter((num) => num);
      const missing = 4 - filteredRow.length;
      const zeros = Array(missing).fill(0);
      const newRow = zeros.concat(filteredRow);

      index.forEach((e, index) => {
        cellsArray[e].textContent = newRow[index] === 0 ? '' : newRow[index];
      });
    }
  }
}

function keyUp() {
  moveUp();
  combineColumn();
  moveUp();
  generate();
}

function keyDown() {
  moveDown();
  combineColumn();
  moveDown();
  generate();
}

function keyLeft() {
  moveLeft();
  combineRow();
  moveLeft();
  generate();
}

function keyRight() {
  moveRight();
  combineRow();
  moveRight();
  generate();
}

function combineColumn() {
  for (let i = 0; i < 12; i++) {
    if (
      cellsArray[i].textContent === cellsArray[i + width].textContent
      && cellsArray[i].textContent !== ''
    ) {
      const combinedTotal = parseInt(cellsArray[i].textContent) * 2;

      cellsArray[i].textContent = combinedTotal;
      cellsArray[i + width].textContent = '';
      score += combinedTotal;
      gameScore.textContent = score;
    }
  }
  checkForWin();
}

function combineRow() {
  for (let i = 0; i < 15; i++) {
    if (
      cellsArray[i].textContent === cellsArray[i + 1].textContent
      && cellsArray[i].textContent !== ''
    ) {
      const combinedTotal = parseInt(cellsArray[i].textContent) * 2;

      cellsArray[i].textContent = combinedTotal;
      cellsArray[i + 1].textContent = '';
      score += combinedTotal;
      gameScore.textContent = score;
    }
  }
  checkForWin();
}

function addColours() {
  for (let i = 0; i < cellsArray.length; i++) {
    cellsArray[i].classList.remove(
      'field-cell--2',
      'field-cell--4',
      'field-cell--8',
      'field-cell--16',
      'field-cell--32',
      'field-cell--64',
      'field-cell--128',
      'field-cell--256',
      'field-cell--512',
      'field-cell--1024',
      'field-cell--2048',
    );

    if (!cellsArray[i].textContent) {
      cellsArray[i].classList.add('field-cell');
    } else if (cellsArray[i].textContent == 2) {
      cellsArray[i].classList.add('field-cell--2');
    } else if (parseInt(cellsArray[i].textContent) == 4) {
      cellsArray[i].classList.add('field-cell--4');
    } else if (cellsArray[i].textContent == 8) {
      cellsArray[i].classList.add('field-cell--8');
    } else if (cellsArray[i].textContent == 16) {
      cellsArray[i].classList.add('field-cell--16');
    } else if (cellsArray[i].textContent == 32) {
      cellsArray[i].classList.add('field-cell--32');
    } else if (cellsArray[i].textContent == 64) {
      cellsArray[i].classList.add('field-cell--64');
    } else if (cellsArray[i].textContent == 128) {
      cellsArray[i].classList.add('field-cell--128');
    } else if (cellsArray[i].textContent == 256) {
      cellsArray[i].classList.add('field-cell--256');
    } else if (cellsArray[i].textContent == 512) {
      cellsArray[i].classList.add('field-cell--512');
    } else if (cellsArray[i].textContent == 1024) {
      cellsArray[i].classList.add('field-cell--512');
    } else if (cellsArray[i].textContent == 2048) {
      cellsArray[i].classList.add('field-cell--2048');
    }
  }
}
addColours();

function checkForWin() {
  for (let i = 0; i < cellsArray.length; i++) {
    if (cellsArray[i].textContent == 2048) {
      messageWin.classList.remove('hidden');
      gameStart();
      document.removeEventListener('keydown', control);
    }
  }
}

function gameOver() {
  messageLose.classList.remove('hidden');
  gameStart();
  cellsArray.map((e) => (e.textContent = ''));

  cellsArray[4].textContent = 'G';
  cellsArray[5].textContent = 'A';
  cellsArray[6].textContent = 'M';
  cellsArray[7].textContent = 'E';
  cellsArray[8].textContent = 'O';
  cellsArray[9].textContent = 'V';
  cellsArray[10].textContent = 'E';
  cellsArray[11].textContent = 'R';
}

function gameStart() {
  messageStart.classList.remove('hidden');
  start.textContent = 'Start';
  start.classList.remove('restart');
}

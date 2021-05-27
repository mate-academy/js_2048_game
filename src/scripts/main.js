/* eslint-disable no-unused-vars */
'use strict';

const fieldCells = [...document.querySelectorAll('.field-cell')];
const elementScore = document.querySelector('.game-score');
let gameScore = +(document.querySelector('.game-score').textContent);
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

// click 'Start'
startButton.addEventListener('click', (e) => {
  if (e.target.classList.contains('restart')) {
    for (const cell of fieldCells) {
      cell.className = 'field-cell';
      cell.textContent = '';
    }

    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    gameScore = 0;
    elementScore.innerHTML = 0;
  }

  if (e.target.classList.contains('start')) {
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.textContent = 'Restart';
    startMessage.hidden = true;
  }

  createCell();
  createCell();
});

// generating a new cell
function createCell() {
  const randomCell = Math.floor(Math.random() * 16);

  if (fieldCells[randomCell].classList.length === 1) {
    const probabilityOfFour = Math.floor(Math.random() * 10);
    let cellValue = 0;

    probabilityOfFour === 1
      ? cellValue = 4
      : cellValue = 2;

    fieldCells[randomCell].classList.add(`field-cell--${cellValue}`);
    fieldCells[randomCell].textContent = `${cellValue}`;
  } else {
    createCell();
  }
}

// moving right or left
function moveVertically(side) {
  for (let i = 0; i < 16; i += 4) {
    const row = [];

    for (let x = 0; x < 4; x++) {
      row.push(+(fieldCells[i + x].innerHTML));
    }

    const filteredRow = row.filter(num => num !== 0);
    let newRow;

    if (side === 'right') {
      newRow = Array(4 - filteredRow.length).fill('').concat(filteredRow);
    }

    if (side === 'left') {
      newRow = filteredRow.concat(Array(4 - filteredRow.length).fill(''));
    }

    for (let y = 0; y < 4; y++) {
      fieldCells[i + y].className = 'field-cell';

      if (newRow[y] !== '') {
        fieldCells[i + y].classList.add(`field-cell--${newRow[y]}`);
      }

      fieldCells[i + y].innerHTML = newRow[y];
    }
  }
}

// moving up or down
function moveHorisontally(side) {
  for (let i = 0; i < 4; i++) {
    const col = [];

    for (let x = 0; x <= 12; x += 4) {
      col.push(+(fieldCells[i + x].innerHTML));
    }

    const filteredCol = col.filter(num => num !== 0);
    let newCol;

    if (side === 'up') {
      newCol = filteredCol.concat(Array(4 - filteredCol.length).fill(''));
    }

    if (side === 'down') {
      newCol = Array(4 - filteredCol.length).fill('').concat(filteredCol);
    }

    for (let x = 0; x <= 12; x += 4) {
      fieldCells[i + x].className = 'field-cell';

      if (newCol[x / 4] !== '') {
        fieldCells[i + x].classList.add(`field-cell--${newCol[x / 4]}`);
      }

      fieldCells[i + x].innerHTML = newCol[x / 4];
    }
  }
}

// adding cells in rows
function addingRows(side) {
  for (let i = 0; i < 15; i++) {
    if (fieldCells[i].innerHTML === fieldCells[i + 1].innerHTML
      && fieldCells[i].innerHTML !== '') {
      const sum = +(fieldCells[i].innerHTML) + +(fieldCells[i + 1].innerHTML);
      let sumCell;
      let emptyCell;

      if (side === 'left') {
        sumCell = fieldCells[i];
        emptyCell = fieldCells[i + 1];
      }

      if (side === 'right') {
        sumCell = fieldCells[i + 1];
        emptyCell = fieldCells[i];
      }

      sumCell.innerHTML = sum;
      sumCell.classList.add(`field-cell--${sum}`);
      emptyCell.innerHTML = '';
      emptyCell.className = 'field-cell';
      gameScore += sum;
      elementScore.innerHTML = gameScore;
    }
  }
}

// adding cells in columns
function addingColumns(side) {
  for (let i = 0; i < 12; i++) {
    if (fieldCells[i].innerHTML === fieldCells[i + 4].innerHTML
      && fieldCells[i].innerHTML !== '') {
      const sum = +(fieldCells[i].innerHTML) + +(fieldCells[i + 4].innerHTML);
      let sumCell;
      let emptyCell;

      if (side === 'up') {
        sumCell = fieldCells[i];
        emptyCell = fieldCells[i + 4];
      }

      if (side === 'down') {
        sumCell = fieldCells[i + 4];
        emptyCell = fieldCells[i];
      }

      sumCell.innerHTML = sum;
      sumCell.classList.add(`field-cell--${sum}`);
      emptyCell.innerHTML = '';
      emptyCell.className = 'field-cell';
      gameScore += sum;
      elementScore.innerHTML = gameScore;
    }
  }
}

// pressing keys
document.addEventListener('keydown', (e) => {
  if (startButton.classList.contains('start')
    || !loseMessage.classList.contains('hidden')) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    moveVertically('left');
    addingRows('left');
    check();
  }

  if (e.key === 'ArrowRight') {
    moveVertically('right');
    addingRows('right');
    check();
  }

  if (e.key === 'ArrowUp') {
    moveHorisontally('up');
    addingColumns('up');
    check();
  }

  if (e.key === 'ArrowDown') {
    moveHorisontally('down');
    addingColumns('down');
    check();
  }

  createCell();
});

// win or lose
function check() {
  let freeCells = 0;

  for (const cell of fieldCells) {
    if (cell.innerHTML === '2048') {
      winMessage.classList.remove('hidden');
    };

    if (cell.innerHTML === '') {
      freeCells++;
    };
  }

  if (freeCells === 0) {
    let availableMoves = 0;

    for (let i = 0; i < 15; i++) {
      if (fieldCells[i].innerHTML === fieldCells[i + 1].innerHTML
        && fieldCells[i].innerHTML !== '') {
        availableMoves++;
      }
    }

    for (let i = 0; i < 12; i++) {
      if (fieldCells[i].innerHTML === fieldCells[i + 4].innerHTML
        && fieldCells[i].innerHTML !== '') {
        availableMoves++;
      }
    }

    if (availableMoves === 0) {
      loseMessage.classList.remove('hidden');
    }
  }
}

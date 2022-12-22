'use strict';

const [...cells] = document.querySelectorAll('td');
const button = document.querySelector('button');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const startText = document.querySelector('.message-start');
const score = document.querySelector('.game-score');

function emptyCellIndex(arrayCell) {
  const emptyCell = [];

  for (let i = 0; i < arrayCell.length; i++) {
    if (!arrayCell[i].textContent.length) {
      emptyCell.push(i);
    }
  }

  return emptyCell;
}

button.addEventListener('click', () => {
  button.textContent = 'Reset';
  button.classList.remove('start');
  button.classList.add('restart');
  score.textContent = '0';

  startText.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  for (let i = 0; i < cells.length; i++) {
    cells[i].textContent = '';
    cells[i].className = 'field-cell';
  }

  randomizer();
  randomizer();
});

document.body.addEventListener('keydown', (e) => {
  if (button.textContent === 'Start') {
    return;
  }

  if (!messageLose.classList.contains('hidden')) {
    return;
  }

  const [...lines] = document.querySelectorAll('tr');
  const line1 = [];
  const line2 = [];
  const line3 = [];
  const line4 = [];

  for (let i = 0; i < lines.length; i++) {
    const [...lineCell] = lines[i].querySelectorAll('td');

    line1.push(lineCell[0]);
    line2.push(lineCell[1]);
    line3.push(lineCell[2]);
    line4.push(lineCell[3]);
  }

  switch (e.key) {
    case 'ArrowLeft':
      MoveLeft();
      randomizer();
      break;
    case 'ArrowRight':
      MoveRight();
      randomizer();
      break;
    case 'ArrowUp':
      MoveUp(line1);
      MoveUp(line2);
      MoveUp(line3);
      MoveUp(line4);
      randomizer();
      break;
    case 'ArrowDown':
      MoveDown(line1);
      MoveDown(line2);
      MoveDown(line3);
      MoveDown(line4);
      randomizer();
      break;
    default:
      break;
  }

  const [...cellsAll] = document.querySelectorAll('td');

  cellsAll.forEach((element) => {
    if (element.textContent === '2048') {
      messageWin.classList.remove('hidden');
    }
  });
});

function randomizer() {
  const [...tdCells] = document.querySelectorAll('td');
  const emptyCellArray = emptyCellIndex(tdCells);

  if (!emptyCellArray.length) {
    messageLose.classList.remove('hidden');

    return;
  }

  let valueCell = Math.random();

  if (valueCell > 0.9) {
    valueCell = 4;
  } else {
    valueCell = 2;
  }

  const randomIndex = Math.floor(Math.random() * emptyCellArray.length);
  const index = emptyCellArray[randomIndex];

  cells[index].textContent = valueCell;
  cells[index].classList.add(`field-cell--${valueCell}`);
}

function MoveLeft() {
  const [...linesTr] = document.querySelectorAll('tr');

  linesTr.forEach(elementTr => {
    const [...beginRow] = elementTr.querySelectorAll('td');

    move(beginRow);

    addCells(beginRow);

    move(beginRow);
  });
}

function MoveRight() {
  const [...linesTr] = document.querySelectorAll('tr');

  linesTr.forEach(elementTr => {
    const [...beginRow] = elementTr.querySelectorAll('td');

    move(beginRow);
    beginRow.reverse();

    addCells(beginRow);

    move(beginRow);
    beginRow.reverse();
  });
}

function MoveUp(line) {
  move(line);

  addCells(line);

  move(line);
}

function MoveDown(line) {
  move(line);
  line.reverse();

  addCells(line);

  move(line);
  line.reverse();
}

function move(line) {
  const valueCell = line.filter(element => element.textContent !== '');

  line.forEach((element, index) => {
    if (valueCell[index]) {
      element.textContent = valueCell[index].textContent;
      element.className = valueCell[index].className;
    } else {
      element.textContent = '';
      element.className = 'field-cell';
    }
  });
}

function addCells(line) {
  for (let i = 0; i < line.length; i++) {
    const number = +line[i].textContent;

    if (i < line.length - 1 && number > 0) {
      const nextNumber = +line[i + 1].textContent;

      if (number > 0 && number === nextNumber) {
        line[i].textContent = `${number + nextNumber}`;
        line[i].classList.remove(`field-cell--${number}`);
        line[i].classList.add(`field-cell--${+line[i].textContent}`);
        line[i + 1].textContent = '';
        line[i + 1].className = 'field-cell';

        score.textContent = `${+score.textContent + (+line[i].textContent)}`;
      }
    }
  }
}

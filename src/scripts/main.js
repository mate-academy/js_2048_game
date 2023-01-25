'use strict';

const scoreDisplay = document.querySelector('.game-score');
const button = document.querySelector('.start');
const cells = document.querySelectorAll('td');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
let score = 0;

button.addEventListener('click', e => {
  startGame();
  score = 0;
  scoreDisplay.innerHTML = 0;
  document.addEventListener('keyup', move);
});

function startGame() {
  cells.forEach(el => {
    el.innerHTML = '';

    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
  });
  button.classList.remove('restart-lose');
  button.className = 'button restart';
  button.innerHTML = 'Restart';
  generate();
  generate();
  styles();
}
styles();

function generate() {
  const randomNumber = Math.floor(Math.random() * cells.length);

  if (cells[randomNumber].innerHTML === '') {
    cells[randomNumber].innerHTML = random();
    checkForLose();
  } else {
    generate();
  }
}

function random() {
  return Math.random() > 0.9 ? 4 : 2;
}

function moveRight() {
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      const totalOne = cells[i].innerHTML;
      const totalTwo = cells[i + 1].innerHTML;
      const totalThree = cells[i + 2].innerHTML;
      const totalFour = cells[i + 3].innerHTML;
      const row = [+totalOne, +totalTwo, +totalThree, +totalFour];

      const filtredRow = row.filter(num => num);
      const missing = 4 - filtredRow.length;
      const zeros = Array(missing).fill('');

      const newRow = zeros.concat(filtredRow);

      cells[i].innerHTML = newRow[0];
      cells[i + 1].innerHTML = newRow[1];
      cells[i + 2].innerHTML = newRow[2];
      cells[i + 3].innerHTML = newRow[3];
    }
  }
}

function moveLeft() {
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      const totalOne = cells[i].innerHTML;
      const totalTwo = cells[i + 1].innerHTML;
      const totalThree = cells[i + 2].innerHTML;
      const totalFour = cells[i + 3].innerHTML;
      const row = [+totalOne, +totalTwo, +totalThree, +totalFour];

      const filtredRow = row.filter(num => num);
      const missing = 4 - filtredRow.length;
      const zeros = Array(missing).fill('');

      const newRow = filtredRow.concat(zeros);

      cells[i].innerHTML = newRow[0];
      cells[i + 1].innerHTML = newRow[1];
      cells[i + 2].innerHTML = newRow[2];
      cells[i + 3].innerHTML = newRow[3];
    }
  }
}

function combineRow() {
  for (let i = 0; i < 15; i++) {
    if ((i % 4 !== 3) && cells[i].innerHTML === cells[i + 1].innerHTML) {
      const combinedTotal
      = parseInt(cells[i].innerHTML) + parseInt(cells[i + 1].innerHTML);

      cells[i + 1].innerHTML = combinedTotal;
      cells[i].innerHTML = 0;

      if (!isNaN(combinedTotal)) {
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
  }
  checkForWin();
}

function combineColumn() {
  for (let i = 0; i < 12; i++) {
    if (cells[i].innerHTML === cells[i + 4].innerHTML) {
      const combinedTotal
      = parseInt(cells[i].innerHTML) + parseInt(cells[i + 4].innerHTML);

      cells[i + 4].innerHTML = combinedTotal;
      cells[i].innerHTML = 0;

      if (!isNaN(combinedTotal)) {
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
  }
  checkForWin();
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    const totalOne = cells[i].innerHTML;
    const totalTwo = cells[i + 4].innerHTML;
    const totalThree = cells[i + 8].innerHTML;
    const totalFour = cells[i + 12].innerHTML;
    const column = [+totalOne, +totalTwo, +totalThree, +totalFour];

    const filteredColumn = column.filter(num => num);
    const missing = 4 - filteredColumn.length;
    const zeros = Array(missing).fill('');
    const newColumn = zeros.concat(filteredColumn);

    cells[i].innerHTML = newColumn[0];
    cells[i + 4].innerHTML = newColumn[1];
    cells[i + 8].innerHTML = newColumn[2];
    cells[i + 12].innerHTML = newColumn[3];
  }
}

function moveUp() {
  for (let i = 0; i < 4; i++) {
    const totalOne = cells[i].innerHTML;
    const totalTwo = cells[i + 4].innerHTML;
    const totalThree = cells[i + 8].innerHTML;
    const totalFour = cells[i + 12].innerHTML;
    const column = [+totalOne, +totalTwo, +totalThree, +totalFour];

    const filteredColumn = column.filter(num => num);
    const missing = 4 - filteredColumn.length;
    const zeros = Array(missing).fill('');
    const newColumn = filteredColumn.concat(zeros);

    cells[i].innerHTML = newColumn[0];
    cells[i + 4].innerHTML = newColumn[1];
    cells[i + 8].innerHTML = newColumn[2];
    cells[i + 12].innerHTML = newColumn[3];
  }
}

function styles() {
  cells.forEach(el => {
    const cellClass = `field-cell--${el.innerHTML}`;

    el.className = '';
    el.classList.add('field-cell');

    if (el.innerText > 0) {
      el.classList.add(cellClass);
    };
  });
}

function move(e) {
  if (e.code === 'ArrowRight') {
    moveRight();
    combineRow();
    moveRight();
    generate();
    styles();
  };

  if (e.code === 'ArrowLeft') {
    moveLeft();
    combineRow();
    moveLeft();
    generate();
    styles();
  };

  if (e.code === 'ArrowDown') {
    moveDown();
    combineColumn();
    moveDown();
    generate();
    styles();
  };

  if (e.code === 'ArrowUp') {
    moveUp();
    combineColumn();
    moveUp();
    generate();
    styles();
  }
}

function checkingRow() {
  for (let i = 0; i < cells.length - 1; i++) {
    if (cells[i].innerHTML === cells[i + 1].innerHTML) {
      return true;
    }
  }

  return false;
}

function checkingColumn() {
  for (let i = 0; i < 12; i++) {
    if (cells[i].innerHTML === cells[i + 4].innerHTML) {
      return true;
    }
  }

  return false;
}

function checkForLose() {
  let empties = 0;

  cells.forEach(el => {
    if (el.innerHTML === '') {
      empties++;
    }
  });

  if (empties === 0 && !checkingRow() && !checkingColumn()) {
    messageStart.classList.add('hidden');
    messageLose.classList.remove('hidden');
    button.classList.remove('restart');
    button.classList.add('restart-lose');
    document.removeEventListener('keyup', move);
  }
}

function checkForWin() {
  cells.forEach(el => {
    if (el.innerHTML === '2048') {
      messageStart.classList.add('hidden');
      messageWin.classList.remove('hidden');
      document.removeEventListener('keyup', move);
    }
  });
}

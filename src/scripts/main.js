'use strict';

const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const rows = document.querySelectorAll('.field-row');

function addTile() {
  const emptyCells = [...cells].filter(cell => !cell.textContent);

  if (emptyCells.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const randomNumber = Math.random() < 0.9 ? '2' : '4';

  emptyCells[randomIndex].classList.add('field-cell--' + randomNumber);
  emptyCells[randomIndex].classList.add('field-cell--animation');
  emptyCells[randomIndex].textContent = randomNumber;
}

function restart() {
  [...cells].forEach(cell => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });
  score.textContent = 0;
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.textContent = 'Restart';
    startMessage.classList.add('hidden');

    addTile();
    addTile();
  } else if (e.target.classList.contains('restart')) {
    restart();
    addTile();
    addTile();
  }
});

function moveUp(index) {
  let colNums = [];

  rows.forEach(row => {
    colNums.push(+row.cells[index].textContent);
  });

  colNums = colNums.filter(num => !!num);

  for (let i = 0; i < colNums.length - 1; i++) {
    if (colNums[i] === colNums[i + 1]) {
      score.textContent = +score.textContent + colNums[i] * 2;
      colNums[i] *= 2;
      colNums[i + 1] = 0;
    }
  }

  colNums = colNums.filter(num => !!num);

  while (colNums.length < 4) {
    colNums.push(0);
  }

  rows.forEach((row, i) => {
    row.cells[index].textContent = colNums[i] || '';
  });
  addCorrectClasses();
}

function moveDown(index) {
  let colNums = [];

  rows.forEach(row => {
    colNums.push(+row.cells[index].textContent);
  });

  colNums = colNums.reverse().filter(num => !!num);

  for (let i = 0; i < colNums.length - 1; i++) {
    if (colNums[i] === colNums[i + 1]) {
      score.textContent = +score.textContent + colNums[i] * 2;
      colNums[i] *= 2;
      colNums[i + 1] = 0;
    }
  }

  colNums = colNums.reverse().filter(num => !!num);

  while (colNums.length < 4) {
    colNums.unshift(0);
  }

  rows.forEach((row, i) => {
    row.cells[index].textContent = colNums[i] || '';
  });
  addCorrectClasses();
}

function moveRight() {
  rows.forEach(row => {
    let rowNums = [];

    [...row.cells].forEach(cell => rowNums.push(+cell.innerHTML));

    rowNums = rowNums.reverse().filter(num => !!num);

    for (let i = 0; i < rowNums.length - 1; i++) {
      if (rowNums[i] === rowNums[i + 1]) {
        score.textContent = +score.textContent + rowNums[i] * 2;
        rowNums[i] *= 2;
        rowNums[i + 1] = 0;
      }
    }

    rowNums = rowNums.reverse().filter(num => !!num);

    while (rowNums.length < 4) {
      rowNums.unshift(0);
    }

    [...row.cells].forEach((cell, i) => {
      cell.textContent = rowNums[i] || '';
    });
  });
  addCorrectClasses();
}

function moveLeft() {
  rows.forEach(row => {
    let rowNums = [];

    [...row.cells].forEach(cell => rowNums.push(+cell.innerHTML));

    rowNums = rowNums.filter(num => !!num);

    for (let i = 0; i < rowNums.length - 1; i++) {
      if (rowNums[i] === rowNums[i + 1]) {
        score.textContent = +score.textContent + rowNums[i] * 2;
        rowNums[i] *= 2;
        rowNums[i + 1] = 0;
      }
    }

    rowNums = rowNums.filter(num => !!num);

    while (rowNums.length < 4) {
      rowNums.push(0);
    }

    [...row.cells].forEach((cell, i) => {
      cell.textContent = rowNums[i] || '';
    });
  });
  addCorrectClasses();
}

function addCorrectClasses() {
  for (const cell of cells) {
    cell.className = 'field-cell';

    switch (cell.textContent) {
      case '2': cell.classList.add('field-cell--2'); break;
      case '4': cell.classList.add('field-cell--4'); break;
      case '8': cell.classList.add('field-cell--8'); break;
      case '16': cell.classList.add('field-cell--16'); break;
      case '32': cell.classList.add('field-cell--32'); break;
      case '64': cell.classList.add('field-cell--64'); break;
      case '128': cell.classList.add('field-cell--128'); break;
      case '256': cell.classList.add('field-cell--256'); break;
      case '512': cell.classList.add('field-cell--512'); break;
      case '1024': cell.classList.add('field-cell--1024'); break;
      case '2048': cell.classList.add('field-cell--2048'); break;
    };
  }
}

function gameOverCheck() {
  const fullFieldCells = [...cells].filter(cell => !!cell.textContent);

  if (fullFieldCells.length === 16) {
    const beforeCheckCells = [...fullFieldCells].map(cell => cell.textContent);
    const scoreBeforeCheck = score.textContent;

    moveUp(0);
    moveUp(1);
    moveUp(2);
    moveUp(3);
    moveRight();

    const changeCheck = [...cells].every((cell, i) => (
      cell.textContent === beforeCheckCells[i]
    ));

    if (changeCheck) {
      loseMessage.classList.remove('hidden');
    }

    [...cells].forEach((cell, i) => {
      cell.textContent = beforeCheckCells[i];
    });
    addCorrectClasses();
    score.textContent = scoreBeforeCheck;
  }
}

function winCheck() {
  const win = [...cells].some(cell => cell.textContent === '2048');

  if (win) {
    winMessage.classList.remove('hidden');

    return true;
  }

  return false;
}

document.addEventListener('keydown', e => {
  if (
    document.querySelector('.start')
    || !loseMessage.classList.contains('hidden')
    || !winMessage.classList.contains('hidden')
  ) {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      moveUp(0);
      moveUp(1);
      moveUp(2);
      moveUp(3);
      addTile();
      addTile();
      break;

    case 'ArrowDown':
      moveDown(0);
      moveDown(1);
      moveDown(2);
      moveDown(3);
      addTile();
      addTile();
      break;

    case 'ArrowRight':
      moveRight();
      addTile();
      addTile();
      break;

    case 'ArrowLeft':
      moveLeft();
      addTile();
      addTile();
      break;
  }

  if (winCheck()) {
    return;
  }
  gameOverCheck();
});

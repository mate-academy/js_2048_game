'use strict';

const score = document.querySelector('.game-score');
const buttonStart = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');

function getRandomIntInclusive(min, max) {
  const first = Math.ceil(min);
  const end = Math.floor(max);

  return Math.floor(Math.random() * (end - first + 1) + first);
}

function restartGame() {
  const cells = document.querySelectorAll('.field-cell');

  for (const index of [...cells]) {
    index.innerHTML = '';
    index.className = '';
    index.classList.add('field-cell');
  }

  score.innerHTML = 0;
  messageLose.hidden = true;
  messageStart.hidden = true;
  messageWin.hidden = true;

  numberAdder();
  numberAdder();
  numberAdder();
}

function numberAdder() {
  const cells = document.querySelectorAll('.field-cell');
  let random = getRandomIntInclusive(0, 15);
  const roll = Math.random();

  const emptyFields = [...cells].filter(el => el.innerHTML.length === 0);

  if (emptyFields.length === 0) {
    return;
  }

  if (cells[random].innerHTML.length) {
    while (cells[random].innerHTML.length) {
      random = getRandomIntInclusive(0, 15);
    }
  }

  cells[random].innerHTML = roll > 0.1 ? '2' : '4';

  switch (cells[random].innerHTML) {
    case '2': cells[random].classList.add('field-cell--2'); break;
    case '4': cells[random].classList.add('field-cell--4'); break;
  }
}

function gameWinner() {
  const allCells = document.querySelectorAll('.field-cell');

  if ([...allCells].find(el => el.innerHTML === '2048')) {
    messageWin.hidden = false;
  }
}

function clearEmptyCells(array) {
  return array.filter(el => el !== 0);
}

function transformIntoArray(array) {
  return array.filter(el => el.innerHTML).map(el => el.innerHTML).map(Number);
}

function moveBottom(array, childIndex) {
  let result = [];

  array.forEach(el => {
    result.push(+el.children[childIndex].innerHTML);
  });

  result = clearEmptyCells(result.reverse());

  if (result.length > 0) {
    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === result[i + 1]) {
        score.innerHTML = +score.innerHTML + result[i + 1] * 2;
        result[i + 1] *= 2;
        result[i] = 0;
      }
    }
  }

  result = clearEmptyCells(result.reverse());

  while (result.length < 4) {
    result.unshift(0);
  }

  array.forEach((el, i) => {
    el.children[childIndex].innerHTML = result[i] || '';
  });
}

function moveTop(array, childIndex) {
  let result = [];

  array.forEach(el => {
    result.push(+el.children[childIndex].innerHTML);
  });

  result = clearEmptyCells(result);

  if (result.length > 0) {
    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === result[i + 1]) {
        score.innerHTML = +score.innerHTML + result[i] * 2;
        result[i] *= 2;
        result[i + 1] = 0;
      }
    }
  }

  result = clearEmptyCells(result);

  while (result.length < 4) {
    result.push(0);
  }

  array.forEach((el, i) => {
    el.children[childIndex].innerHTML = result[i] || '';
  });
}

function moveLeft(array) {
  array.forEach(el => {
    let cells = el.querySelectorAll('.field-cell');

    cells = transformIntoArray([...cells]);

    if (cells.length > 0) {
      for (let i = 0; i < cells.length - 1; i++) {
        if (cells[i] === cells[i + 1]) {
          score.innerHTML = +score.innerHTML + cells[i] * 2;
          cells[i] *= 2;
          cells[i + 1] = 0;
        }
      }
    }

    cells = clearEmptyCells(cells);

    while (cells.length < 4) {
      cells.push(0);
    }

    for (let i = 0; i < el.children.length; i++) {
      el.children[i].innerHTML = cells[i] || '';
    }
  });
}

function moveRight(array) {
  array.forEach(el => {
    let cells = el.querySelectorAll('.field-cell');

    cells = transformIntoArray([...cells]).reverse();

    if (cells.length > 0) {
      for (let i = 0; i < cells.length - 1; i++) {
        if (cells[i] === cells[i + 1]) {
          score.innerHTML = +score.innerHTML + cells[i] * 2;
          cells[i] *= 2;
          cells[i + 1] = 0;
        }
      }
    }

    cells = clearEmptyCells(cells.reverse());

    while (cells.length < 4) {
      cells.unshift(0);
    }

    for (let i = el.children.length - 1; i >= 0; i--) {
      el.children[i].innerHTML = cells[i] || '';
    }
  });
}

function possibleMove(array) {
  moveTop(array, 0);
  moveTop(array, 1);
  moveTop(array, 2);
  moveTop(array, 3);
  moveBottom(array, 0);
  moveBottom(array, 1);
  moveBottom(array, 2);
  moveBottom(array, 3);
  moveLeft(array);
  moveRight(array);
}

function gameOver() {
  messageLose.hidden = false;
  messageStart.hidden = true;
}

document.addEventListener('keydown', function(e) {
  if (e.keyCode < 37 || e.keyCode > 40) {
    return;
  }

  const trs = document.querySelectorAll('.field-row');
  const allCells = document.querySelectorAll('.field-cell');
  let notMoved = document.querySelectorAll('.field-cell');

  notMoved = [...notMoved].map(item => item.innerHTML);
  addClassesToCells(allCells);

  switch (e.keyCode) {
    case 37: moveLeft(trs); break;
    case 38:
      moveTop(trs, 0);
      moveTop(trs, 1);
      moveTop(trs, 2);
      moveTop(trs, 3); break;
    case 39: moveRight(trs); break;
    case 40:
      moveBottom(trs, 0);
      moveBottom(trs, 1);
      moveBottom(trs, 2);
      moveBottom(trs, 3); break;
  }

  gameWinner();

  let moved = document.querySelectorAll('.field-cell');

  moved = [...moved].map(item => item.innerHTML);

  if (JSON.stringify(notMoved) !== JSON.stringify(moved)) {
    numberAdder();
    addClassesToCells(allCells);
  }

  const emptyFields = [...document.querySelectorAll('.field-cell')]
    .filter(el => el.innerHTML.length === 0);

  if (emptyFields.length === 0) {
    const notChangedCells = document.querySelectorAll('.field-cell');
    const beforeMove = [...notChangedCells].map(item => item.innerHTML);

    possibleMove(trs);

    let changedCells = document.querySelectorAll('.field-cell');

    changedCells = [...changedCells].map(item => item.innerHTML);

    if (JSON.stringify(beforeMove) === JSON.stringify(changedCells)) {
      gameOver();
    } else {
      for (let i = 0; i < notChangedCells.length; i++) {
        notChangedCells[i].innerHTML = beforeMove[i];
      }
    }
  }
});

document.addEventListener('click', function(e) {
  if (e.target.classList.contains('start')) {
    numberAdder();
    numberAdder();
    numberAdder();

    messageStart.hidden = true;

    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.innerHTML = 'Restart';
  }

  if (e.target.classList.contains('restart')) {
    restartGame();
  }
});

function addClassesToCells(array) {
  for (const index of array) {
    index.className = '';
    index.classList.add('field-cell');

    switch (index.innerHTML) {
      case '2': index.classList.add('field-cell--2'); break;
      case '4': index.classList.add('field-cell--4'); break;
      case '8': index.classList.add('field-cell--8'); break;
      case '16': index.classList.add('field-cell--16'); break;
      case '32': index.classList.add('field-cell--32'); break;
      case '64': index.classList.add('field-cell--64'); break;
      case '128': index.classList.add('field-cell--128'); break;
      case '256': index.classList.add('field-cell--256'); break;
      case '512': index.classList.add('field-cell--512'); break;
      case '1024': index.classList.add('field-cell--1024'); break;
      case '2048': index.classList.add('field-cell--2048'); break;
    }
  }
}

'use strict';

const startButton = document.querySelector('.start');
const allCells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  eraseProgress();
  hideMessages();

  const cell1 = createCell();

  createCell(cell1);
});

document.addEventListener('keydown', (ev) => {
  const pressedLeft = ev.key === 'ArrowLeft';

  if (pressedLeft) {
    const roundPerformed = shiftTheCell(1, 0, 1, 'minus', 'stay-in-parent-row');
    const comboPerformed = createCombo(1, 0, 1, 'minus', 'stay-in-parent-row');

    removeActiveCombo();

    if (roundPerformed || comboPerformed) {
      createCell();
    }

    checkIfGameOver();
  }
});

document.addEventListener('keydown', (ev) => {
  const pressedRight = ev.key === 'ArrowRight';

  if (pressedRight) {
    const roundPerformed = shiftTheCell(0, 1, 1, 'add', 'stay-in-parent-row');
    const comboPerformed = createCombo(0, 1, 1, 'add', 'stay-in-parent-row');

    removeActiveCombo();

    if (roundPerformed || comboPerformed) {
      createCell();
    }

    checkIfGameOver();
  }
});

document.addEventListener('keydown', (ev) => {
  const pressedUp = ev.key === 'ArrowUp';

  if (pressedUp) {
    const roundPerformed = shiftTheCell(4, 0, 4, 'minus');
    const comboPerformed = createCombo(4, 0, 4, 'minus');

    removeActiveCombo();

    if (roundPerformed || comboPerformed) {
      createCell();
    }

    checkIfGameOver();
  }
});

document.addEventListener('keydown', (ev) => {
  const pressedUp = ev.key === 'ArrowDown';

  if (pressedUp) {
    const roundPerformed = shiftTheCell(0, 4, 4, 'add');
    const comboPerformed = createCombo(0, 4, 4, 'add');

    removeActiveCombo();

    if (roundPerformed || comboPerformed) {
      createCell();
    }

    checkIfGameOver();
  }
});

function getRandomNum(max) {
  return Math.floor(Math.random() * max);
};

function drop2or4() {
  const randomNumbers = [2, 2, 2, 2, 2, 4, 2, 2, 2, 2];

  const randomIndex = getRandomNum(randomNumbers.length);

  return randomNumbers[randomIndex];
};

function createCell(firstCell) {
  const availableCells = [...allCells].filter(cell => !cell.textContent);
  const randomCell = getRandomNum(availableCells.length);

  if (firstCell === randomCell) {
    return createCell(firstCell);
  }

  const randomNumber = drop2or4();
  const newCell = availableCells[randomCell];

  newCell.textContent = randomNumber;
  newCell.classList.add(`field-cell--${randomNumber}`);

  newCell.style = `transform: scale(80%); transition: 0.1s`;

  setTimeout(() => {
    newCell.style = '';
  }, 100);
};

function hideMessages() {
  messageStart.classList.add('hidden');
  messageStart.setAttribute('active', '');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
}

function shiftTheCell(startValue, endValue, distance, option, rowExtra) {
  for (let i = startValue; i < allCells.length - endValue; i++) {
    const thisCell = allCells[i];
    const thisCellFull = allCells[i].hasChildNodes();

    let targetCell;
    let targetCellEmpty;
    let stayInParentRow;

    if (option === 'add') {
      targetCell = allCells[i + distance];
      targetCellEmpty = !allCells[i + distance].hasChildNodes();
    }

    if (option === 'minus') {
      targetCell = allCells[i - distance];
      targetCellEmpty = !allCells[i - distance].hasChildNodes();
    }

    if (rowExtra) {
      stayInParentRow = targetCell.parentElement === thisCell.parentElement;
    } else {
      stayInParentRow = true;
    }

    if (thisCellFull && targetCellEmpty && stayInParentRow) {
      transformCell(targetCell, thisCell);
      removeExtra(thisCell);
      thisCell.classList.add('changed');

      return shiftTheCell(startValue, endValue, distance, option, rowExtra);
    }
  }

  return checkIfShifted();
};

function removeExtra(element) {
  element.classList.remove(`field-cell--${element.textContent}`);
  element.textContent = '';
}

function transformCell(toElement, fromElement) {
  toElement.className = fromElement.className;
  toElement.textContent = fromElement.textContent;
}

function checkIfShifted() {
  const changedCells = document.querySelectorAll('.changed');

  if (changedCells.length) {
    [...changedCells].map(cell => cell.classList.remove('changed'));

    launchRestartButton();

    return true;
  }
}

function createCombo(startValue, endValue, distance, option, rowExtra) {
  let comboCreated = false;
  let stayInParentRow;

  for (let i = startValue; i < allCells.length - endValue; i++) {
    const thisCell = allCells[i];
    let targetCell = allCells[i - distance];

    if (option === 'add') {
      targetCell = allCells[i + distance];
    }

    if (rowExtra) {
      stayInParentRow = targetCell.parentElement === thisCell.parentElement;
    } else {
      stayInParentRow = true;
    }

    if (thisCell.textContent
      && thisCell.textContent === targetCell.textContent
      && !thisCell.classList.contains('active-combo')
      && stayInParentRow) {
      targetCell.classList.remove(`field-cell--${targetCell.textContent}`);
      targetCell.textContent *= 2;

      targetCell.classList.add(`field-cell--${targetCell.textContent}`,
        'active-combo');

      targetCell.style = ' background-color: #deeaee';

      setTimeout(() => {
        targetCell.style = '';
      }, 100);

      removeExtra(thisCell);
      updateScore(targetCell);
      launchRestartButton();
      checkIfWin();

      comboCreated = true;
    }
  }

  return comboCreated;
};

function removeActiveCombo() {
  const activeCombos = document.querySelectorAll('.active-combo');

  if (activeCombos.length) {
    [...activeCombos].map(cell => cell.classList.remove('active-combo'));
  }
};

function updateScore(winCombo) {
  score.textContent = +score.textContent + +winCombo.textContent;
}

function launchRestartButton() {
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
};

function eraseProgress() {
  [...allCells].map(cell => {
    removeExtra(cell);
  });

  score.textContent = 0;
};

function checkIfWin() {
  if ([...allCells].some(cell => cell.textContent === '2048')) {
    messageWin.classList.remove('hidden');
  }
}

function checkVerticalCombo() {
  for (let i = 4; i < allCells.length; i++) {
    if (allCells[i].textContent
      && allCells[i].textContent === allCells[i - 4].textContent) {
      return true;
    }
  }

  return false;
};

function checkHorizontalCombo() {
  return [...allCells].some(cell =>
    cell.textContent && cell.nextElementSibling && cell.textContent
    === cell.nextElementSibling.textContent);
}

function checkIfGameOver() {
  const allCellsAreFull = [...allCells].every(cell => cell.textContent);
  const horizontalCombo = checkHorizontalCombo();
  const verticalCombo = checkVerticalCombo();

  if (allCellsAreFull && !horizontalCombo && !verticalCombo) {
    messageLose.classList.remove('hidden');
  }
}

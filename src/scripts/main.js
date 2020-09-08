'use strict';

const tbody = document.querySelector('tbody');
let allCell = tbody.querySelectorAll('td');
const startGame = document.querySelector('.start');
const blockScore = document.querySelector('.game-score');
const youWin = document.querySelector('.message-win');
const youLose = document.querySelector('.message-lose');
const messStart = document.querySelector('.message-start');
let score = 0;
const width = 4;
let allEmptyCell = [...allCell].filter(item => item.classList.length < 2);
let randomCell = 0;
let countEmptyCell = 0;
let oldArray = [];

function generateRandomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);

  if (max === 1) {
    return 0;
  }

  return Math.round(rand);
}

function generateNumInCell() {
  const newDiv = document.createElement('div');

  allCell = tbody.querySelectorAll('td');
  allEmptyCell = [...allCell].filter(item => item.classList.length < 2);

  if (youLoseNow() && allEmptyCell.length === 0) {
    youLose.classList.remove('hidden');
  }

  if (countEmptyCell) {
    return;
  }

  randomCell = generateRandomInteger(0, allEmptyCell.length - 1);
  newDiv.textContent = Math.random() >= 0.1 ? 2 : 4;

  allEmptyCell[randomCell].append(newDiv);

  if (newDiv.textContent === '4') {
    allEmptyCell[randomCell].classList.add('field-cell--4');
  } else {
    allEmptyCell[randomCell].classList.add('field-cell--2');
  }

  allCell = tbody.querySelectorAll('td');
  oldArray = [];
  allCell.forEach(item => oldArray.push(item.innerText));
};

function combineRowRight() {
  for (let i = tbody.children.length - 1; i >= 0; i--) {
    const row = tbody.children[i].children;

    for (let j = row.length - 1; j >= 0; j--) {
      if (row[j - 1] === undefined) {
        break;
      }

      if (row[j].innerText === row[j - 1].innerText
        && row[j].innerText !== '') {
        const totalValue = parseInt(row[j].innerText)
        + parseInt(row[j - 1].innerText);

        score += totalValue;

        blockScore.innerText = score;

        isYouWin();

        row[j].innerText = totalValue;
        row[j].className = 'field-cell';
        row[j - 1].innerText = '';
        row[j - 1].className = 'field-cell';
      } else {
        continue;
      }
    }
  }
}

function combineRowLeft() {
  for (let i = 0; i < tbody.children.length; i++) {
    const row = tbody.children[i].children;

    for (let j = 0; j <= row.length; j++) {
      if (row[j + 1] === undefined) {
        break;
      }

      if (row[j].innerText === row[j + 1].innerText
        && row[j].innerText !== '') {
        const totalValue = parseInt(row[j].innerText)
        + parseInt(row[j + 1].innerText);

        score += totalValue;

        blockScore.innerText = score;

        isYouWin();

        row[j].innerText = totalValue;
        row[j].className = 'field-cell';
        row[j + 1].innerText = '';
        row[j + 1].className = 'field-cell';
      } else {
        continue;
      }
    }
  }
}

function combineColumnUp() {
  for (let i = 0; i < allCell.length - 4; i++) {
    if (allCell[i].innerText === allCell[i + width].innerText
      && allCell[i].innerText !== '') {
      const totalValue = parseInt(allCell[i].innerText)
      + parseInt(allCell[i + width].innerText);

      score += totalValue;

      blockScore.innerText = score;

      isYouWin();

      allCell[i].innerText = totalValue;
      allCell[i].className = 'field-cell';
      allCell[i + width].innerText = '';
      allCell[i + width].className = 'field-cell';
    } else {
      continue;
    }
  }
}

function combineColumnDown() {
  for (let i = allCell.length - 1; i > 3; i--) {
    if (allCell[i].innerText === allCell[i - width].innerText
      && allCell[i].innerText !== '') {
      const totalValue = parseInt(allCell[i].innerText)
      + parseInt(allCell[i - width].innerText);

      score += totalValue;

      blockScore.innerText = score;

      isYouWin();

      allCell[i].innerText = totalValue;
      allCell[i].className = 'field-cell';
      allCell[i - width].innerText = '';
      allCell[i - width].className = 'field-cell';
    } else {
      continue;
    }
  }
}

function clickArrowRight() {
  for (let i = 0; i < allCell.length; i++) {
    if (i % 4 === 0) {
      const totalOne = allCell[i].innerText;
      const totalTwo = allCell[i + 1].innerText;
      const totalThree = allCell[i + 2].innerText;
      const totalFour = allCell[i + 3].innerText;

      const Row = [totalOne, totalTwo, totalThree, totalFour];

      const filteredRow = Row.filter(item => item);
      const missing = width - filteredRow.length;
      const empty = new Array(missing).fill('');

      const newRow = empty.concat(filteredRow);

      allCell[i].innerText = newRow[0];
      allCell[i + 1].innerText = newRow[1];
      allCell[i + 2].innerText = newRow[2];
      allCell[i + 3].innerText = newRow[3];
    }
  }
  addOrRemoveClass();
}

function clickArrowLeft() {
  for (let i = 0; i < allCell.length; i++) {
    if (i % 4 === 0) {
      const totalOne = allCell[i].innerText;
      const totalTwo = allCell[i + 1].innerText;
      const totalThree = allCell[i + 2].innerText;
      const totalFour = allCell[i + 3].innerText;

      const Row = [parseInt(totalOne), parseInt(totalTwo),
        parseInt(totalThree), parseInt(totalFour)];

      const filteredRow = Row.filter(item => item);
      const missing = 4 - filteredRow.length;
      const empty = new Array(missing).fill('');

      const newRow = filteredRow.concat(empty);

      allCell[i].innerText = newRow[0];
      allCell[i + 1].innerText = newRow[1];
      allCell[i + 2].innerText = newRow[2];
      allCell[i + 3].innerText = newRow[3];
    }
  }
  addOrRemoveClass();
}

function clickArrowUp() {
  for (let i = 0; i < 4; i++) {
    const totalOne = allCell[i].innerText;
    const totalTwo = allCell[i + width].innerText;
    const totalThree = allCell[i + (width * 2)].innerText;
    const totalFour = allCell[i + (width * 3)].innerText;

    const column = [parseInt(totalOne), parseInt(totalTwo),
      parseInt(totalThree), parseInt(totalFour)];

    const filteredColumn = column.filter(item => item);
    const missingColumn = width - filteredColumn.length;
    const createEmptyCell = new Array(missingColumn).fill('');

    const newColumn = filteredColumn.concat(createEmptyCell);

    allCell[i].innerText = newColumn[0];
    allCell[i + width].innerText = newColumn[1];
    allCell[i + (width * 2)].innerText = newColumn[2];
    allCell[i + (width * 3)].innerText = newColumn[3];
  }

  addOrRemoveClass();
}

function clickArrowDown() {
  for (let i = 0; i < 4; i++) {
    const totalOne = allCell[i].innerText;
    const totalTwo = allCell[i + width].innerText;
    const totalThree = allCell[i + (width * 2)].innerText;
    const totalFour = allCell[i + (width * 3)].innerText;

    const column = [parseInt(totalOne), parseInt(totalTwo),
      parseInt(totalThree), parseInt(totalFour)];

    const filteredColumn = column.filter(item => item);
    const missingColumn = width - filteredColumn.length;
    const createEmptyCell = new Array(missingColumn).fill('');

    const newColumn = createEmptyCell.concat(filteredColumn);

    allCell[i].innerText = newColumn[0];
    allCell[i + width].innerText = newColumn[1];
    allCell[i + (width * 2)].innerText = newColumn[2];
    allCell[i + (width * 3)].innerText = newColumn[3];
  }
  addOrRemoveClass();
}

function addOrRemoveClass() {
  for (let k = 0; k < allCell.length; k++) {
    allCell[k].className = 'field-cell';

    switch (allCell[k].innerText) {
      case '':
        allCell[k].className = 'field-cell';
        break;
      case '2':
        allCell[k].classList.add('field-cell--2');
        break;
      case '4':
        allCell[k].classList.add('field-cell--4');
        break;
      case '8':
        allCell[k].classList.add('field-cell--8');
        break;
      case '16':
        allCell[k].classList.add('field-cell--16');
        break;
      case '32':
        allCell[k].classList.add('field-cell--32');
        break;
      case '64':
        allCell[k].classList.add('field-cell--64');
        break;
      case '128':
        allCell[k].classList.add('field-cell--128');
        break;
      case '256':
        allCell[k].classList.add('field-cell--256');
        break;
      case '512':
        allCell[k].classList.add('field-cell--512');
        break;
      case '1024':
        allCell[k].classList.add('field-cell--1024');
        break;
      case '2048':
        allCell[k].classList.add('field-cell--2048');
        break;
    }
  }
}

startGame.addEventListener('click', () => {
  messStart.setAttribute('hidden', 'hidden');
  startGame.innerText = 'Restart';
  startGame.classList.remove('start');
  startGame.classList.add('restart');
  youLose.classList.add('hidden');
  youWin.classList.add('hidden');

  score = 0;
  blockScore.innerText = score;

  cleanTable();

  countEmptyCell = false;
  generateNumInCell();
  generateNumInCell();
});

function lookChanged() {
  for (let t = 0; t < oldArray.length; t++) {
    if (oldArray[t] === allCell[t].innerText) {
      continue;
    } else {
      return false;
    }
  }

  return true;
}

function cleanTable() {
  allCell = [...allCell].map(item => {
    item.innerText = '';
    item.className = 'field-cell';
  });
}

function youLoseNow() {
  for (let i = 0; i <= tbody.children.length - 1;) {
    const row = tbody.children[i].children;

    for (let j = 0; j <= row.length - 1;) {
      if (tbody.children[i + 1] === undefined) {
        if (row[j].innerText === row[j + 1].innerText) {
          return false;
        }
      }

      if (i === 3) {
        if (row[j].innerText === row[j + 1].innerText
          || row[j + 1].innerText === row[j + 2].innerText
          || row[j + 2].innerText === row[j + 3].innerText) {
          return false;
        }

        return true;
      }

      if (j === 3) {
        if (row[j].innerText === tbody.children[i + 1].children[j].innerText
          || row[j].innerText === tbody.children[i + 1].children[j].innerText) {
          return false;
        }
        j++;
        continue;
      }

      if (row[j].innerText === row[j + 1].innerText
        || row[j].innerText === tbody.children[i + 1].children[j].innerText) {
        return false;
      }

      j++;
    }
    i++;
  }

  return true;
}

function isYouWin() {
  for (let k = 0; k < allCell.length; k++) {
    if (+allCell[k].innerText >= 2048) {
      youWin.classList.remove('hidden');
    }
  }
}

document.addEventListener('keydown', (event) => {
  const eventCode = event.code;

  switch (eventCode) {
    case 'ArrowRight':
      keyRight();
      break;
    case 'ArrowLeft':
      keyLeft();
      break;
    case 'ArrowUp':
      keyUp();
      break;
    case 'ArrowDown':
      keyDown();
      break;
  }
});

function keyRight() {
  clickArrowRight();
  combineRowRight();
  clickArrowRight();
  countEmptyCell = lookChanged();
  generateNumInCell();
}

function keyLeft() {
  clickArrowLeft();
  combineRowLeft();
  clickArrowLeft();
  countEmptyCell = lookChanged();
  generateNumInCell();
}

function keyUp() {
  clickArrowUp();
  combineColumnUp();
  clickArrowUp();
  countEmptyCell = lookChanged();
  generateNumInCell();
}

function keyDown() {
  clickArrowDown();
  combineColumnDown();
  clickArrowDown();
  countEmptyCell = lookChanged();
  generateNumInCell();
}

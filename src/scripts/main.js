'use strict';

const startButton = document.querySelector('.start');
const fieldCellList = document.querySelectorAll('.field-cell');
const fieldRowList = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
// const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const handleStartButton = () => {
  startButton.classList.toggle('restart');
  createNewCell();
  createNewCell();
  colorField();

  startButton.textContent = startButton.classList.contains('restart')
    ? 'Restart' : 'Start';

  if (startButton.classList.contains('restart')) {
    fieldCellAdder();
  } else {
    for (const item of fieldCellList) {
      item.className = 'field-cell';
      item.textContent = '';
    }
  }

  if (startButton.textContent === 'Start') {
    gameScore.textContent = 0;
  }
};

function startTheGame() {
  startButton.addEventListener('click', handleStartButton);
}

function loseGame() {
  if ([...fieldCellList].every(cell => cell.textContent !== '') === false) {
    return false;
  }

  for (let rowI = 0; rowI < 3; rowI++) {
    const curentRow = fieldRowList[rowI];

    // eslint-disable-next-line max-len
    if (curentRow.children[0].textContent === fieldRowList[rowI + 1].children[0].textContent) {
      return false;
    }

    for (let colI = 0; colI < 3; colI++) {
      // eslint-disable-next-line max-len
      if (+curentRow.children[colI].textContent === +curentRow.children[colI + 1].textContent) {
        return false;
      }
    }
  }

  for (let colIndex = 0; colIndex < 3; colIndex++) {
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const curentEle = fieldRowList[colIndex].children[rowIndex];

      // eslint-disable-next-line max-len
      if (+curentEle.textContent === +fieldRowList[colIndex].children[rowIndex + 1].textContent) {
        return false;
      }
    }
  }

  messageStart.classList.add('hidden');
  messageLose.classList.remove('hidden');
  startButton.removeEventListener('click', handleStartButton);
  startButton.addEventListener('click', handleStartButton);

  return true;
};

function emptyFieldNumber() {
  let index;

  const loseTheGame = loseGame();

  if (loseTheGame === false) {
    do {
      index = Math.floor(Math.random() * 16);
    } while (fieldCellList[index].textContent.length !== 0);

    messageLose.classList.add('hidden');
    messageStart.classList.remove('hidden');

    return index;
  }
};

const handleKeyDown = (e) => {
  const key = e.key;

  if (startButton.textContent === 'Start'
    || messageStart.classList.contains('hidden')) {
    return;
  }

  switch (key) {
    case 'ArrowLeft':
      // Left pressed
      ArrowLeft();
      break;
    case 'ArrowRight':
      // Right pressed
      ArrowRight();
      break;
    case 'ArrowUp':
      // Up pressed
      ArrowUp();
      break;
    case 'ArrowDown':
      // Down pressed
      ArrowDown();
      break;
    default:
      break;
  }

  createNewCell();
  colorField();
};

function fieldCellAdder() {
  document.body.addEventListener('keydown', handleKeyDown);
}

function ArrowLeft() {
  for (let i = 0; i < 4; i++) {
    const currentRow = fieldRowList[i];
    const resultArray = [];

    [...currentRow.children].map((child) => {
      if (child.textContent.length !== 0) {
        resultArray.push(+child.textContent);
        child.textContent = '';
      }
    });

    for (let x = 0; x < resultArray.length - 1; x++) {
      if (resultArray[x] === resultArray[x + 1]) {
        resultArray[x] = resultArray[x] * 2;
        gameScore.textContent = +gameScore.textContent + resultArray[x];

        resultArray.splice((x + 1), 1);
        x = 0;
      }
    };

    for (let index = 0; index < resultArray.length; index++) {
      currentRow.children[index].textContent = resultArray[index];
    }
  }

  return +gameScore.textContent;
}

function ArrowRight() {
  for (let i = 0; i < 4; i++) {
    const currentRow = fieldRowList[i];
    const resultArray = [];

    [...currentRow.children].map((child) => {
      if (child.textContent.length !== 0) {
        resultArray.push(+child.textContent);
        child.textContent = '';
      }
    });

    for (let x = resultArray.length - 1; x >= 0; x--) {
      if (resultArray[x] === resultArray[x - 1]) {
        resultArray[x] = resultArray[x] * 2;
        gameScore.textContent = +gameScore.textContent + resultArray[x];

        resultArray.splice((x - 1), 1);
        x = 0;
      }
    };

    let indexField = 3;

    for (let index = resultArray.length - 1; index >= 0; index--) {
      currentRow.children[indexField].textContent = resultArray[index];
      indexField = indexField - 1;
    }
  }

  return +gameScore.textContent;
}

function ArrowUp() {
  for (let i = 0; i < 4; i++) {
    const resultArray = [];

    for (let y = 0; y < 4; y++) {
      const currentChild = fieldRowList[y].children[i];

      if (currentChild.textContent.length !== 0) {
        resultArray.push(+currentChild.textContent);
        currentChild.textContent = '';
      }
    };

    for (let x = resultArray.length - 1; x >= 0; x--) {
      if (resultArray[x] === resultArray[x - 1]) {
        resultArray[x] = resultArray[x] * 2;
        gameScore.textContent = +gameScore.textContent + resultArray[x];

        resultArray.splice((x - 1), 1);
        x = 0;
      }
    };

    for (let index = 0; index < resultArray.length; index++) {
      fieldRowList[index].children[i].textContent = resultArray[index];
    }
  }

  return +gameScore.textContent;
}

function ArrowDown() {
  for (let i = 0; i < 4; i++) {
    const resultArray = [];

    for (let y = 0; y < 4; y++) {
      const currentChild = fieldRowList[y].children[i];

      if (currentChild.textContent.length !== 0) {
        resultArray.push(+currentChild.textContent);

        currentChild.textContent = '';
      }
    };

    for (let x = resultArray.length - 1; x >= 0; x--) {
      if (resultArray[x] === resultArray[x - 1]) {
        resultArray[x] = resultArray[x] * 2;
        gameScore.textContent = +gameScore.textContent + resultArray[x];

        resultArray.splice((x - 1), 1);
        x = 0;
      }
    };

    let indexField = resultArray.length - 1;

    for (let index = 3; index >= 0; index--) {
      fieldRowList[index].children[i].textContent = resultArray[indexField];
      indexField = indexField - 1;
    }
  }

  // if ([...fieldCellList].some(cell => cell.textContent === '') === false) {
  //   console.log([...fieldCellList].some(cell => cell.textContent === ''));
  //   // debugger;
  //   loseGame();
  // }

  if ([...fieldCellList].every(cell => cell.textContent !== '') === true) {
    loseGame();

    if (messageStart.classList.contains('hidden')) {
      return;
    }
  }

  return +gameScore.textContent;
}

function colorField() {
  for (const fieldCell of fieldCellList) {
    const textCon = fieldCell.textContent;

    fieldCell.className = fieldCell.textContent > 0
      ? `field-cell field-cell--${textCon}`
      : 'field-cell field-cell--else';
  }
}

function createNewCell() {
  const emptyCell = emptyFieldNumber();

  if (emptyCell) {
    fieldCellList[emptyCell].classList.add = 'field-cell--2';
    fieldCellList[emptyCell].textContent = '2';
  }
}

startTheGame();

// if (startButton.classList.contains('restart')) {
//   startTheGame();
// }

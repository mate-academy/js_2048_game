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

  for (let rowI = 0; rowI < 4; rowI++) {
    const curentRow = fieldRowList[rowI];

    for (let colI = 0; colI < 3; colI++) {
      // eslint-disable-next-line max-len
      if (+curentRow.children[colI].textContent === +curentRow.children[colI + 1].textContent) {
        return false;
      }
    }
  }

  for (let rowI = 0; rowI < 3; rowI++) {
    for (let colI = 0; colI < 4; colI++) {
      const curentEle = fieldRowList[rowI].children[colI];

      // eslint-disable-next-line max-len
      if (+curentEle.textContent === +fieldRowList[rowI + 1].children[colI].textContent) {
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

  if ([...fieldCellList].some(cell => cell.textContent === '') === true) {
    createNewCell();
    colorField();
  }
};

function fieldCellAdder() {
  document.body.addEventListener('keydown', handleKeyDown);
}

function ArrowLeft() {
  if ([...fieldCellList].every(cell => cell.textContent !== '') === true) {
    let isSameDigitsLeft = false;

    for (let rowI = 0; rowI < 4; rowI++) {
      const curentRow = fieldRowList[rowI];

      for (let colI = 0; colI < 3; colI++) {
        // eslint-disable-next-line max-len
        if (+curentRow.children[colI].textContent === +curentRow.children[colI + 1].textContent) {
          isSameDigitsLeft = true;
        }
      }
    }

    if (isSameDigitsLeft === false) {
      loseGame();

      return;
    }
  }

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
  if ([...fieldCellList].every(cell => cell.textContent !== '') === true) {
    let isSameDigitsLeft = false;

    for (let rowI = 0; rowI < 4; rowI++) {
      const curentRow = fieldRowList[rowI];

      for (let colI = 0; colI < 3; colI++) {
        // eslint-disable-next-line max-len
        if (+curentRow.children[colI].textContent === +curentRow.children[colI + 1].textContent) {
          isSameDigitsLeft = true;
          break;
        }
      }
    }

    if (isSameDigitsLeft === false) {
      loseGame();

      return;
    }
  }

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
  if ([...fieldCellList].every(cell => cell.textContent !== '') === true) {
    let isSameDigitsUp = false;

    for (let rowInd = 0; rowInd < 3; rowInd++) {
      for (let colInd = 0; colInd < 4; colInd++) {
        const curentEle = fieldRowList[rowInd].children[colInd];

        // eslint-disable-next-line max-len
        if (+curentEle.textContent === +fieldRowList[rowInd + 1].children[colInd].textContent) {
          isSameDigitsUp = true;
          break;
        }
      }
    }

    if (isSameDigitsUp === false) {
      loseGame();

      return;
    }
  }

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
  if ([...fieldCellList].every(cell => cell.textContent !== '') === true) {
    let isSameDigitsUp = false;

    for (let colIndex = 0; colIndex < 3; colIndex++) {
      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        const curentEle = fieldRowList[colIndex].children[rowIndex];

        // eslint-disable-next-line max-len
        if (+curentEle.textContent === +fieldRowList[colIndex + 1].children[rowIndex].textContent) {
          isSameDigitsUp = true;
        }
      }
    }

    if (isSameDigitsUp === false) {
      loseGame();

      return;
    }
  }

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
  const emptyCellNum = emptyFieldNumber();

  if (emptyCellNum >= 0) {
    fieldCellList[emptyCellNum].classList.add = 'field-cell--2';
    fieldCellList[emptyCellNum].textContent = '2';
  }
}

startTheGame();

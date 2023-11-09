'use strict';

// write your code here

const field = document.querySelectorAll('.field-cell');
const tableRows = document.querySelectorAll('tr');
const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const fieldArrayLength = Array.from(field).filter(number =>
  number.textContent).length;

function numGenerator(max) {
  return Math.floor(Math.random() * max);
}

function startNumGenerator() {
  let startNum = 2;
  const isItAFour = numGenerator(10);

  if (isItAFour === 4) {
    startNum = 4;
  }

  return startNum;
}

function success() {
  messageWin.classList.remove('hidden');
  document.removeEventListener('keydown', gameMoves);
}

function moveCheck() {
  if (!YAxisAdd('up')
  && !YAxisAdd('down')
  && !XAxisAdd()
  && !XAxisAdd('reverse')
  && Array.from(field).filter(number =>
    number.textContent).length === 16) {
    messageLose.classList.remove('hidden');
  }
}

function addNumber() {
  if (Array.from(field).filter(number => number.textContent).length < 16) {
    const squareForNewNm = numGenerator(16);

    if (!field[squareForNewNm].textContent) {
      field[squareForNewNm].textContent = startNumGenerator();
    } else {
      addNumber();
    }
  };
}

startButton.addEventListener('click', (evt) => {
  document.addEventListener('keydown', gameMoves);
  score.textContent = 0;
  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
  startButton.classList.remove('start');

  field.forEach(clearSquare => {
    clearSquare.textContent = '';
  });

  addNumber();
  addNumber();
  assignColours();
}
);

function YAxisnCheck(direction) {
  for (let i = 0; i < 3; i++) {
    let fieldToCheck = Array.from(field);

    if (direction === 'up') {
      fieldToCheck = fieldToCheck.slice(4).reverse();
    }

    if (direction === 'down') {
      fieldToCheck = fieldToCheck.slice(0, -4);
    };

    const reverseIndex = fieldToCheck.map((item, index) => index).reverse();

    fieldToCheck.forEach((item, index) => {
      const inPutIndex = direction === 'up' ? reverseIndex[index] : index + 4;

      if (field[inPutIndex].textContent === '') {
        field[inPutIndex].textContent = item.textContent;
        item.textContent = '';
      }
    });
  }
};

function clearNBSP() {
  const fieldToCheck = Array.from(field);

  fieldToCheck.forEach(item => {
    item.textContent = item.textContent.replace(/\s/g, '');
  });
}

function YAxisAdd(direction) {
  let fieldToCheck = Array.from(field);

  if (direction === 'down') {
    fieldToCheck = fieldToCheck.slice(4).reverse();
  }

  if (direction === 'up') {
    fieldToCheck = fieldToCheck.slice(0, -4);
  };

  const reverseIndex = fieldToCheck.map((item, index) => index).reverse();

  fieldToCheck.forEach((item, index) => {
    const inPutIndex = direction === 'up' ? reverseIndex[index] : index + 4;

    const downCheck = direction === 'down'
    && field[inPutIndex].textContent === field[index].textContent
    && field[inPutIndex].textContent !== '';

    const upCheck = direction === 'up'
    && field[inPutIndex].textContent === field[inPutIndex + 4].textContent
    && field[inPutIndex].textContent !== '';

    if (downCheck) {
      const newNum = Number(2 * field[index].textContent);

      score.textContent = Number(score.textContent) + newNum;
      field[inPutIndex].textContent = newNum + '\u00A0';
      field[index].textContent = '';

      if (newNum === 2048) {
        success();
      }
    }

    if (upCheck) {
      const newNum = Number(2 * field[inPutIndex].textContent);

      score.textContent = Number(score.textContent) + newNum;
      field[inPutIndex].textContent = newNum + '\u00A0';
      field[inPutIndex + 4].textContent = '';

      if (newNum === 2048) {
        success();
      }
    }

    if (!upCheck && !downCheck && fieldArrayLength === 16) {
      return false;
    }
  });
  clearNBSP();
};

function leftRightMove(reverse) {
  for (let i = 0; i < 3; i++) {
    tableRows.forEach(item => {
      let oddNums = ([...item.childNodes].filter((quarter, index) => {
        if (index % 2 !== 0) {
          return quarter;
        }
      }));

      if (reverse) {
        oddNums = oddNums.reverse();
      };

      oddNums.forEach((square, index) => {
        if (index <= 2 && oddNums[index + 1].textContent === '') {
          oddNums[index + 1].textContent = square.textContent;
          square.textContent = '';
        }
      });
    });
  }
}

function XAxisAdd(reverse) {
  tableRows.forEach(item => {
    let oddNums = ([...item.childNodes].filter((quarter, index) => {
      if (index % 2 !== 0) {
        return quarter;
      }
    }));

    if (reverse) {
      oddNums = oddNums.reverse();
    };

    oddNums.forEach((square, index) => {
      const sideCheck = index <= 2 && oddNums[index].textContent
      === oddNums[index + 1].textContent
      && oddNums[index].textContent !== '';

      if (sideCheck) {
        const newNum = Number(2 * oddNums[index + 1].textContent);

        score.textContent = Number(score.textContent) + newNum;
        oddNums[index + 1].textContent = newNum;
        oddNums[index].textContent = '';

        if (newNum === 2048) {
          success();
        }
      }

      if (!sideCheck && fieldArrayLength === 16) {
        return false;
      }
    });
  });
};

function assignColours() {
  Array.from(field).forEach(squareToColour => {
    squareToColour.className
    = `field-cell field-cell--${squareToColour.textContent}`;
  });
}

const gameMoves = (evt) => {
  if (evt.key === 'ArrowDown') {
    YAxisnCheck('down');
    YAxisAdd('up');
    YAxisnCheck('down');
    moveCheck();
  }

  if (evt.key === 'ArrowUp') {
    YAxisnCheck('up');
    YAxisAdd('down');
    YAxisnCheck('up');
    moveCheck();
  }

  if (evt.key === 'ArrowLeft') {
    leftRightMove('reverse');
    XAxisAdd();
    leftRightMove('reverse');
    moveCheck();
  }

  if (evt.key === 'ArrowRight') {
    leftRightMove();
    XAxisAdd('reverse');
    leftRightMove();
    moveCheck();
  };

  if (evt.key === ' ') {
    evt.preventDefault();
  }
  assignColours();
};

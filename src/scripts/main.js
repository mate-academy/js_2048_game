'use strict';

// write your code here

const field = document.querySelectorAll('.field-cell');
const tableRows = document.querySelectorAll('tr');
const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

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
  const fieldArray = Array.from(field);

  const checkY = fieldArray.some((item, index) =>
    index < 12 && item.textContent === fieldArray[index + 4].textContent);
  const checkX = fieldArray.some((item, index) =>
    index % 4 !== 3 && item.textContent
    === fieldArray[index + 1].textContent);

  if (!checkY && !checkX) {
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
  }
};

startButton.addEventListener('click', (evt) => {
  document.addEventListener('keydown', gameMoves);
  score.textContent = 0;
  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
  startButton.classList.remove('start');

  if (startButton.textContent === 'Restart') {
    messageLose.classList.add('hidden');
  }

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

    if (direction === 'down'
      && field[inPutIndex].textContent === field[index].textContent
      && field[inPutIndex].textContent !== '') {
      const newNum = Number(2 * field[index].textContent);

      score.textContent = Number(score.textContent) + newNum;
      field[inPutIndex].textContent = newNum + '\u00A0';
      field[index].textContent = '';
    }

    if (direction === 'up'
    && field[inPutIndex].textContent === field[inPutIndex + 4].textContent
    && field[inPutIndex].textContent !== '') {
      const newNum = Number(2 * field[inPutIndex].textContent);

      score.textContent = Number(score.textContent) + newNum;
      field[inPutIndex].textContent = newNum + '\u00A0';
      field[inPutIndex + 4].textContent = '';

      if (newNum === 2048) {
        success();
      }
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
      if (index <= 2 && oddNums[index].textContent
        === oddNums[index + 1].textContent
        && oddNums[index].textContent !== '') {
        const newNum = Number(2 * oddNums[index + 1].textContent);

        score.textContent = Number(score.textContent) + newNum;
        oddNums[index + 1].textContent = newNum;
        oddNums[index].textContent = '';

        if (newNum === 2048) {
          success();
        }
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
  const previousArray = Array.from(field).map(item => {
    return item.textContent ? item.textContent : '1';
  });

  function newGrid() {
    const newArray = Array.from(field).map(item => {
      return item.textContent ? item.textContent : '1';
    });

    return newArray;
  }

  function changeCheck(newtable) {
    const matching = JSON.stringify(newtable) === JSON.stringify(previousArray);

    if (!matching) {
      addNumber();
      assignColours();
    } else {
      moveCheck();
    }
  }

  if (evt.key === 'ArrowDown') {
    YAxisnCheck('down');
    YAxisAdd('up');
    YAxisnCheck('down');
    changeCheck(newGrid());
  }

  if (evt.key === 'ArrowUp') {
    YAxisnCheck('up');
    YAxisAdd('down');
    YAxisnCheck('up');
    changeCheck(newGrid());
  }

  if (evt.key === 'ArrowLeft') {
    leftRightMove('reverse');
    XAxisAdd();
    leftRightMove('reverse');
    changeCheck(newGrid());
  }

  if (evt.key === 'ArrowRight') {
    leftRightMove();
    XAxisAdd('reverse');
    leftRightMove();
    changeCheck(newGrid());
  };

  if (evt.key === ' ') {
    evt.preventDefault();
  }
};

'use strict';

// write your code here

const field = document.querySelectorAll('.field-cell');
const tableRows = document.querySelectorAll('tr');

function numGenerator(max) {
  return Math.floor(Math.random() * max);
}

function startPosition() {
  const newNumber = numGenerator(16);

  const fieldToCheck = field;

  if (fieldToCheck[newNumber].textContent !== '') {
    startPosition();
  };

  return newNumber;
};

function startNumGenerator() {
  let startNum = 2;
  const isItAFour = numGenerator(10);

  if (isItAFour === 4) {
    startNum = 4;
  }

  return startNum;
}

function addNumber() {
  const squareForNewNm = startPosition();

  field[squareForNewNm].textContent = startNumGenerator();
}
addNumber();
addNumber();

function upDownCheck(direction, addOrCheck) {
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

      if (direction === 'down'
        && field[inPutIndex].textContent === field[index].textContent
        && field[inPutIndex].textContent !== '') {
        field[inPutIndex].textContent = 2 * field[index].textContent;
        field[index].textContent = '';
      }

      if (direction === 'up'
      && field[inPutIndex].textContent === field[inPutIndex + 4].textContent
      && field[inPutIndex].textContent !== '') {
        field[inPutIndex].textContent = 2 * field[inPutIndex].textContent;
        field[inPutIndex + 4].textContent = '';
      }
    });
  }
};

function leftRightHmm(reverse) {
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

        if (index <= 2 && oddNums[index].textContent
          === oddNums[index + 1].textContent
          && oddNums[index].textContent !== '') {
          oddNums[index + 1].textContent = 2 * oddNums[index + 1].textContent;
          oddNums[index].textContent = '';
        }
      });
    });
  }
}

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'ArrowDown') {
    upDownCheck('down');
  }

  if (evt.key === 'ArrowUp') {
    upDownCheck('up');
  }

  if (evt.key === 'ArrowLeft') {
    leftRightHmm('reverse');
  }

  if (evt.key === 'ArrowRight') {
    leftRightHmm();
  }

  if (evt.key === ' ') {
    addNumber();
  }
});

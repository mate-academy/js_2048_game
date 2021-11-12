'use strict';

const gameScore = document.querySelector('.game-score');

const button = document.querySelector('.button');

const tableBody = document.querySelector('tbody');

const tableBodyRows = tableBody.rows;

const tableBodyCells = tableBody.querySelectorAll('td');

const startMessage = document.querySelector('.message-start');

const winMessage = document.querySelector('.message-win');

const loseMessage = document.querySelector('.message-lose');

const fieldWidth = 4;

let shouldCreateNumber = false;

const buttonHandler = () => {
  if (button.classList.contains('restart')) {
    for (let i = 0; i < tableBodyCells.length; i++) {
      tableBodyCells[i].innerHTML = '';
      tableBodyCells[i].className = 'field-cell';
    };
    startMessage.hidden = true;
    winMessage.hidden = true;
    loseMessage.hidden = true;
    gameScore.innerHTML = 0;
    generateNumber();
    generateNumber();
    document.addEventListener('keydown', keyDownHandler);

    return;
  }

  button.classList.remove('start');
  button.innerHTML = 'Restart';
  button.classList.add('restart');
  startMessage.hidden = true;
  winMessage.hidden = true;
  loseMessage.hidden = true;
  gameScore.innerHTML = 0;
  generateNumber();
  generateNumber();
};

const generateNumber = function func() {
  const randomNumber = Math.random();

  const randomCell = Math.floor(randomNumber * tableBodyCells.length);

  if (randomNumber < 0.1 && !tableBodyCells[randomCell].innerHTML) {
    tableBodyCells[randomCell].innerHTML = 4;
    tableBodyCells[randomCell].classList.add('field-cell--4');
  } else if (randomNumber > 0.1 && !tableBodyCells[randomCell].innerHTML) {
    tableBodyCells[randomCell].innerHTML = 2;
    tableBodyCells[randomCell].classList.add('field-cell--2');
  } else {
    func();
  }
};

button.addEventListener('click', buttonHandler);

const moveRight = () => {
  for (let i = 0; i < tableBodyRows.length; i++) {
    const currentRow = tableBodyRows[i].cells;

    const cellsValues = [...currentRow].map(cell => +cell.innerHTML);

    const trueValues = cellsValues.filter(value => value);

    const falseValues = cellsValues.filter(value => !value);

    if (trueValues.length >= 1) {
      for (let j = trueValues.length - 1; j >= 0; j--) {
        if (trueValues[j] === trueValues[j + 1]) {
          trueValues[j + 1] = trueValues[j + 1] + trueValues[j];
          trueValues[j] = 0;

          gameScore.innerHTML = trueValues[j + 1] + +gameScore.innerHTML;

          if (+trueValues[j + 1] >= 2048) {
            winMessage.hidden = false;
          }
        }

        if (trueValues[j + 1] === 0) {
          trueValues[j + 1] = trueValues[j];
          trueValues[j] = 0;
        }
      }
    }

    const newRow = [...falseValues, ...trueValues];

    for (let k = 0; k < newRow.length; k++) {
      if (cellsValues[k] !== newRow[k]) {
        shouldCreateNumber = true;
      }

      if (newRow[k] === 0) {
        newRow[k] = '';
      }
      currentRow[k].innerHTML = newRow[k];
      currentRow[k].className = 'field-cell';

      if (currentRow[k].innerHTML) {
        currentRow[k].classList.add(`field-cell--${newRow[k]}`);
      }
    }
  }
};

const moveLeft = () => {
  for (let i = 0; i < tableBodyRows.length; i++) {
    const currentRow = tableBodyRows[i].cells;

    const cellsValues = [...currentRow].map(cell => +cell.innerHTML);

    const trueValues = cellsValues.filter(value => value);

    const falseValues = cellsValues.filter(value => !value);

    if (trueValues.length >= 1) {
      for (let j = 0; j < trueValues.length - 1; j++) {
        if (trueValues[j] === trueValues[j + 1]) {
          trueValues[j] = trueValues[j + 1] + trueValues[j];
          trueValues[j + 1] = 0;

          gameScore.innerHTML = trueValues[j] + +gameScore.innerHTML;

          if (+trueValues[j] >= 2048) {
            winMessage.hidden = false;
          }
        }

        if (trueValues[j] === 0) {
          trueValues[j] = trueValues[j + 1];
          trueValues[j + 1] = 0;
        }
      }
    }

    const newRow = [...trueValues, ...falseValues];

    for (let k = 0; k < newRow.length; k++) {
      if (cellsValues[k] !== newRow[k]) {
        shouldCreateNumber = true;
      }

      if (newRow[k] === 0) {
        newRow[k] = '';
      }
      currentRow[k].innerHTML = newRow[k];
      currentRow[k].className = 'field-cell';

      if (currentRow[k].innerHTML) {
        currentRow[k].classList.add(`field-cell--${newRow[k]}`);
      }
    }
  }
};

const moveUp = () => {
  for (let i = 0; i < fieldWidth; i++) {
    const column = [
      +tableBodyCells[i].innerHTML,
      +tableBodyCells[i + fieldWidth].innerHTML,
      +tableBodyCells[i + fieldWidth * 2].innerHTML,
      +tableBodyCells[i + fieldWidth * 3].innerHTML,
    ];

    const trueValues = column.filter(value => value);

    const falseValues = column.filter(value => !value);

    if (trueValues.length > 1) {
      for (let j = 0; j < trueValues.length - 1; j++) {
        if (trueValues[j] === trueValues[j + 1]) {
          trueValues[j] = trueValues[j + 1] + trueValues[j];
          trueValues[j + 1] = 0;

          gameScore.innerHTML = trueValues[j] + +gameScore.innerHTML;

          if (+trueValues[j] >= 2048) {
            winMessage.hidden = false;
          }
        }

        if (trueValues[j] === 0) {
          trueValues[j] = trueValues[j + 1];
          trueValues[j + 1] = 0;
        }
      }
    }

    const newColumn = [...trueValues, ...falseValues];

    for (let k = 0; k < newColumn.length; k++) {
      if (column[k] !== newColumn[k]) {
        shouldCreateNumber = true;
      }

      if (newColumn[k] === 0) {
        newColumn[k] = '';
      }
    }

    tableBodyCells[i].innerHTML = newColumn[0];
    tableBodyCells[i].className = `field-cell field-cell--${newColumn[0]}`;

    tableBodyCells[i + fieldWidth].innerHTML = newColumn[1];

    tableBodyCells[i + fieldWidth]
      .className = `field-cell field-cell--${newColumn[1]}`;

    tableBodyCells[i + fieldWidth * 2].innerHTML = newColumn[2];

    tableBodyCells[i + fieldWidth * 2]
      .className = `field-cell field-cell--${newColumn[2]}`;

    tableBodyCells[i + fieldWidth * 3].innerHTML = newColumn[3];

    tableBodyCells[i + fieldWidth * 3]
      .className = `field-cell field-cell--${newColumn[3]}`;
  }
};

const moveDown = () => {
  for (let i = 0; i < fieldWidth; i++) {
    const column = [
      +tableBodyCells[i].innerHTML,
      +tableBodyCells[i + fieldWidth].innerHTML,
      +tableBodyCells[i + fieldWidth * 2].innerHTML,
      +tableBodyCells[i + fieldWidth * 3].innerHTML,
    ];

    const trueValues = column.filter(value => value);

    const falseValues = column.filter(value => !value);

    if (trueValues.length > 1) {
      for (let j = trueValues.length - 1; j >= 0; j--) {
        if (trueValues[j] === trueValues[j + 1]) {
          trueValues[j + 1] = trueValues[j + 1] + trueValues[j];
          trueValues[j] = 0;

          gameScore.innerHTML = trueValues[j + 1] + +gameScore.innerHTML;

          if (+trueValues[j + 1] >= 2048) {
            winMessage.hidden = false;
          }
        }

        if (trueValues[j + 1] === 0) {
          trueValues[j + 1] = trueValues[j];
          trueValues[j] = 0;
        }
      }
    }

    const newColumn = [...falseValues, ...trueValues];

    for (let k = 0; k < newColumn.length; k++) {
      if (column[k] !== newColumn[k]) {
        shouldCreateNumber = true;
      }

      if (newColumn[k] === 0) {
        newColumn[k] = '';
      }
    }

    tableBodyCells[i].innerHTML = newColumn[0];
    tableBodyCells[i].className = `field-cell field-cell--${newColumn[0]}`;

    tableBodyCells[i + fieldWidth].innerHTML = newColumn[1];

    tableBodyCells[i + fieldWidth]
      .className = `field-cell field-cell--${newColumn[1]}`;

    tableBodyCells[i + fieldWidth * 2].innerHTML = newColumn[2];

    tableBodyCells[i + fieldWidth * 2]
      .className = `field-cell field-cell--${newColumn[2]}`;

    tableBodyCells[i + fieldWidth * 3].innerHTML = newColumn[3];

    tableBodyCells[i + fieldWidth * 3]
      .className = `field-cell field-cell--${newColumn[3]}`;
  }
};

const losingMessage = () => {
  const availableEmptyCells = [...tableBodyCells]
    .every(cell => cell.innerHTML !== '');

  if (!availableEmptyCells) {
    return false;
  }

  for (let i = 0; i < tableBodyRows.length; i++) {
    for (let j = 0; j < tableBodyRows[i].cells.length - 1; j++) {
      if (tableBodyRows[i].cells[j].innerHTML
        === tableBodyRows[i].cells[j + 1].innerHTML) {
        return false;
      }
    }
  }

  const firstColumn = [];
  const secondColumn = [];
  const thirdColumn = [];
  const fourthColumn = [];

  for (let i = 0; i < tableBodyRows.length; i++) {
    for (let j = 0; j < tableBodyRows[i].cells.length - 1; j++) {
      if (j === 0) {
        firstColumn.push(+tableBodyRows[i].cells[j].innerHTML);
      };

      if (j === 1) {
        secondColumn.push(+tableBodyRows[i].cells[j].innerHTML);
      };

      if (j === 2) {
        thirdColumn.push(+tableBodyRows[i].cells[j].innerHTML);
      };

      if (j === 3) {
        fourthColumn.push(+tableBodyRows[i].cells[j].innerHTML);
      };
    }
  }

  const columns = [firstColumn, secondColumn, thirdColumn, fourthColumn];

  for (let i = 0; i < columns.length; i++) {
    for (let j = 0; j < columns[i].length - 1; j++) {
      if (columns[i][j] === columns[i][j + 1]) {
        return false;
      }
    }
  }

  return true;
};

const keyDownHandler = (ev) => {
  if (button.classList.contains('restart') && winMessage.hidden) {
    switch (ev.code) {
      case 'ArrowUp':
        moveUp();

        if (shouldCreateNumber) {
          generateNumber();
          shouldCreateNumber = false;
        }
        break;

      case 'ArrowRight':
        moveRight();

        if (shouldCreateNumber) {
          generateNumber();
          shouldCreateNumber = false;
        }
        break;

      case 'ArrowDown':
        moveDown();

        if (shouldCreateNumber) {
          generateNumber();
          shouldCreateNumber = false;
        }
        break;

      case 'ArrowLeft':
        moveLeft();

        if (shouldCreateNumber) {
          generateNumber();
          shouldCreateNumber = false;
        }
        break;

      default:
        break;
    }
  }

  if (losingMessage()) {
    loseMessage.hidden = false;
    document.removeEventListener('keydown', keyDownHandler);
  }
};

document.addEventListener('keydown', keyDownHandler);

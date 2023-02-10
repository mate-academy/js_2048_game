'use strict';

const startButton = document.querySelector('.start');
const message = document.querySelector('.message-container');

const fieldSide = 4;
const fieldRows = [...document.querySelectorAll('tr')];
const fieldCells = [...document.querySelectorAll('td')];
const score = document.querySelector('.game-score');

function generateInEmptyCell() {
  do {
    const x = Math.floor(Math.random() * fieldSide);
    const y = Math.floor(Math.random() * fieldSide);

    const cell = fieldRows[x].children[y];

    if (!cell.textContent) {
      cell.textContent = `${Math.random() >= 0.9 ? 4 : 2}`;
      break;
    }
  } while (true);
}

function addClass(cells) {
  cells.forEach(cell => {
    if (cell.textContent) {
      cell.className = `field-cell`;
      cell.classList.add(`field-cell--${cell.innerText}`);
    };
  });
}

function calcScore(scoreElement, newCellContent) {
  const prevScore = +scoreElement.innerText;
  const newScore = prevScore + Number(newCellContent);

  scoreElement.innerText = newScore;
}

function slide(row) {
  const cells = [...row.cells].filter(cell => cell.innerText !== '');

  if (cells.length > 0) {
    for (let i = 0; i < cells.length - 1; i++) {
      let cell1 = cells[i].innerText;
      let cell2 = cells[i + 1].innerText;

      if (cell1 === cell2) {
        cell1 = +(cell1) * 2;

        calcScore(score, cell1);

        cells[i + 1].classList.remove(
          `field-cell--${cell2}`
        );
        cell2 = '';
      }

      cells[i].innerText = cell1;
      cells[i + 1].innerText = cell2;
    }
  }

  return row;
}

function slideReverse(row) {
  const cells = [...row.cells].filter(cell => cell.innerText !== '');

  if (cells.length > 0) {
    for (let i = cells.length - 1; i > 0; i--) {
      let cell1 = cells[i].innerText;
      let cell2 = cells[i - 1].innerText;

      if (cell1 === cell2) {
        cell1 = +(cell1) * 2;

        calcScore(score, cell1);

        cells[i - 1].classList.remove(
          `field-cell--${cell2}`
        );
        cell2 = '';
      }

      cells[i].innerText = cell1;
      cells[i - 1].innerText = cell2;
    }
  }

  return row;
}

function pushCells(row) {
  let cellsContent = [];

  for (const cell of row.children) {
    cellsContent.push(cell.innerText);
  }

  cellsContent = cellsContent.filter(el => el !== '');

  return cellsContent;
}

function deleteAdditionalClass(row, size) {
  for (let j = 0; j < size; j++) {
    const cell = row.children[j];

    if (!cell.innerText) {
      cell.className = 'field-cell';
    }
  }
}

function changeClasses(row, newCellsContent) {
  for (let i = 0; i < fieldSide; i++) {
    const cell = row.children[i];

    cell.innerText = newCellsContent[i] || '';

    cell.classList.add(
      `field-cell--${cell.innerText}`
    );
  }

  deleteAdditionalClass(row, fieldSide);
}

function createColumnArrays(rows, size) {
  let colArr = [];

  for (let i = 0; i < size; i++) {
    const valArr = [];

    colArr.push(valArr);
  }

  for (const row of rows) {
    for (let i = 0; i < size; i++) {
      const cellsContent = row.children[i].innerText;

      colArr[i].push(cellsContent);
    }
  }

  colArr = colArr.map(arr => arr.filter(el => el !== ''));

  return colArr;
}

function changeColumnArrays(mainArr, size) {
  const newRowsArr = [];

  for (let i = 0; i < size; i++) {
    const newRowContent = mainArr.map(arr => arr[i]);

    newRowsArr.push(newRowContent);
  }

  return newRowsArr;
}

function changeColumnCells(tableRows, newArr, size) {
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = tableRows[i].children[j];

      cell.innerText = newArr[i][j];

      cell.classList.add(
        `field-cell--${cell.innerText}`
      );
    }

    deleteAdditionalClass(tableRows[i], size);
  }
}

function slideLeft(row) {
  const newRow = slide(row);
  const cellsContent = pushCells(newRow);

  changeClasses(newRow, cellsContent);
}

function slideRight(row) {
  const newRow = slideReverse(row);
  let cellsContent = pushCells(newRow);
  const newLength = fieldSide - cellsContent.length;
  const emptyArr = new Array(newLength).fill('');

  cellsContent = [
    ...emptyArr,
    ...cellsContent,
  ];

  changeClasses(newRow, cellsContent);
}

function slideUp(tableRows) {
  let colArr = createColumnArrays(tableRows, fieldSide);

  colArr = colArr.map(arr => {
    const newArrLength = fieldSide - arr.length;
    let filledArr = [
      ...arr,
      ...new Array(newArrLength).fill(''),
    ];

    for (let i = 0; i < fieldSide - 1; i++) {
      if ((filledArr[i] === filledArr[i + 1]) && (filledArr[i] !== '')) {
        filledArr[i] *= 2;
        calcScore(score, filledArr[i]);
        filledArr[i + 1] = '';
        filledArr = filledArr.filter(el => el !== '');

        const filledArrNewLength = fieldSide - filledArr.length;

        filledArr = [
          ...filledArr,
          ...new Array(filledArrNewLength).fill(''),
        ];
      }
    }

    return filledArr;
  });

  const newRowsArr = changeColumnArrays(colArr, fieldSide);

  changeColumnCells(tableRows, newRowsArr, fieldSide);
}

function slideDown(tableRows) {
  let colArr = createColumnArrays(tableRows, fieldSide);

  colArr = colArr.map(arr => {
    const newArrLength = fieldSide - arr.length;
    let filledArr = [
      ...new Array(newArrLength).fill(''),
      ...arr,
    ];

    for (let i = fieldSide - 1; i > 0; i--) {
      if ((filledArr[i] === filledArr[i - 1]) && (filledArr[i] !== '')) {
        filledArr[i] *= 2;
        calcScore(score, filledArr[i]);
        filledArr[i - 1] = '';
        filledArr = filledArr.filter(el => el !== '');

        const filledArrNewLength = fieldSide - filledArr.length;

        filledArr = [
          ...new Array(filledArrNewLength).fill(''),
          ...filledArr,
        ];
      }
    }

    return filledArr;
  });

  const newRowsArr = changeColumnArrays(colArr, fieldSide);

  changeColumnCells(tableRows, newRowsArr, fieldSide);
}

function startGame(element) {
  if (element.className === 'button start') {
    element.textContent = 'Restart';
    element.classList.remove('start');
    element.classList.add('restart');
    element.style.outline = 'none';

    message.style.display = 'none';

    for (let i = 0; i < 2; i++) {
      generateInEmptyCell();
    }

    fieldCells.forEach(cell => {
      if (cell.textContent !== '') {
        cell.classList.add(`field-cell--${cell.textContent}`);
      };
    });
  } else {
    window.location.reload();
  }
}

function continueGame() {
  setTimeout(generateInEmptyCell(), 4000);
  addClass(fieldCells);
}

function checkPossibleMove(array) {
  const canBeMoved = array.filter(arr => {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        return arr;
      }
    }
  });

  return canBeMoved;
}

function checkFullBoard(arrays, size) {
  let fullBoard = false;

  if (arrays.every(arr => arr.length === size)) {
    const canBeMoved = checkPossibleMove(arrays);

    if (canBeMoved.length === 0) {
      fullBoard = true;
    }
  }

  return fullBoard;
}

function canBeMovedVertically(rows, size) {
  const columns = createColumnArrays(rows, size);

  return checkFullBoard(columns, size);
}

function canBeMovedHorizontally(rows, size) {
  const tableRows = [];

  for (const row of rows) {
    tableRows.push([...row.children].map(el => el.textContent));
  }

  return checkFullBoard(tableRows, size);
}

function loseGame(tableRows, size) {
  let fullBoard = false;
  const canSlideHorizontally = canBeMovedHorizontally(tableRows, size);
  const canSlideVertically = canBeMovedVertically(tableRows, size);

  if (canSlideHorizontally && canSlideVertically) {
    fullBoard = true;
  }

  return fullBoard;
}

function winGame(tableCells) {
  const cellsContent = tableCells.map(el => el.textContent);

  if (cellsContent.indexOf('2048') !== -1) {
    return true;
  }

  return false;
}

function addMessage(messageContainer, messageClass) {
  messageContainer.style.display = 'block';
  messageContainer.children[2].classList.add('hidden');

  if (messageClass === 'lose') {
    messageContainer.children[0].classList.remove('hidden');
  }

  if (messageClass === 'win') {
    messageContainer.children[1].classList.remove('hidden');
  }
}

function playing() {
  if (!loseGame(fieldRows, fieldSide)) {
    if (winGame(fieldCells)) {
      addMessage(message, 'win');
    }
    continueGame();
  }

  if (loseGame(fieldRows, fieldSide)) {
    addMessage(message, 'lose');
  }
}

startButton.addEventListener('click', e => {
  startGame(e.target);

  document.addEventListener('keydown', keyEvent => {
    const code = keyEvent.key;

    switch (code) {
      case 'ArrowLeft':
        for (const row of fieldRows) {
          slideLeft(row);
        }
        playing();

        break;

      case 'ArrowRight':
        for (const row of fieldRows) {
          slideRight(row);
        }
        playing();

        break;

      case 'ArrowUp':
        slideUp(fieldRows);
        playing();

        break;

      case 'ArrowDown':
        slideDown(fieldRows);
        playing();

        break;

      default:
        return;
    };
  });
});

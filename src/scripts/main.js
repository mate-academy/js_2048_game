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

    if (fieldRows[x].children[y].textContent === '') {
      fieldRows[x].children[y].textContent = `${Math.random() >= 0.9 ? 4 : 2}`;
      break;
    }
  } while (true);
}

function addClass(cells) {
  cells.forEach(cell => {
    if (cell.textContent !== '') {
      cell.className = `field-cell`;
      cell.classList.add(`field-cell--${cell.innerText}`);
    };
  });
}

function calcScore(scoreElement, newCellContent) {
  const prevScore = +scoreElement.innerText;
  const newScore = prevScore + +newCellContent;

  scoreElement.innerText = newScore;
}

function slide(row) {
  const cells = [...row.cells].filter(cell => cell.innerText !== '');

  if (cells.length > 0) {
    for (let i = 0; i < cells.length - 1; i++) {
      if (cells[i].innerText === cells[i + 1].innerText) {
        cells[i].innerText = +(cells[i].innerText) * 2;

        calcScore(score, cells[i].innerText);

        cells[i + 1].classList.remove(
          `field-cell--${cells[i + 1].innerText}`
        );
        cells[i + 1].innerText = '';
      }
    }
  }

  return row;
}

function slideReverse(row) {
  const cells = [...row.cells].filter(cell => cell.innerText !== '');

  if (cells.length > 0) {
    for (let i = cells.length - 1; i > 0; i--) {
      if (cells[i].innerText === cells[i - 1].innerText) {
        cells[i].innerText = +(cells[i].innerText) * 2;

        calcScore(score, cells[i].innerText);

        cells[i - 1].classList.remove(
          `field-cell--${cells[i - 1].innerText}`
        );
        cells[i - 1].innerText = '';
      }
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
    if (row.children[j].innerText === '') {
      row.children[j].className = 'field-cell';
    }
  }
}

function changeClasses(row, newCellsContent) {
  for (let i = 0; i < fieldSide; i++) {
    row.children[i].innerText = newCellsContent[i] || '';

    row.children[i].classList.add(
      `field-cell--${row.children[i].innerText}`
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
      colArr[i].push(row.children[i].innerText);
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
      tableRows[i].children[j].innerText = newArr[i][j];

      tableRows[i].children[j].classList.add(
        `field-cell--${tableRows[i].children[j].innerText}`
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

function slideUp(tableRows) {
  let colArr = createColumnArrays(tableRows, fieldSide);

  colArr = colArr.map(arr => {
    let filledArr = [
      ...arr,
      ...new Array(fieldSide - arr.length).fill(''),
    ];

    for (let i = 0; i < fieldSide - 1; i++) {
      if ((filledArr[i] === filledArr[i + 1]) && (filledArr[i] !== '')) {
        filledArr[i] *= 2;
        calcScore(score, filledArr[i]);
        filledArr[i + 1] = '';
        filledArr = filledArr.filter(el => el !== '');

        filledArr = [
          ...filledArr,
          ...new Array(fieldSide - filledArr.length).fill(''),
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
    let filledArr = [
      ...new Array(fieldSide - arr.length).fill(''),
      ...arr,
    ];

    for (let i = fieldSide - 1; i > 0; i--) {
      if ((filledArr[i] === filledArr[i - 1]) && (filledArr[i] !== '')) {
        filledArr[i] *= 2;
        calcScore(score, filledArr[i]);
        filledArr[i - 1] = '';
        filledArr = filledArr.filter(el => el !== '');

        filledArr = [
          ...new Array(fieldSide - filledArr.length).fill(''),
          ...filledArr,
        ];
      }
    }

    return filledArr;
  });

  const newRowsArr = changeColumnArrays(colArr, fieldSide);

  changeColumnCells(tableRows, newRowsArr, fieldSide);
}

function slideRight(row) {
  const newRow = slideReverse(row);
  let cellsContent = pushCells(newRow);
  const emptyArr = new Array(fieldSide - cellsContent.length).fill('');

  cellsContent = [
    ...emptyArr,
    ...cellsContent,
  ];

  changeClasses(newRow, cellsContent);
}

function startGame(element) {
  if (element.className === 'button start') {
    element.textContent = 'Restart';
    element.classList.remove('start');
    element.classList.add('restart');

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

function loseGame(tableCells, tableRows, size) {
  let fullBoard = false;

  if (tableCells.filter(el => el.textContent === '').length === 0) {
    const matrix = [];

    for (const row of tableRows) {
      const cellsContent = [...row.children].map(el => el.textContent);

      matrix.push(cellsContent);
    }

    for (let i = 0; i < size - 1; i++) {
      for (let j = 0; j < size - 1; j++) {
        const cell = matrix[i][j];

        if (cell !== matrix[i + 1][j] && cell !== matrix[i][j + 1]) {
          fullBoard = true;
        }
      }
    }
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
  if (!loseGame(fieldCells, fieldRows, fieldSide)) {
    if (winGame(fieldCells)) {
      addMessage(message, 'win');
    }
    continueGame();
  } else {
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

// #endregion

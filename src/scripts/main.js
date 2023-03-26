'use strict';

const score = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
let gameColumns = document.querySelectorAll('.field-row');
let gameCells = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const tbody = document.querySelector('tbody');
const gameCellCount = gameColumns[0].children;
let game;
const leftArrow = 'ArrowLeft';
const upArrow = 'ArrowUp';
const rightArrow = 'ArrowRight';
const downArrow = 'ArrowDown';
let gameStart = false;

// #region ending game
function checkWin() {
  if ([...gameCells].map(el => el.innerText)
    .some(el => el === '2048')) {
    winMessage.classList.remove('hidden');
  }
};

function checkLose(gameField) {
  const rowsLength = 4;
  const columnLength = 4;
  const innerTextOfCells = [...gameCells].map(el => el.innerText);

  if (innerTextOfCells
    .some(el => el === '2048' || el === '')) {
    return;
  }

  for (let i = 0; i < columnLength; i++) {
    for (let j = 0; j < rowsLength - 1; j++) {
      if (gameField.children[i].children[j].innerText
          === gameField.children[i].children[j + 1].innerText) {
        return;
      }
    }
  }

  for (let i = 0; i < columnLength - 1; i++) {
    for (let j = 0; j < rowsLength; j++) {
      if (gameField.children[i].children[j].innerText
        === gameField.children[i + 1].children[j].innerText) {
        return;
      }
    }
  }

  loseMessage.classList.remove('hidden');
};

// #endregion

// #region randomizers
function getRandomCell(max) {
  return Math.floor(Math.random() * max);
};

function randomIntFromInterval(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1) + min);

  if (num !== 4) {
    return 2;
  }

  return 4;
}

function randomChangedCell() {
  game = {
    column: 0,
    cell: 0,
  };

  game.column = getRandomCell(gameColumns.length);
  game.cell = getRandomCell(gameCellCount.length);

  if (gameColumns[game.column].children[game.cell].innerText !== '') {
    randomChangedCell();
  }
}

// #endregion

function startGame() {
  randomChangedCell();

  const changedCell = gameColumns[game.column].children[game.cell];

  changedCell.innerText = 2;
  changedCell.classList.add('field-cell--2');
  gameCells = document.querySelectorAll('.field-cell');
}

// #region game logic

function addScore(num) {
  score.innerText = +score.innerText + num;
}

function addNumber() {
  randomChangedCell();

  const changedCell = gameColumns[game.column].children[game.cell];

  changedCell.innerText = randomIntFromInterval(1, 10);
  changedCell.classList.add(`field-cell--${changedCell.innerText}`);
}

function addCell(column, place) {
  column.insertAdjacentHTML(`${place}`, `
    <td class="field-cell"></td>
  `);
};

function removeCell(arrayCell) {
  [...gameColumns].forEach(column => {
    arrayCell.forEach(cell => {
      if (cell.innerText === '') {
        cell.remove();
        gameColumns = document.querySelectorAll('.field-row');
      }
    });
  });

  gameCells = document.querySelectorAll('.field-cell');
}

function moveCells(arrayCell, placeForNewCell) {
  removeCell(arrayCell);

  if ([...gameCells].some(el => el.innerText === '')) {
    removeCell(arrayCell);
  }

  [...gameColumns].forEach(column => {
    if (column.children.length < 4) {
      while (column.children.length < 4) {
        addCell(column, placeForNewCell);
      }
    }
  });

  gameCells = document.querySelectorAll('.field-cell');
}

function addNeighborCells(arrayColumn, keyIsDown) {
  arrayColumn.forEach(column => {
    for (let i = 0; i < column.children.length - 1; i++) {
      const curCell = column.children[i];
      const nextCell = column.children[i + 1];

      if (curCell.innerText === nextCell.innerText
        && curCell.innerText >= 2) {
        if (keyIsDown === 'left') {
          curCell.classList
            .remove(`field-cell--${curCell.innerText}`);

          curCell.innerText = (curCell.innerText * 2);

          curCell.classList
            .add(`field-cell--${curCell.innerText}`);

          nextCell.innerText = '';
          nextCell.classList = 'field-cell';

          addScore(+curCell.innerText);

          break;
        }

        if (keyIsDown === 'right') {
          nextCell.classList
            .remove(`field-cell--${nextCell.innerText}`);

          nextCell.innerText
            = (nextCell.innerText * 2);

          nextCell.classList
            .add(`field-cell--${nextCell.innerText}`);

          curCell.innerText = '';
          curCell.classList = 'field-cell';

          addScore(+nextCell.innerText);

          break;
        }
      }
    }
    moveCells(arrayColumn);
  });
}

function addNeighborColumn(arrayColumn, keyIsDown) {
  for (let curTableRow = 1; curTableRow < arrayColumn.length; curTableRow++) {
    if (arrayColumn[curTableRow - 1] !== null) {
      const prevRow = arrayColumn[curTableRow - 1].children;
      const currentRow = arrayColumn[curTableRow].children;

      for (let curRowCell = 0;
        curRowCell < prevRow.length; curRowCell++) {
        if (prevRow[curRowCell].innerText
          === currentRow[curRowCell].innerText
            && prevRow[curRowCell].innerText !== '') {
          prevRow[curRowCell].innerText
            = (prevRow[curRowCell].innerText * 2);

          prevRow[curRowCell].classList
            .add(`field-cell--${prevRow[curRowCell].innerText}`);

          currentRow[curRowCell].innerText = '';

          currentRow[curRowCell].classList
            = 'field-cell';

          addScore(+prevRow[curRowCell].innerText);
        }
      }
    }
    gameCells = document.querySelectorAll('.field-cell');
  };
}

function cellsUp(arrayColumn) {
  for (let curTableRow = arrayColumn.length - 1;
    curTableRow > 0; curTableRow--) {
    for (let curRowCell = 0;
      curRowCell < arrayColumn[curTableRow].children.length; curRowCell++) {
      const previousTableChild = arrayColumn[curTableRow - 1]
        .children[curRowCell];
      const currentTableChild = arrayColumn[curTableRow].children[curRowCell];

      if (previousTableChild.innerText === '') {
        previousTableChild.innerText
          = currentTableChild.innerText;

        previousTableChild.classList
          .add(`field-cell--${previousTableChild.innerText}`);

        currentTableChild.innerText = '';
        currentTableChild.classList = 'field-cell';
      }
    }
  }
}

// #endregion

startButton.addEventListener('click', () => {
  startGame();
  startGame();
  gameStart = true;

  startButton.classList.add('hidden');
  restartButton.classList.remove('hidden');
  startMessage.classList.add('hidden');
});

document.body.addEventListener('keydown', (el) => {
  if (el.key === leftArrow) {
    if (gameStart) {
      moveCells([...gameCells], 'beforeend');

      addNeighborCells([...gameColumns], 'left');

      addNumber();
      gameCells = document.querySelectorAll('.field-cell');
    }
  };

  if (el.key === rightArrow) {
    if (gameStart) {
      moveCells([...gameCells].reverse(), 'afterbegin');

      addNeighborCells([...gameColumns].reverse(), 'right');

      addNumber();
      gameCells = document.querySelectorAll('.field-cell');
    }
  }

  if (el.key === upArrow) {
    if (gameStart) {
      cellsUp([...gameColumns]);

      addNeighborColumn([...gameColumns], 'top');

      addNumber();
      gameCells = document.querySelectorAll('.field-cell');
    }
  }

  if (el.key === downArrow) {
    if (gameStart) {
      cellsUp([...gameColumns].reverse());

      addNeighborColumn([...gameColumns].reverse(), 'down');

      addNumber();
      gameCells = document.querySelectorAll('.field-cell');
    }
  }

  checkLose(tbody);
  checkWin();
});

restartButton.addEventListener('click', () => {
  score.innerText = '0';

  if (tbody.children.length > 4) {
    while (tbody.children.length > 4) {
      tbody.lastElementChild.remove();
    }
  }
  loseMessage.classList.add('hidden');

  [...gameCells].forEach(cell => {
    cell.innerText = '';
    cell.classList = 'field-cell';
  });

  startGame();
  startGame();
});

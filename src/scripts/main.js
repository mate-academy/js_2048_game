'use strict';

// write your code here
const cells = Array.from(document.querySelectorAll('.field-cell'));
const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    leftAction();
  }

  if (e.key === 'ArrowRight') {
    rightAction();
  }

  if (e.key === 'ArrowUp') {
    upAction();
  }

  if (e.key === 'ArrowDown') {
    downAction();
  }
});
startButton.addEventListener('click', startMessage);

startButton.addEventListener('click', getTwoRandomNumbers);

function startMessage() {
  messageStart.classList.add('hidden');
}

function getTwoRandomNumbers() {
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  cells.map(cell => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });

  const number1 = Math.floor(Math.random() * 16);
  let number2;

  do {
    number2 = Math.floor(Math.random() * 16);
  } while (number1 === number2);

  cells.map((cell, index) => {
    if (index === number1) {
      cell.textContent = getRandomNumber();
    }

    if (index === number2) {
      cell.textContent = getRandomNumber();
    }
  });

  startButton.removeEventListener(startMessage);
};

function getRandomNumber() {
  const number = Math.floor(Math.random() * 101);

  if (number < 90) {
    return 2;
  } else {
    return 4;
  }
};

function addNumber() {
  const existingNumbers = [];
  let cellIndex;

  cells.map((cell, index) => {
    if (cell.textContent) {
      existingNumbers.push(index);
    }
  });

  if (existingNumbers.length === 16) {
    messageLose.classList.remove('hidden');

    return;
  }

  do {
    cellIndex = Math.floor(Math.random() * 16);
  } while (existingNumbers.includes(cellIndex));

  cells[cellIndex].textContent = getRandomNumber();

  cells[cellIndex].className
    = `field-cell field-cell--${cells[cellIndex].textContent}`;
}

function leftAction() {
  for (let i = 0; i < cells.length; i++) {
    if (i % 4 === 0) {
      const cell1 = +cells[i].textContent;
      const cell2 = +cells[i + 1].textContent;
      const cell3 = +cells[i + 2].textContent;
      const cell4 = +cells[i + 3].textContent;
      const row = [cell1, cell2, cell3, cell4];

      const filledCells = row.filter(cell => cell);
      const emptyCells = new Array(4 - filledCells.length).fill('');
      const updatedRow = filledCells.concat(emptyCells);

      for (let y = 1; y < updatedRow.length; y++) {
        if (updatedRow[y] === updatedRow[y - 1]) {
          const totalNumber = updatedRow[y] + updatedRow[y - 1];

          if (totalNumber === 2048) {
            messageWin.classList.remove('hidden');

            return;
          }
          score.textContent = +score.textContent + totalNumber;
          updatedRow[y - 1] = totalNumber;
          updatedRow[y] = '';
          updatedRow.splice(y, 1);
          updatedRow.push('');
        }
      }

      cells[i].textContent = updatedRow[0];
      cells[i + 1].textContent = updatedRow[1];
      cells[i + 2].textContent = updatedRow[2];
      cells[i + 3].textContent = updatedRow[3];

      cells[i].className
        = `field-cell field-cell--${cells[i].textContent}`;

      cells[i + 1].className
        = `field-cell field-cell--${cells[i + 1].textContent}`;

      cells[i + 2].className
        = `field-cell field-cell--${cells[i + 2].textContent}`;

      cells[i + 3].className
        = `field-cell field-cell--${cells[i + 3].textContent}`;
    }
  }
  addNumber();
}

function rightAction() {
  for (let i = 0; i < cells.length; i++) {
    if (i % 4 === 0) {
      const cell1 = +cells[i].textContent;
      const cell2 = +cells[i + 1].textContent;
      const cell3 = +cells[i + 2].textContent;
      const cell4 = +cells[i + 3].textContent;
      const row = [cell1, cell2, cell3, cell4];

      const filledCells = row.filter(cell => cell);
      const emptyCells = new Array(4 - filledCells.length).fill('');
      const updatedRow = emptyCells.concat(filledCells);

      for (let y = updatedRow.length - 1; y > 0; y--) {
        if (updatedRow[y] === updatedRow[y - 1]) {
          const totalNumber = updatedRow[y] + updatedRow[y - 1];

          if (totalNumber === 2048) {
            messageWin.classList.remove('hidden');

            return;
          }
          score.textContent = +score.textContent + totalNumber;
          updatedRow[y] = totalNumber;
          updatedRow[y - 1] = '';
          updatedRow.splice([y - 1], 1);
          updatedRow.unshift('');
        }
      }

      cells[i].textContent = updatedRow[0];
      cells[i + 1].textContent = updatedRow[1];
      cells[i + 2].textContent = updatedRow[2];
      cells[i + 3].textContent = updatedRow[3];

      cells[i].className
        = `field-cell field-cell--${cells[i].textContent}`;

      cells[i + 1].className
        = `field-cell field-cell--${cells[i + 1].textContent}`;

      cells[i + 2].className
        = `field-cell field-cell--${cells[i + 2].textContent}`;

      cells[i + 3].className
        = `field-cell field-cell--${cells[i + 3].textContent}`;
    }
  }
  addNumber();
}

function upAction() {
  for (let i = 3; i >= 0; i--) {
    const cell1 = +cells[i].textContent;
    const cell2 = +cells[i + 4].textContent;
    const cell3 = +cells[i + 8].textContent;
    const cell4 = +cells[i + 12].textContent;
    const row = [cell1, cell2, cell3, cell4];

    const filledCells = row.filter(cell => cell);
    const emptyCells = new Array(4 - filledCells.length).fill('');
    const updatedRow = filledCells.concat(emptyCells);

    for (let y = 1; y < updatedRow.length; y++) {
      if (updatedRow[y] === updatedRow[y - 1]) {
        const totalNumber = updatedRow[y] + updatedRow[y - 1];

        if (totalNumber === 2048) {
          messageWin.classList.remove('hidden');

          return;
        }
        score.textContent = +score.textContent + totalNumber;
        updatedRow[y - 1] = totalNumber;
        updatedRow[y] = '';
        updatedRow.splice(y, 1);
        updatedRow.push('');
      }
    }

    cells[i].textContent = updatedRow[0];
    cells[i + 4].textContent = updatedRow[1];
    cells[i + 8].textContent = updatedRow[2];
    cells[i + 12].textContent = updatedRow[3];

    cells[i].className
      = `field-cell field-cell--${cells[i].textContent}`;

    cells[i + 4].className
      = `field-cell field-cell--${cells[i + 4].textContent}`;

    cells[i + 8].className
      = `field-cell field-cell--${cells[i + 8].textContent}`;

    cells[i + 12].className
      = `field-cell field-cell--${cells[i + 12].textContent}`;
  }
  addNumber();
}

function downAction() {
  for (let i = 3; i >= 0; i--) {
    const cell1 = +cells[i].textContent;
    const cell2 = +cells[i + 4].textContent;
    const cell3 = +cells[i + 8].textContent;
    const cell4 = +cells[i + 12].textContent;
    const row = [cell1, cell2, cell3, cell4];

    const filledCells = row.filter(cell => cell);
    const emptyCells = new Array(4 - filledCells.length).fill('');
    const updatedRow = emptyCells.concat(filledCells);

    for (let y = updatedRow.length - 1; y > 0; y--) {
      if (updatedRow[y] === updatedRow[y - 1]) {
        const totalNumber = updatedRow[y] + updatedRow[y - 1];

        if (totalNumber === 2048) {
          messageWin.classList.remove('hidden');

          return;
        }
        score.textContent = +score.textContent + totalNumber;
        updatedRow[y] = totalNumber;
        updatedRow[y - 1] = '';
        updatedRow.splice([y - 1], 1);
        updatedRow.unshift('');
      }
    }

    cells[i].textContent = updatedRow[0];
    cells[i + 4].textContent = updatedRow[1];
    cells[i + 8].textContent = updatedRow[2];
    cells[i + 12].textContent = updatedRow[3];

    cells[i].className
      = `field-cell field-cell--${cells[i].textContent}`;

    cells[i + 4].className
      = `field-cell field-cell--${cells[i + 4].textContent}`;

    cells[i + 8].className
      = `field-cell field-cell--${cells[i + 8].textContent}`;

    cells[i + 12].className
      = `field-cell field-cell--${cells[i + 12].textContent}`;
  }
  addNumber();
}

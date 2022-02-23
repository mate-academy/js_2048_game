'use strict';

// write your code here
const cells = Array.from(document.querySelectorAll('.field-cell'));
const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const nextMove = {
  upMove: true,
  downMove: true,
  leftMove: true,
  rightMove: true,
}

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

function loseMessage() {
  if (!nextMove.downMove
    && !nextMove.upMove
    && !nextMove.leftMove
    && !nextMove.rightMove) {
    messageLose.classList.remove('hidden');
  }
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
    if (index === number1 || index === number2) {
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
    if (+cell.textContent > 0) {
      existingNumbers.push(index);
    }
  });

  do {
    cellIndex = Math.floor(Math.random() * 16);
  } while (existingNumbers.includes(cellIndex));

  cells[cellIndex].textContent = getRandomNumber();

  cells[cellIndex].className
    = `field-cell field-cell--${cells[cellIndex].textContent}`;
}

function leftAction() {
  let leftChange = false;

  for (let i = 0; i < cells.length; i++) {
    if (i % 4 === 0) {
      const cell1 = +cells[i].textContent;
      const cell2 = +cells[i + 1].textContent;
      const cell3 = +cells[i + 2].textContent;
      const cell4 = +cells[i + 3].textContent;
      const row = [cell1, cell2, cell3, cell4];

      const filledCells = row.filter(cell => cell > 0);
      for (let y = 1; y < filledCells.length; y++) {
        if (filledCells[y] === filledCells[y - 1]) {
          const totalNumber = filledCells[y] + filledCells[y - 1];

          if (totalNumber === 2048) {
            messageWin.classList.remove('hidden');

            return;
          }
          score.textContent = +score.textContent + totalNumber;
          filledCells[y - 1] = totalNumber;
          filledCells[y] = 0;
          filledCells.splice(y, 1);
          filledCells.push(0);
        }
      }
      const emptyCells = new Array(4 - filledCells.length).fill(0);
      const updatedRow = filledCells.concat(emptyCells);


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

      if (JSON.stringify(row) !== JSON.stringify(updatedRow)) {
        leftChange = JSON.stringify(row) !== JSON.stringify(updatedRow);
      }
    }
  }

  if (leftChange) {
    nextMove.leftMove = true;
    addNumber();
  } else {
    nextMove.leftMove = false;
    loseMessage();
  }
}

function rightAction() {
  let rightChange = false;
  for (let i = 0; i < cells.length; i++) {
    if (i % 4 === 0) {
      const cell1 = +cells[i].textContent;
      const cell2 = +cells[i + 1].textContent;
      const cell3 = +cells[i + 2].textContent;
      const cell4 = +cells[i + 3].textContent;
      const row = [cell1, cell2, cell3, cell4];

      const filledCells = row.filter(cell => cell > 0);
      for (let y = filledCells.length - 1; y > 0; y--) {
        if (filledCells[y] === filledCells[y - 1]) {
          const totalNumber = filledCells[y] + filledCells[y - 1];

          if (totalNumber === 2048) {
            messageWin.classList.remove('hidden');

            return;
          }
          score.textContent = +score.textContent + totalNumber;
          filledCells[y] = totalNumber;
          filledCells[y - 1] = 0;
          filledCells.splice([y - 1], 1);
          filledCells.unshift(0);
        }
      }
      const emptyCells = new Array(4 - filledCells.length).fill(0);
      const updatedRow = emptyCells.concat(filledCells);


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

      if (JSON.stringify(row) !== JSON.stringify(updatedRow)) {
        rightChange = true;
      }
    }
  }

  if (rightChange) {
    nextMove.rightMove = true;
    addNumber();
  } else {
    nextMove.rightMove = false;
    loseMessage();
  }
}

function upAction() {
  let upChange = false;
  for (let i = 3; i >= 0; i--) {
    const cell1 = +cells[i].textContent;
    const cell2 = +cells[i + 4].textContent;
    const cell3 = +cells[i + 8].textContent;
    const cell4 = +cells[i + 12].textContent;
    const row = [cell1, cell2, cell3, cell4];

    const filledCells = row.filter(cell => cell > 0);
    for (let y = 1; y < filledCells.length; y++) {
      if (filledCells[y] === filledCells[y - 1]) {
        const totalNumber = filledCells[y] + filledCells[y - 1];

        if (totalNumber === 2048) {
          messageWin.classList.remove('hidden');

          return;
        }
        score.textContent = +score.textContent + totalNumber;
        filledCells[y - 1] = totalNumber;
        filledCells[y] = 0;
        filledCells.splice(y, 1);
        filledCells.push(0);
      }
    }
    const emptyCells = new Array(4 - filledCells.length).fill(0);
    const updatedRow = filledCells.concat(emptyCells);


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

    if (JSON.stringify(row) !== JSON.stringify(updatedRow)) {
      upChange = true;
    }
  }

  if (upChange) {
    nextMove.upMove = true;
    addNumber();
  } else {
    nextMove.upMove = false;
    loseMessage();
  }
}

function downAction() {

  let downChange = false;
  for (let i = 3; i >= 0; i--) {
    const cell1 = +cells[i].textContent;
    const cell2 = +cells[i + 4].textContent;
    const cell3 = +cells[i + 8].textContent;
    const cell4 = +cells[i + 12].textContent;
    const row = [cell1, cell2, cell3, cell4];

    const filledCells = row.filter(cell => cell > 0);
    for (let y = filledCells.length - 1; y > 0; y--) {
      if (filledCells[y] === filledCells[y - 1]) {
        const totalNumber = filledCells[y] + filledCells[y - 1];

        if (totalNumber === 2048) {
          messageWin.classList.remove('hidden');

          return;
        }
        score.textContent = +score.textContent + totalNumber;
        filledCells[y] = totalNumber;
        filledCells[y - 1] = 0;
        filledCells.splice([y - 1], 1);
        filledCells.unshift(0);
      }
    }
    const emptyCells = new Array(4 - filledCells.length).fill(0);
    const updatedRow = emptyCells.concat(filledCells);

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

    if (JSON.stringify(row) !== JSON.stringify(updatedRow)) {
      downChange = true;
    }
  }

  if (downChange) {
    nextMove.downMove = true;
    addNumber();
  } else {
    nextMove.downMove = false;
    loseMessage();
  }
}

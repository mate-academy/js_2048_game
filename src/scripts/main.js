'use strict';

const cells = Array.from(document.querySelectorAll('.field-cell'));
const board = new Array(16).fill(0);
const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
let counter = 0;

const nextMove = {
  upMove: true,
  downMove: true,
  leftMove: true,
  rightMove: true,
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    horizontalMove('left');
  }

  if (e.key === 'ArrowRight') {
    horizontalMove('right');
  }

  if (e.key === 'ArrowUp') {
    verticalMove('up');
  }

  if (e.key === 'ArrowDown') {
    verticalMove('down');
  }
});
startButton.addEventListener('click', startMessage);

startButton.addEventListener('click', getTwoRandomNumbers);

function startMessage() {
  messageStart.classList.add('hidden');
}

function loseMessage() {
  const filledCells = board.filter(cell => cell > 0);
  if (!nextMove.downMove
    && !nextMove.upMove
    && !nextMove.leftMove
    && !nextMove.rightMove && filledCells.length === 16) {
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

  board.fill(0);
  counter = 0;
  score.textContent = 0;

  const number1 = Math.floor(Math.random() * 16);
  let number2;

  do {
    number2 = Math.floor(Math.random() * 16);
  } while (number1 === number2);

  cells.map((cell, index) => {
    if (index === number1 || index === number2) {
      board[index] = getRandomNumber();
      cells[index].textContent = board[index];
      cell.className = `field-cell field-cell--${+cell.textContent}`;
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

  board.map((cell, index) => {
    if (cell > 0) {
      existingNumbers.push(index);
    }
  });

  do {
    cellIndex = Math.floor(Math.random() * 16);
  } while (existingNumbers.includes(cellIndex));

  board[cellIndex] = getRandomNumber();
  cells[cellIndex].textContent = board[cellIndex];

  cells[cellIndex].className
    = `field-cell field-cell--${board[cellIndex]}`;
}

function horizontalMove(direction) {
  let rightChange = false;
  let leftChange = false;
  for (let i = 0; i < cells.length; i++) {
    if (i % 4 === 0) {
      const cell1 = board[i];
      const cell2 = board[i + 1];
      const cell3 = board[i + 2];
      const cell4 = board[i + 3];
      const row = [cell1, cell2, cell3, cell4];

      const filledCells = row.filter(cell => cell > 0);
      if (direction === 'left') {
        for (let y = 1; y < filledCells.length; y++) {
          if (filledCells[y] === filledCells[y - 1]) {
            const totalNumber = filledCells[y] + filledCells[y - 1];

            if (totalNumber === 2048) {
              messageWin.classList.remove('hidden');

              return;
            }
            counter += totalNumber;
            score.textContent = counter;
            filledCells[y - 1] = totalNumber;
            filledCells[y] = 0;
            filledCells.splice(y, 1);
            filledCells.push(0);
          }
        }
      } else {
        for (let y = filledCells.length - 1; y > 0; y--) {
          if (filledCells[y] === filledCells[y - 1]) {
            const totalNumber = filledCells[y] + filledCells[y - 1];

            if (totalNumber === 2048) {
              messageWin.classList.remove('hidden');

              return;
            }
            counter += totalNumber;
            score.textContent = counter;
            filledCells[y] = totalNumber;
            filledCells[y - 1] = 0;
            filledCells.splice([y - 1], 1);
            filledCells.unshift(0);
          }
        }
      }
      const emptyCells = new Array(4 - filledCells.length).fill(0);
      const updatedRow = direction === 'left' ? filledCells.concat(emptyCells) : emptyCells.concat(filledCells);


      board[i] = updatedRow[0];
      board[i + 1] = updatedRow[1];
      board[i + 2] = updatedRow[2];
      board[i + 3] = updatedRow[3];

      cells[i].textContent = board[i];
      cells[i + 1].textContent = board[i + 1];
      cells[i + 2].textContent = board[i + 2];
      cells[i + 3].textContent = board[i + 3];

      cells[i].className
        = `field-cell field-cell--${cells[i].textContent}`;

      cells[i + 1].className
        = `field-cell field-cell--${cells[i + 1].textContent}`;

      cells[i + 2].className
        = `field-cell field-cell--${cells[i + 2].textContent}`;

      cells[i + 3].className
        = `field-cell field-cell--${cells[i + 3].textContent}`;

      if (JSON.stringify(row) !== JSON.stringify(updatedRow)) {
        if (direction === 'left') {
          leftChange = true;
        } else {
          rightChange = true;
        }
      }
    }
  }

  if (direction === 'left') {
    if (leftChange) {
      nextMove.rightMove = true;
      nextMove.leftMove = true;
      nextMove.upMove = true;
      nextMove.downMove = true;
      addNumber();
    } else {
      nextMove.leftMove = false;
      loseMessage();
    }
  } else {
    if (rightChange) {
      nextMove.rightMove = true;
      nextMove.leftMove = true;
      nextMove.upMove = true;
      nextMove.downMove = true;
      addNumber();
    } else {
      nextMove.rightMove = false;
      loseMessage();
    }
  }
}

function verticalMove(direction) {
  let upChange = false;
  let downChange = false;
  for (let i = 3; i >= 0; i--) {
    const cell1 = board[i];
    const cell2 = board[i + 4];
    const cell3 = board[i + 8];
    const cell4 = board[i + 12];
    const row = [cell1, cell2, cell3, cell4];

    const filledCells = row.filter(cell => cell > 0);
    if (direction === 'up') {
      for (let y = 1; y < filledCells.length; y++) {
        if (filledCells[y] === filledCells[y - 1]) {
          const totalNumber = filledCells[y] + filledCells[y - 1];

          if (totalNumber === 2048) {
            messageWin.classList.remove('hidden');

            return;
          }
          counter += totalNumber;
          score.textContent = counter;
          filledCells[y - 1] = totalNumber;
          filledCells[y] = 0;
          filledCells.splice(y, 1);
          filledCells.push(0);
        }
      }
    } else {
      for (let y = filledCells.length - 1; y > 0; y--) {
        if (filledCells[y] === filledCells[y - 1]) {
          const totalNumber = filledCells[y] + filledCells[y - 1];

          if (totalNumber === 2048) {
            messageWin.classList.remove('hidden');

            return;
          }
          counter += totalNumber;
          score.textContent = counter;
          filledCells[y] = totalNumber;
          filledCells[y - 1] = 0;
          filledCells.splice([y - 1], 1);
          filledCells.unshift(0);
        }
      }
    }
    const emptyCells = new Array(4 - filledCells.length).fill(0);
    const updatedRow = direction === 'up' ? filledCells.concat(emptyCells) : emptyCells.concat(filledCells);


    board[i] = updatedRow[0];
    board[i + 4] = updatedRow[1];
    board[i + 8] = updatedRow[2];
    board[i + 12] = updatedRow[3];

    cells[i].textContent = board[i];
    cells[i + 4].textContent = board[i + 4];
    cells[i + 8].textContent = board[i + 8];
    cells[i + 12].textContent = board[i + 12];

    cells[i].className
      = `field-cell field-cell--${cells[i].textContent}`;

    cells[i + 4].className
      = `field-cell field-cell--${cells[i + 4].textContent}`;

    cells[i + 8].className
      = `field-cell field-cell--${cells[i + 8].textContent}`;

    cells[i + 12].className
      = `field-cell field-cell--${cells[i + 12].textContent}`;

    if (JSON.stringify(row) !== JSON.stringify(updatedRow)) {

      if (direction === 'up') {
        upChange = true;
      } else {
        downChange = true;
      }
    }
  }

  if (direction === 'up') {
    if (upChange) {
      nextMove.rightMove = true;
      nextMove.leftMove = true;
      nextMove.upMove = true;
      nextMove.downMove = true;
      addNumber();
    } else {
      nextMove.upMove = false;
      loseMessage();
    }
  } else {
    if (downChange) {
      nextMove.rightMove = true;
      nextMove.leftMove = true;
      nextMove.upMove = true;
      nextMove.downMove = true;
      addNumber();
    } else {
      nextMove.downMove = false;
      loseMessage();
    }
  }
}

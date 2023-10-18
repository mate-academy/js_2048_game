'use strict';

const button = document.querySelector('.button');
const message = document.querySelector('.message-start');
const lose = document.querySelector('.message-lose');
const win = document.querySelector('.message-win');
const rows = document.querySelectorAll('tr');
const allCells = document.querySelectorAll('td');
const score = document.querySelector('.game-score');
let buttonClicked = false;
let gameOver = false;
let scoreValue = 0;

button.addEventListener('click', () => {
  buttonClicked = true;
  message.classList.add('hidden');
  reset();
});

function isGameOver() {
  gameOver = true;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!rows[i].children[j].textContent) {
        gameOver = false;
        break;
      }
    }
  }

  if (gameOver === true) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const checkCell = rows[i].children[j].textContent;
        const nextCell = rows[i].children[j + 1].textContent;

        if (checkCell === nextCell) {
          gameOver = false;
          break;
        }
      }
    }
  }

  if (gameOver === true) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const checkCell = rows[i].children[j].textContent;
        const nextCell = rows[i + 1].children[j].textContent;

        if (checkCell === nextCell) {
          gameOver = false;
          break;
        }
      }
    }
  }

  if (gameOver === true) {
    lose.classList.remove('hidden');
  }
}

function newCell(x = 1) {
  const xPosition = Math.floor(Math.random() * 4);
  const yPosition = Math.floor(Math.random() * 4);

  for (let i = 0; i < x; i++) {
    if (!rows[xPosition].cells[yPosition].textContent) {
      rows[xPosition].cells[yPosition].textContent = twoOrFour();
      classForCell();
      isGameOver();
    } else {
      newCell();
    }
  }
}

function twoOrFour() {
  if (Math.random() <= 0.1) {
    return 4;
  } else {
    return 2;
  }
}

function reset() {
  scoreValue = 0;
  score.textContent = scoreValue;
  win.classList.add('hidden');
  lose.classList.add('hidden');
  gameOver = false;

  allCells.forEach((cell) => {
    cell.textContent = '';
  });
  newCell(2);
}

function classForCell() {
  allCells.forEach((cell) => {
    if (!cell.classList.contains(`field-cell--${cell.textContent}`)) {
      cell.classList.remove(...cell.classList);
      cell.classList.add(`field-cell`);
      cell.classList.add(`field-cell--${cell.textContent}`);
    }
  });
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' && buttonClicked && !gameOver) {
    sortCellsX(rows, 3, -1);
  };

  if (e.key === 'ArrowLeft' && buttonClicked && !gameOver) {
    sortCellsX(rows, 0, 1);
  };

  if (e.key === 'ArrowUp' && buttonClicked && !gameOver) {
    sortCellsY(rows, 0, 1);
  };

  if (e.key === 'ArrowDown' && buttonClicked && !gameOver) {
    sortCellsY(rows, 3, -1);
  };
});

function sortCellsY(array, index, y) {
  if (!button.classList.contains('restart')) {
    button.classList.add('restart');
    button.textContent = 'Restart';
    button.classList.remove('start');
  }

  let canMove = false;

  for (let i = 0; i < 4; i++) {
    let indexCellToCheck = index;

    for (let j = index; j !== 3 - index; j += y) {
      const checkCell = array[indexCellToCheck].children[i].textContent;
      const nextCell = array[j + y].children[i].textContent;

      if (!checkCell
       && nextCell) {
        array[indexCellToCheck].children[i].textContent = nextCell;
        array[j + y].children[i].textContent = '';
        canMove = true;
      } else if (checkCell !== nextCell && nextCell) {
        if (indexCellToCheck !== j) {
          array[indexCellToCheck + y].children[i].textContent = nextCell;
          array[j + y].children[i].textContent = '';
          canMove = true;
        }
        indexCellToCheck += y;
      } else if (checkCell === nextCell && nextCell) {
        array[indexCellToCheck].children[i].textContent = Number(nextCell) * 2;
        array[j + y].children[i].textContent = '';
        scoreValue += Number(array[indexCellToCheck].children[i].textContent);
        score.textContent = scoreValue;

        if (Number(array[indexCellToCheck].children[i].textContent) === 2048) {
          win.classList.remove('hidden');
        }
        indexCellToCheck += y;
        canMove = true;
      }
    }
  }

  if (canMove) {
    newCell();
  }
  classForCell();
};

function sortCellsX(array, index = 3, x = -1) {
  if (!button.classList.contains('restart')) {
    button.classList.add('restart');
    button.textContent = 'Restart';
    button.classList.remove('start');
  }

  let canMove = false;

  array.forEach(row => {
    const cells = row.querySelectorAll('td');

    let indexCellToCheck = index;

    for (let i = index; i !== 3 - index; i += x) {
      const checkCell = cells[indexCellToCheck].textContent;
      const nextCell = cells[i + x].textContent;

      if (!checkCell && nextCell) {
        cells[indexCellToCheck].textContent = nextCell;
        cells[i + x].textContent = '';
        canMove = true;
      } else if (checkCell !== nextCell && nextCell) {
        if (indexCellToCheck !== i) {
          cells[indexCellToCheck + x].textContent = nextCell;
          cells[i + x].textContent = '';
          canMove = true;
        }
        indexCellToCheck += x;
      } else if (checkCell === nextCell && nextCell) {
        cells[indexCellToCheck].textContent = Number(nextCell) * 2;
        cells[i + x].textContent = '';
        scoreValue += Number(cells[indexCellToCheck].textContent);
        score.textContent = scoreValue;

        if (Number(cells[indexCellToCheck].textContent) === 2048) {
          win.classList.remove('hidden');
        }
        indexCellToCheck += x;
        canMove = true;
      }
    }
  });

  if (canMove) {
    newCell();
  }
  classForCell();
}

'use strict';

// write your code here
const tbody = document.querySelector('tbody');
const container = document.querySelector('.container');
const button = document.querySelector('.button');
const allTd = document.querySelectorAll('td');
const allTr = document.querySelectorAll('tr');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const tr = document.querySelector('tr');
let clickOnLeft;
let clickOnRight;
let clickOnUp;
let clickOnDown;
let countOfMoveCells = 0;

container.addEventListener('click', (event) => {
  const item = event.target;

  if (button.textContent === 'Start' && item === button) {
    addNumber();
    startMessage.classList.add('hidden');
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  } else if (button.textContent === 'Restart' && item === button) {
    startMessage.classList.remove('hidden');

    if (!loseMessage.classList.contains('hidden')) {
      loseMessage.classList.add('hidden');
    }

    if (!winMessage.classList.contains('hidden')) {
      winMessage.classList.add('hidden');
    }

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');

    clickOnLeft = true;
    clickOnRight = true;
    clickOnUp = true;
    clickOnDown = true;
    score.textContent = 0;

    for (let w = 0; w < allTd.length; w++) {
      allTd[w].textContent = '';
    }
    addColorToCell();
  }
});

function getRandomInt(min, max) {
  // eslint-disable-next-line no-param-reassign
  min = Math.ceil(min);
  // eslint-disable-next-line no-param-reassign
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min;
};

let countOfMergeCell = 0;

container.addEventListener('keydown', (event) => {
  if (button.textContent === 'Restart') {
    switch (event.key) {
      case 'ArrowDown': arrowDown();

        if (clickOnDown) {
          winConditional();
          addNumber();
          addColorToCell();
        }
        break;
      case 'ArrowRight': arrowRight();

        if (clickOnRight) {
          winConditional();
          addNumber();
          addColorToCell();
        }
        break;
      case 'ArrowUp': arrowUp();

        if (clickOnUp) {
          winConditional();
          addNumber();
          addColorToCell();
        }
        break;
      case 'ArrowLeft': arrowLeft();

        if (clickOnLeft) {
          winConditional();
          addNumber();
          addColorToCell();
        }
        break;
      default:
        break;
    }

    if (checkLoseGame()) {
      loseMessage.classList.remove('hidden');
    }
  }
});

function addNumber() {
  let tdElement = getRandomInt(0, allTd.length);
  const probabilityToAddFour = getRandomInt(1, 11);

  do {
    tdElement = getRandomInt(0, allTd.length);
  }
  while (allTd[tdElement].textContent !== '');

  if (probabilityToAddFour === 1) {
    allTd[tdElement].textContent = '4';
  } else if (probabilityToAddFour !== 1) {
    allTd[tdElement].textContent = '2';
  }
  addColorToCell();
};

function winConditional() {
  for (let i = 0; i < allTd.length; i++) {
    if (allTd[i].textContent === '2048') {
      winMessage.classList.remove('hidden');
    }
  }
}

function addColorToCell() {
  for (let i = 0; i < allTd.length; i++) {
    if (allTd[i].textContent !== '') {
      allTd[i].classList.remove(allTd[i].classList[1]);
      allTd[i].classList.add(`field-cell--${allTd[i].textContent}`);
    }
  }

  for (let q = 0; q < allTd.length; q++) {
    if (allTd[q].textContent === '') {
      allTd[q].classList.remove(allTd[q].classList[1]);
    }
  }
}

function arrowLeft() {
  for (let i = 0; i < tbody.rows.length; i++) {
    for (let a = 0; a < tbody.rows[i].cells.length; a++) {
      for (let y = 1; y < tbody.rows[i].cells.length; y++) {
        if (tbody.rows[i].cells[y - 1].textContent === tbody.rows[i].cells[y]
          .textContent && tbody.rows[i].cells[y - 1].textContent !== ''
         && countOfMergeCell === 0) {
          tbody.rows[i].cells[y - 1].textContent = Number(tbody.rows[i]
            .cells[y].textContent)
           + Number(tbody.rows[i].cells[y - 1].textContent);
          tbody.rows[i].cells[y].textContent = '';
          countOfMergeCell++;
          countOfMoveCells++;

          score.textContent = Number(score.textContent)
           + Number(tbody.rows[i].cells[y - 1].textContent);
        } else if (tbody.rows[i].cells[y - 1].textContent === ''
         && tbody.rows[i].cells[y - 1].textContent
          !== tbody.rows[i].cells[y].textContent) {
          tbody.rows[i].cells[y - 1].textContent
        = tbody.rows[i].cells[y].textContent;
          tbody.rows[i].cells[y].textContent = '';
          countOfMoveCells++;
        }
      }
    }
    countOfMergeCell = 0;
  }

  if (countOfMoveCells === 0) {
    clickOnLeft = false;
  } else {
    clickOnLeft = true;
  }
  countOfMoveCells = 0;
}

function arrowUp() {
  for (let e = 0; e < tr.cells.length; e++) {
    for (let a = 0; a < tr.cells.length; a++) {
      for (let w = tr.cells.length + e; w < allTd.length; w = w + 4) {
        if (allTd[w - tr.cells.length].textContent !== ''
         && allTd[w - tr.cells.length].textContent
       === allTd[w].textContent && countOfMergeCell === 0) {
          allTd[w - tr.cells.length].textContent
          = Number(allTd[w - tr.cells.length].textContent)
          + Number(allTd[w].textContent);
          allTd[w].textContent = '';

          score.textContent = Number(score.textContent)
            + Number(allTd[w - tr.cells.length].textContent);
          countOfMergeCell++;
          countOfMoveCells++;
        } else if (allTd[w - tr.cells.length].textContent === ''
           && allTd[w - tr.cells.length].textContent !== allTd[w].textContent) {
          allTd[w - tr.cells.length].textContent = allTd[w].textContent;
          allTd[w].textContent = '';
          countOfMoveCells++;
        }
      }
    }
    countOfMergeCell = 0;
  }

  if (countOfMoveCells === 0) {
    clickOnUp = false;
  } else {
    clickOnUp = true;
  }
  countOfMoveCells = 0;
}

function arrowRight() {
  for (let i = 0; i < tbody.rows.length; i++) {
    for (let a = 0; a < tbody.rows[i].cells.length; a++) {
      for (let y = tbody.rows[i].cells.length - 1; y > 0; y--) {
        if (tbody.rows[i].cells[y].textContent === tbody.rows[i].cells[y - 1]
          .textContent && tbody.rows[i].cells[y].textContent !== ''
         && countOfMergeCell === 0) {
          tbody.rows[i].cells[y].textContent = Number(tbody.rows[i]
            .cells[y - 1].textContent)
           + Number(tbody.rows[i].cells[y].textContent);
          tbody.rows[i].cells[y - 1].textContent = '';
          countOfMergeCell++;
          countOfMoveCells++;

          score.textContent = Number(score.textContent)
          + Number(tbody.rows[i].cells[y].textContent);
        } else if (tbody.rows[i].cells[y].textContent === '' && tbody.rows[i]
          .cells[y].textContent !== tbody.rows[i].cells[y - 1].textContent) {
          tbody.rows[i].cells[y].textContent
         = tbody.rows[i].cells[y - 1].textContent;
          tbody.rows[i].cells[y - 1].textContent = '';
          countOfMoveCells++;
        }
      }
    }
    countOfMergeCell = 0;
  }

  if (countOfMoveCells === 0) {
    clickOnRight = false;
  } else {
    clickOnRight = true;
  }
  countOfMoveCells = 0;
}

function arrowDown() {
  for (let e = 0; e < tr.cells.length; e++) {
    for (let a = 0; a < tr.cells.length; a++) {
      for (let w = allTd.length - 1 - e; w > 3; w = w - 4) {
        if (allTd[w - tr.cells.length].textContent !== ''
         && allTd[w - tr.cells.length].textContent
         === allTd[w].textContent && countOfMergeCell === 0) {
          allTd[w].textContent
          = Number(allTd[w - tr.cells.length].textContent)
          + Number(allTd[w].textContent);
          allTd[w - tr.cells.length].textContent = '';

          score.textContent = Number(score.textContent)
          + Number(allTd[w].textContent);
          countOfMergeCell++;
          countOfMoveCells++;
        } else if (allTd[w].textContent === ''
         && allTd[w - tr.cells.length].textContent !== allTd[w].textContent) {
          allTd[w].textContent = allTd[w - tr.cells.length].textContent;
          allTd[w - tr.cells.length].textContent = '';
          countOfMoveCells++;
        }
      }
    }
    countOfMergeCell = 0;
  }

  if (countOfMoveCells === 0) {
    clickOnDown = false;
  } else {
    clickOnDown = true;
  }
  countOfMoveCells = 0;
}

function checkLoseGame() {
  for (let u = 0; u < allTd.length; u++) {
    if (allTd[u].textContent === '') {
      return false;
    }
  }

  for (let i = 0; i < allTr.length; i++) {
    for (let y = 1; y < allTr[i].cells.length; y++) {
      if (allTr[i].cells[y].textContent === allTr[i].cells[y - 1].textContent) {
        return false;
      }
    }
  }

  for (let w = allTd.length - 1; w > 3; w--) {
    if (allTd[w - tr.cells.length].textContent === allTd[w].textContent) {
      return false;
    }
  }

  return true;
}

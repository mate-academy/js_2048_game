'use strict';

const startButton = document.querySelector('button.start');
const controls = document.querySelector('.controls');
const score = document.querySelector('.game-score');

const messangeStart = document.querySelector('p.message.message-start');
const messangeWin = document.querySelector('p.message.message-win');
const messangeLose = document.querySelector('p.message.message-lose');

const cells = document.getElementsByClassName('field-cell');
const rows = document.getElementsByTagName('tr');
const arrayRows = [...rows];
const columnsArray = createColumns();

function appearCell() {
  const myArray = [...cells];

  const freeCells = myArray.filter(cell => cell.textContent === '');

  const randomItem = freeCells[Math.floor(Math.random() * freeCells.length)];
  const x = Math.random(1 - 4);

  if (freeCells.length === 0) {
    return;
  }

  if (x < 0.1) {
    randomItem.textContent = '4';
    randomItem.classList.add('field-cell--4');
  } else {
    randomItem.textContent = '2';
    randomItem.classList.add('field-cell--2');
  }
}

function scoreCounter(sum) {
  const previousScore = +score.textContent;
  const newScore = +sum + previousScore;

  score.textContent = newScore;
};

startButton.addEventListener('click', () => {
  appearCell();
  appearCell();

  const restartButton = document.createElement('button');

  restartButton.classList.add('button');
  restartButton.classList.add('restart');
  restartButton.id = 'restart';
  restartButton.textContent = 'restart';
  controls.append(restartButton);

  startButton.remove();

  restartButton.addEventListener('click', () => {
    for (const cell of cells) {
      cell.textContent = '';
      cell.className = '';
      cell.classList.add('field-cell');
    };
    appearCell();
    appearCell();
  });

  messangeStart.classList.add('hidden');
});

document.addEventListener('keydown', function(ev) {
  const key = ev.key;
  const button = document.querySelector('button');

  if (key === 'ArrowRight') {
    moveRight();
    toRight();
    moveRight();
    moveRight();
  }

  if (key === 'ArrowLeft') {
    moveLeft();
    toLeft();
    moveLeft();
    moveLeft();
  }

  if (key === 'ArrowUp') {
    moveUp();
    toUp();
    moveUp();
    moveUp();
  }

  if (key === 'ArrowDown') {
    moveDown();
    toDown();
    moveDown();
    moveDown();
  }

  if (button.className.includes('restart')) {
    appearCell();
  };

  winMessange();
  loseMessange();
});

function toRight() {
  arrayRows.forEach((el) => {
    for (let i = 3; i >= 0; i--) {
      const rowCells = el.children;

      const theCell = rowCells[i];
      const prevCell = rowCells[i - 1];

      adder(prevCell, theCell);
    };
  });
};

function moveRight() {
  arrayRows.forEach((el) => {
    for (let i = 3; i >= 0; i--) {
      const rowCells = el.children;

      const theCell = rowCells[i];
      const prevCell = rowCells[i - 1];

      mover(prevCell, theCell);
    };
  });
};

function toLeft() {
  arrayRows.forEach((el) => {
    for (let i = 0; i <= 3; i++) {
      const rowCells = el.children;

      const theCell = rowCells[i];
      const prevCell = rowCells[i + 1];

      adder(prevCell, theCell);
    };
  });
};

function moveLeft() {
  arrayRows.forEach((el) => {
    for (let i = 0; i <= 3; i++) {
      const rowCells = el.children;

      const theCell = rowCells[i];
      const prevCell = rowCells[i + 1];

      mover(prevCell, theCell);
    };
  });
};

function createColumns() {
  const column1 = [];
  const column2 = [];
  const column3 = [];
  const column4 = [];

  arrayRows.forEach((row) => {
    const rowCells = row.children;

    column1.push(rowCells[0]);
    column2.push(rowCells[1]);
    column3.push(rowCells[2]);
    column4.push(rowCells[3]);
  });

  const array = [column1, column2, column3, column4];

  return (array);
};

function moveUp() {
  columnsArray.forEach((el) => {
    for (let i = 0; i <= 3; i++) {
      const theCell = el[i];
      const prevCell = el[i + 1];

      mover(prevCell, theCell);
    };
  });
};

function toUp() {
  columnsArray.forEach((el) => {
    for (let i = 0; i <= 3; i++) {
      const theCell = el[i];
      const prevCell = el[i + 1];

      adder(prevCell, theCell);
    };
  });
};

function moveDown() {
  columnsArray.forEach((el) => {
    for (let i = 3; i >= 0; i--) {
      const theCell = el[i];
      const prevCell = el[i - 1];

      mover(prevCell, theCell);
    };
  });
};

function toDown() {
  columnsArray.forEach((el) => {
    for (let i = 3; i >= 0; i--) {
      const theCell = el[i];
      const prevCell = el[i - 1];

      adder(prevCell, theCell);
    };
  });
};

function winMessange() {
  const cellsArray = [...cells];

  for (const cell of cellsArray) {
    if (cell.textContent === '2048') {
      messangeWin.classList.remove('hidden');
    }
  }
};

function loseMessange() {
  const can = canMove();

  if (can === false) {
    messangeLose.classList.remove('hidden');
  }
};

function canMove() {
  const myArray = [...cells];
  const freeCells = myArray.filter(cell => cell.textContent === '');

  let can = 'yes';

  if (freeCells.length <= 0) {
    arrayRows.forEach((el) => {
      for (let i = 0; i <= 3; i++) {
        const rowCells = el.children;

        const theCell = rowCells[i];
        const prevCell = rowCells[i + 1];

        if (prevCell) {
          if (theCell.textContent === prevCell.textContent) {
            can = true;
          }
        }
      }
    });

    columnsArray.forEach((el) => {
      for (let i = 3; i >= 0; i--) {
        const theCell = el[i];
        const prevCell = el[i - 1];

        if (prevCell) {
          if (theCell.textContent === prevCell.textContent) {
            can = true;
          }
        }
      }
    });

    if (can !== true) {
      can = false;
    }
  }

  return can;
};

function mover(prevCell, theCell) {
  if (prevCell) {
    if (theCell.textContent === '') {
      theCell.textContent = prevCell.textContent;
      theCell.classList = prevCell.classList;

      prevCell.textContent = '';
      prevCell.className = 'field-cell';
    };
  }
};

function adder(prevCell, theCell) {
  if (prevCell) {
    if (prevCell.textContent === theCell.textContent
      && prevCell.textContent !== '') {
      const sum = `${+prevCell.textContent + +theCell.textContent}`;

      theCell.textContent = sum;
      theCell.classList = '';
      theCell.className = 'field-cell';

      theCell.classList.add(`field-cell--${theCell.textContent}`);

      prevCell.textContent = '';
      prevCell.className = 'field-cell';

      scoreCounter(sum);
    }
  }
}

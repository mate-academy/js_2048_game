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

  const freeCells = myArray.filter(cell => !cell.textContent);

  const randomItem = freeCells[Math.floor(Math.random() * freeCells.length)];
  const x = Math.random(1 - 4);

  if (!freeCells.length) {
    return;
  }

  if (x < 0.1) {
    randomItem.textContent = '4';
    randomItem.classList.add('field-cell--4');

    return;
  };
  randomItem.textContent = '2';
  randomItem.classList.add('field-cell--2');
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

  restartButton.classList.add('button', 'restart');
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
    score.textContent = '';
    messangeLose.classList.add('hidden');
  });

  messangeStart.classList.add('hidden');
});

document.addEventListener('keydown', function(e) {
  const key = e.key;
  const button = document.querySelector('button');

  switch (key) {
    case 'ArrowRight':
      moveRight();
      toRight();
      moveRight();
      moveRight();
      break;

    case 'ArrowLeft':
      moveLeft();
      toLeft();
      moveLeft();
      moveLeft();
      break;

    case 'ArrowUp':
      moveUp();
      toUp();
      moveUp();
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      toDown();
      moveDown();
      moveDown();
      break;
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

      const [prevCell, currentCell] = [rowCells[i - 1], rowCells[i]];

      adder(prevCell, currentCell);
    };
  });
};

function moveRight() {
  arrayRows.forEach((el) => {
    for (let i = 3; i >= 0; i--) {
      const rowCells = el.children;

      const [prevCell, currentCell] = [rowCells[i - 1], rowCells[i]];

      mover(prevCell, currentCell);
    };
  });
};

function toLeft() {
  arrayRows.forEach((el) => {
    for (let i = 0; i <= 3; i++) {
      const rowCells = el.children;

      const [prevCell, currentCell] = [rowCells[i + 1], rowCells[i]];

      adder(prevCell, currentCell);
    };
  });
};

function moveLeft() {
  arrayRows.forEach((el) => {
    for (let i = 0; i <= 3; i++) {
      const rowCells = el.children;

      const [prevCell, currentCell] = [rowCells[i + 1], rowCells[i]];

      mover(prevCell, currentCell);
    };
  });
};

function createColumns() {
  const board = [[], [], [], []];

  arrayRows.forEach((row) => {
    const rowCells = row.children;

    [...rowCells].forEach((_, i) => board[i].push(rowCells[i]));
  });

  return (board);
};

function moveUp() {
  columnsArray.forEach((el) => {
    for (let i = 0; i <= 3; i++) {
      const [prevCell, currentCell] = [el[i + 1], el[i]];

      mover(prevCell, currentCell);
    };
  });
};

function toUp() {
  columnsArray.forEach((el) => {
    for (let i = 0; i <= 3; i++) {
      const [prevCell, currentCell] = [el[i + 1], el[i]];

      adder(prevCell, currentCell);
    };
  });
};

function moveDown() {
  columnsArray.forEach((el) => {
    for (let i = 3; i >= 0; i--) {
      const [prevCell, currentCell] = [el[i - 1], el[i]];

      mover(prevCell, currentCell);
    };
  });
};

function toDown() {
  columnsArray.forEach((el) => {
    for (let i = 3; i >= 0; i--) {
      const [prevCell, currentCell] = [el[i - 1], el[i]];

      adder(prevCell, currentCell);
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
  if (!canMove()) {
    messangeLose.classList.remove('hidden');
  }
};

function canMove() {
  const myArray = [...cells];
  const freeCells = myArray.filter(cell => !cell.textContent);

  let can = 'yes';

  if (!freeCells.length) {
    arrayRows.forEach((el) => {
      for (let i = 0; i <= 3; i++) {
        const rowCells = el.children;

        const currentCell = rowCells[i];
        const prevCell = rowCells[i + 1];

        if (prevCell) {
          if (currentCell.textContent === prevCell.textContent) {
            can = true;
          }
        }
      }
    });

    columnsArray.forEach((el) => {
      for (let i = 3; i >= 0; i--) {
        const currentCell = el[i];
        const prevCell = el[i - 1];

        if (prevCell) {
          if (currentCell.textContent === prevCell.textContent) {
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

function mover(prevCell, currentCell) {
  if (prevCell) {
    if (!currentCell.textContent) {
      currentCell.textContent = prevCell.textContent;
      currentCell.classList = prevCell.classList;

      prevCell.textContent = '';
      prevCell.className = 'field-cell';
    };
  }
};

function adder(prevCell, currentCell) {
  if (prevCell) {
    if (prevCell.textContent === currentCell.textContent
      && prevCell.textContent !== '') {
      const sum = `${+prevCell.textContent + +currentCell.textContent}`;

      currentCell.textContent = sum;
      currentCell.classList = '';
      currentCell.className = 'field-cell';

      currentCell.classList.add(`field-cell--${currentCell.textContent}`);

      prevCell.textContent = '';
      prevCell.className = 'field-cell';

      scoreCounter(sum);
    }
  }
}

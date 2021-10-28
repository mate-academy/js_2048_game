'use strict';

const allCells = document.querySelectorAll('td');
const allRows = document.querySelectorAll('tr');
const startButton = document.querySelector('button');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
let count = 0;
let moveDetector = false;

// Click button Restart

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    [...allCells].forEach(cell => {
      cell.classList = 'field-cell';
      cell.innerText = '';
    });
    gameScore.innerText = 0;
    getNewSquare();
    getNewSquare();

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.add('hidden');
    }
    messageStart.classList.remove('hidden');
  };
});

// function for changing button Start

function changeButStart() {
  if (startButton.classList.contains('start')) {
    startButton.classList.add('restart');
    startButton.classList.remove('start');
    startButton.innerText = 'Restart';
    getNewSquare();
    getNewSquare();
  };
};

// function for creating new random square

function getNewSquare() {
  const emptyCell = [...allCells].filter(item => item.classList.length === 1);
  const numberRandomCell = Math.floor(Math.random() * emptyCell.length);
  const randomEmptyCell = emptyCell[numberRandomCell];
  const randomNum = Math.random();

  if (randomNum < 0.1) {
    randomEmptyCell.classList.add('field-cell--4');
    randomEmptyCell.innerText = '4';
  } else {
    randomEmptyCell.classList.add('field-cell--2');
    randomEmptyCell.innerText = '2';
  }
}

// function for message lose
function youLose() {
  if ([...allCells].every(item => (item.classList.length > 1))) {
    let endGame = true;
    const arrAllCells = [[...[...allRows][0].children],
      [...[...allRows][1].children],
      [...[...allRows][2].children],
      [...[...allRows][3].children],
    ];

    arrAllCells.forEach(item => {
      for (let i = 0; i < 3; i++) {
        if (item[i].innerText === item[i + 1].innerText) {
          endGame = false;

          return;
        };
      };
    });

    for (let i = 0; i < 3; i++) {
      for (let ind = 0; ind < 4; ind++) {
        const thisCell = arrAllCells[i][ind];

        if (thisCell.innerText === arrAllCells[i + 1][ind].innerText) {
          endGame = false;

          return;
        };
      };
    };

    if (endGame) {
      messageLose.classList.remove('hidden');
      messageStart.classList.add('hidden');
    };
  };
};

// function you win!

function youWin() {
  if ([...allCells].some(item => item.classList.contains('field-cell--2048'))) {
    messageWin.classList.remove('hidden');
    messageStart.classList.add('hidden');
  }
}

// EventListener on arrows keys

document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'ArrowLeft':
      [...allRows].forEach(item => {
        for (let i = 1; i < 4; i++) {
          moveCellLeft(item.children[i]);
        }
      });
      actionAfterMove();
      break;

    case 'ArrowRight':
      [...allRows].forEach(item => {
        for (let i = 3; i >= 0; i--) {
          moveCellRight(item.children[i]);
        }
      });
      actionAfterMove();
      break;

    case 'ArrowUp':
      for (let i = 1; i < 4; i++) {
        const thisRow = [...allRows][i];

        for (let index = 0; index < 4; index++) {
          const thisCell = [...thisRow.children][index];

          moveCellUp(thisCell, index);
        }
      }
      actionAfterMove();
      break;

    case 'ArrowDown':
      for (let i = 2; i >= 0; i--) {
        const thisRow = [...allRows][i];

        for (let index = 0; index < 4; index++) {
          const thisCell = [...thisRow.children][index];

          moveCellDown(thisCell, index);
        }
      }
      actionAfterMove();
      break;
  }
});

// function action after move

function actionAfterMove() {
  changeButStart();

  if (count !== 12) {
    getNewSquare();
  };
  moveDetector = false;
  count = 0;
  [...allCells].forEach(cell => cell.classList.remove('ready'));
  youLose();
  youWin();
};

// function shift to an empty cell
function shiftToEmpty(emptyElement, shiftElement) {
  emptyElement.classList = shiftElement.classList;
  emptyElement.innerText = shiftElement.innerText;
  shiftElement.classList = 'field-cell';
  shiftElement.innerText = '';
}

// function for unate the cells with the same content

function unateSameCells(moveEl, secondEl) {
  const sumNum = +moveEl.innerText * 2;

  secondEl.classList = `field-cell field-cell--${sumNum} ready`;
  secondEl.innerText = sumNum;
  moveEl.classList = 'field-cell';
  moveEl.innerText = '';
  gameScore.innerText = +gameScore.innerText + sumNum;
}

// function for move any cell

function moveCellSuchWay(element, elementTorward, functionTorward, index) {
  if (element.classList.length === 1) {
    return (count += 1);
  } else {
    if (!elementTorward) {
      return;
    } else if (elementTorward.classList.length === 1) {
      moveDetector = true;
      shiftToEmpty(elementTorward, element);
      functionTorward(elementTorward, index);
    } else if (elementTorward.innerText === element.innerText
               & !elementTorward.classList.contains('ready')) {
      unateSameCells(element, elementTorward);
    } else if (elementTorward.innerText !== element.innerText) {
      if (!moveDetector) {
        count += 1;
      }
    };
  };
};

// function for moving cells to the left

function moveCellLeft(el) {
  moveCellSuchWay(el, el.previousElementSibling, moveCellLeft);
};

// function for moving cells to the right

function moveCellRight(el) {
  moveCellSuchWay(el, el.nextElementSibling, moveCellRight);
};

// function for moving cells to the up

function moveCellUp(el, ind) {
  if (el.parentElement.previousElementSibling) {
    const previousCell = el.parentElement.previousElementSibling.children[ind];

    moveCellSuchWay(el, previousCell, moveCellUp, ind);
  };
};

// function for moving cells to the down

function moveCellDown(el, ind) {
  if (el.parentElement.nextElementSibling) {
    const nextCell = el.parentElement.nextElementSibling.children[ind];

    moveCellSuchWay(el, nextCell, moveCellDown, ind);
  }
};

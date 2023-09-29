'use strict';

const allRows = document.querySelectorAll('tr');
const startButton = document.querySelector('button');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
let count = 0;
let moveDetector = false;
let start = false;
let indUnate = [];
const arrAllCells = [[...[...allRows][0].children],
  [...[...allRows][1].children],
  [...[...allRows][2].children],
  [...[...allRows][3].children],
];
const field = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// function content from board to dom

function moveFieldToDOM() {
  for (let i = 0; i < 4; i++) {
    for (let ind = 0; ind < 4; ind++) {
      const numberCell = field[i][ind];

      if (numberCell === 0) {
        arrAllCells[i][ind].innerText = '';
        arrAllCells[i][ind].classList = 'field-cell';
      } else {
        arrAllCells[i][ind].innerText = numberCell;
        arrAllCells[i][ind].classList = `field-cell field-cell--${numberCell}`;
      };
    };
  };
};

// function for creating new random square

function getNewSquare(element) {
  const nuwRandomNum = Math.floor(Math.random() * 4);

  if (typeof (element[nuwRandomNum]) === 'number') {
    if (element[nuwRandomNum] === 0) {
      element[nuwRandomNum] = getNewRandomContent();
    } else {
      getNewSquare(element);
    }
  } else {
    if (element[nuwRandomNum].some(cell => cell === 0)) {
      getNewSquare(element[nuwRandomNum]);
    } else {
      getNewSquare(element);
    }
  }
  moveFieldToDOM();
};

// function for creating new random content

function getNewRandomContent() {
  const randomNum = Math.random();

  if (randomNum < 0.1) {
    return 4;
  } else {
    return 2;
  };
}

// Click button Restart

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('restart')) {
    field.forEach(row => {
      for (let i = 0; i < row.length; i++) {
        row[i] = 0;
      }
    });
    gameScore.innerText = 0;
    getNewSquare(field);
    getNewSquare(field);

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList.add('hidden');
    }
    messageStart.classList.remove('hidden');
  } else {
    start = true;

    field.forEach(row => {
      for (let i = 0; i < row.length; i++) {
        row[i] = 0;
      }
    });
    startButton.classList.add('restart');
    startButton.classList.remove('start');
    startButton.innerText = 'Restart';
    getNewSquare(field);
    getNewSquare(field);
  }
});

// function action after move

function actionAfterMove() {
  youWin();

  if (!youWin()) {
    if (count !== 12) {
      getNewSquare(field);
    };
    moveDetector = false;
    count = 0;
    youLose();
  };
};

function moveCellLeft(parentEl, ind, functionTorward) {
  if (parentEl[ind] === 0) {
    return (count += 1);
  } else {
    if ((ind - 1) < 0) {
      return;
    } else if (parentEl[ind - 1] === 0) {
      moveDetector = true;
      parentEl[ind - 1] = parentEl[ind];
      parentEl[ind] = 0;
      functionTorward(parentEl, ind - 1, functionTorward);
    } else if (parentEl[ind - 1] === parentEl[ind]
               & !indUnate.includes((ind - 1))) {
      const sumNum = parentEl[ind] * 2;

      parentEl[ind - 1] = sumNum;
      parentEl[ind] = 0;
      indUnate.push((ind - 1));
      gameScore.innerText = +gameScore.innerText + sumNum;
    } else if (parentEl[ind - 1] !== parentEl[ind]) {
      if (!moveDetector) {
        count += 1;
      }
    };
  };
}

function moveCellRight(parentEl, ind, functionTorward) {
  if (parentEl[ind] === 0) {
    return (count += 1);
  } else {
    if ((ind + 1) > 3) {
      return;
    } else if (parentEl[ind + 1] === 0) {
      moveDetector = true;
      parentEl[ind + 1] = parentEl[ind];
      parentEl[ind] = 0;
      functionTorward(parentEl, ind + 1, functionTorward);
    } else if (parentEl[ind + 1] === parentEl[ind]
               & !indUnate.includes((ind + 1))) {
      const sumNum = parentEl[ind] * 2;

      parentEl[ind + 1] = sumNum;
      parentEl[ind] = 0;
      indUnate.push((ind + 1));
      gameScore.innerText = +gameScore.innerText + sumNum;
    } else if (parentEl[ind + 1] !== parentEl[ind]) {
      if (!moveDetector) {
        count += 1;
      }
    };
  };
}

function moveCellUp(indRow, ind, functionTorward) {
  if (field[indRow][ind] === 0) {
    return (count += 1);
  } else {
    if ((indRow - 1) < 0) {
      return;
    } else if (field[indRow - 1][ind] === 0) {
      moveDetector = true;
      field[indRow - 1][ind] = field[indRow][ind];
      field[indRow][ind] = 0;
      functionTorward((indRow - 1), ind, functionTorward);
    } else if (field[indRow - 1][ind] === field[indRow][ind]
               & !indUnate.includes(`${indRow - 1}:${ind}`)) {
      const sumNum = field[indRow][ind] * 2;

      field[indRow - 1][ind] = sumNum;
      field[indRow][ind] = 0;
      indUnate.push(`${indRow - 1}:${ind}`);
      gameScore.innerText = +gameScore.innerText + sumNum;
    } else if (field[indRow - 1][ind] !== field[indRow][ind]) {
      if (!moveDetector) {
        count += 1;
      }
    };
  };
}

function moveCellDown(indRow, ind, functionTorward) {
  if (field[indRow][ind] === 0) {
    return (count += 1);
  } else {
    if ((indRow + 1) > 3) {
      return;
    } else if (field[indRow + 1][ind] === 0) {
      moveDetector = true;
      field[indRow + 1][ind] = field[indRow][ind];
      field[indRow][ind] = 0;
      functionTorward((indRow + 1), ind, functionTorward);
    } else if (field[indRow + 1][ind] === field[indRow][ind]
               & !indUnate.includes((`${indRow + 1}:${ind}`))) {
      const sumNum = field[indRow][ind] * 2;

      field[indRow + 1][ind] = sumNum;
      field[indRow][ind] = 0;
      indUnate.push((`${indRow + 1}:${ind}`));
      gameScore.innerText = +gameScore.innerText + sumNum;
    } else if (field[indRow + 1][ind] !== field[indRow][ind]) {
      if (!moveDetector) {
        count += 1;
      }
    };
  };
}

// EventListener on arrows keys

document.addEventListener('keydown', (e) => {
  if (start) {
    switch (e.code) {
      case 'ArrowLeft':
        field.forEach(row => {
          for (let i = 1; i < 4; i++) {
            moveCellLeft(row, i, moveCellLeft);
          };
          indUnate = [];
        });
        actionAfterMove();
        break;

      case 'ArrowRight':
        field.forEach(row => {
          for (let i = 2; i >= 0; i--) {
            moveCellRight(row, i, moveCellRight);
          };
          indUnate = [];
        });
        actionAfterMove();
        break;

      case 'ArrowUp':
        for (let i = 1; i < 4; i++) {
          for (let index = 0; index < 4; index++) {
            moveCellUp(i, index, moveCellUp);
          };
        };
        indUnate = [];
        actionAfterMove();
        break;

      case 'ArrowDown':
        for (let i = 2; i >= 0; i--) {
          for (let index = 0; index < 4; index++) {
            moveCellDown(i, index, moveCellDown);
          };
        };
        indUnate = [];
        actionAfterMove();
        break;
    }
  }
});

// function for message lose
function youLose() {
  const allCellsBoards = [...field[0], ...field[1], ...field[2], ...field[3]];

  if (allCellsBoards.every(item => item !== 0)) {
    let endGame = true;

    field.forEach(item => {
      for (let i = 0; i < 3; i++) {
        if (item[i] === item[i + 1]) {
          endGame = false;

          return;
        };
      };
    });

    for (let i = 0; i < 3; i++) {
      for (let ind = 0; ind < 4; ind++) {
        const thisCell = field[i][ind];

        if (thisCell === field[i + 1][ind]) {
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
  const allCellsBoards = [...field[0], ...field[1], ...field[2], ...field[3]];

  if (allCellsBoards.some(item => item === 2048)) {
    messageWin.classList.remove('hidden');
    messageStart.classList.add('hidden');
    start = false;
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    startButton.innerText = 'Start';

    return true;
  };
};

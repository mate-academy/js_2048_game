'use strict';

// ########################################################
// -----------------Logic and main selectors---------------
// ########################################################

let mainField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let score = 0;
const mainLength = 4;
let blockGameClick = false;

const button = document.querySelector('.button');
const fieldRows = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

// ##########################################################
// ------------------Main button logic-----------------------
// ##########################################################

button.addEventListener('click', () => {
  blockGameClick = true;

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';
    messageStart.classList.add('hidden');

    addNumber();
    addNumber();
    updateFieldCell();
  } else if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerHTML = 'Start';
    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    blockGameClick = false;

    mainField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    score = 0;
    updateFieldCell();
  }
});

// #############################################################
// ----------------------------Randomizer-----------------------
// #############################################################

function randomNumber() {
  return Math.random() >= 0.9 ? 4 : 2;
};
// #############################################################
// -----------------------Adding new number---------------------
// #############################################################

function addNumber() {
  const freeTabRows = [];

  mainField.forEach((row, indexRow) => {
    row.forEach((cell, indexCell) => {
      if (cell === 0) {
        freeTabRows.push([indexRow, indexCell]);
      }
    });
  });

  if (freeTabRows.length === 0) {
    return;
  }

  const [r, c] = freeTabRows[Math.floor(Math.random() * freeTabRows.length)];

  mainField[r][c] = randomNumber();
};
// ##########################################################################
// -----------------------Updating cells in game-----------------------------
// ##########################################################################

function updateFieldCell() {
  for (let r = 0; r < mainLength; r++) {
    for (let c = 0; c < mainLength; c++) {
      if (mainField[r][c] === 0) {
        fieldRows[r].children[c].innerHTML = '';
        fieldRows[r].children[c].className = 'field-cell';
      } else {
        fieldRows[r].children[c].innerHTML = mainField[r][c];

        fieldRows[r].children[c].className = `
        field-cell field-cell--${mainField[r][c]}
        `;
      }
    }
  }

  endOfTheGame();
  gameScore.innerHTML = score;
}

// #####################################################################
// ------------------------Arrow keys implementation--------------------
// #####################################################################

function blockGame() {
  for (let r = 0; r < mainLength; r++) {
    for (let c = 0; c < mainLength; c++) {
      if (mainField[r][c] === 2048) {
        return false;
      }
    }
  }
}

document.addEventListener('keyup', (e) => {
  if ((blockGame() === false) || blockGameClick === false) {
    return;
  }

  switch (e.code) {
    case 'ArrowRight':
      moveRight();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    default:
      return;
  }

  addNumber();
  updateFieldCell();
});

// #################################################################
// -------------Implementation of each click and slider-------------
// ##################################################################

function filterZero(row) {
  return row.filter(r => r !== 0);
}

function slider(row) {
  let newRow = row;

  newRow = filterZero(newRow);

  for (let i = 0; i < newRow.length; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      newRow[i + 1] = 0;
      score += newRow[i];

      if (newRow[i] === 2048) {
        messageWin.classList.remove('hidden');
      }
    }
  }

  newRow = filterZero(newRow);

  while (newRow.length < mainLength) {
    newRow.push(0);
  }

  return newRow;
}

// ---Moving right-----

function moveRight() {
  for (let r = 0; r < mainLength; r++) {
    let row = mainField[r];

    row.reverse();
    row = slider(row);

    mainField[r] = row.reverse();
  }
}

// ---Moving left-----

function moveLeft() {
  for (let r = 0; r < mainLength; r++) {
    let row = mainField[r];

    row = slider(row);

    mainField[r] = row;
  }
}

// ---Moving up-----

function moveUp() {
  for (let c = 0; c < mainLength; c++) {
    let row = [
      mainField[0][c], mainField[1][c], mainField[2][c], mainField[3][c],
    ];

    row = slider(row);

    for (let r = 0; r < mainLength; r++) {
      mainField[r][c] = row[r];
    }
  }
}

// ---Moving down-----

function moveDown() {
  for (let c = 0; c < mainLength; c++) {
    let row = [
      mainField[0][c], mainField[1][c], mainField[2][c], mainField[3][c],
    ];

    row.reverse();
    row = slider(row);
    row.reverse();

    for (let r = 0; r < mainLength; r++) {
      mainField[r][c] = row[r];
    }
  }
}

// #################################################################
// ----------------------Lose of the game logic----------------------
// #################################################################

function endOfTheGame() {
  const freeCell = mainField.some(r => r.some(c => c === 0));

  if (freeCell) {
    return;
  }

  for (let r = 0; r < mainLength; r++) {
    for (let c = 0; c < mainLength - 1; c++) {
      if (mainField[r][c] === mainField[r][c + 1]
        || mainField[c][r] === mainField[c + 1][r]) {
        return;
      }
    }
  }

  messageLose.classList.remove('hidden');
}

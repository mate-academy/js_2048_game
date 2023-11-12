'use strict';

const MAX_INDEX = 16;
const CELLS = document.getElementsByClassName('field-cell');
let MOVING_AVAILABLE = true;

function applyValue(tile, value) {
  tile.innerHTML = value;

  if (tile.classList.length > 1) {
    const classes = tile.classList.values();

    for (const className of classes) {
      if (className !== 'field-cell') {
        tile.classList.remove(className);
      }
    }
  }

  if (value) {
    tile.classList.add(`field-cell--${value}`);
  }

  calculateScore();
}

function calculateScore() {
  const score = document.querySelector('.game-score');
  let sum = 0;

  for (let i = 0; i < CELLS.length; i++) {
    sum += Number(CELLS[i].innerHTML);
  }

  score.innerHTML = sum;
}

function checkFor2048() {
  for (let i = 0; i < 16; i++) {
    if (Number(CELLS[i].innerHTML) === 2048) {
      MOVING_AVAILABLE = false;

      document.querySelector('.message-win')
        .classList.toggle('hidden');

      return true;
    }
  }

  return false;
}

function reset() {
  MOVING_AVAILABLE = true;
  document.querySelector('.message-start').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.game-score').innerHTML = 0;
  document.querySelector('.start').innerHTML = 'Start';

  for (let i = 0; i < CELLS.length; i++) {
    applyValue(CELLS[i], '');
  }
}

function merge(cellMergedTo, cellMergedWith) {
  applyValue(cellMergedTo, cellMergedTo.innerHTML * 2);
  applyValue(cellMergedWith, '');
}

function replace(cellReplacedTo, cellReplacedWith) {
  applyValue(cellReplacedTo, cellReplacedWith.innerHTML);
  applyValue(cellReplacedWith, '');
}

function handleMoving(direction) {
  if (!MOVING_AVAILABLE) {
    return;
  }

  let moveMade = false;

  switch (direction) {
    case 'ArrowLeft':
      for (let j = 0; j < 16; j += 4) {
        for (let i = j; i <= j + 3; i++) {
          for (let k = i + 1; k <= j + 3; k++) {
            if (CELLS[i].innerHTML !== '' && CELLS[k].innerHTML !== '') {
              if (CELLS[i].innerHTML === CELLS[k].innerHTML) {
                merge(CELLS[i], CELLS[k]);
                moveMade = true;
                break;
              } else if (
                CELLS[i].innerHTML !== CELLS[k].innerHTML
                && CELLS[i + 1].innerHTML === ''
              ) {
                replace(CELLS[i + 1], CELLS[k]);
                moveMade = true;
                break;
              } else if (
                CELLS[i].innerHTML !== CELLS[k].innerHTML
                && k === i + 1
              ) {
                break;
              }
            } else if (CELLS[i].innerHTML === '' && CELLS[k].innerHTML !== '') {
              replace(CELLS[i], CELLS[k]);
              moveMade = true;
            }
          }
        }
      }

      handleInput(moveMade);
      break;

    case 'ArrowUp':
      for (let j = 0; j < 4; j++) {
        for (let i = j; i < 16; i += 4) {
          for (let k = i + 4; k < 16; k += 4) {
            if (CELLS[i].innerHTML !== '' && CELLS[k].innerHTML !== '') {
              if (CELLS[i].innerHTML === CELLS[k].innerHTML) {
                merge(CELLS[i], CELLS[k]);
                moveMade = true;
                break;
              } else if (
                CELLS[i].innerHTML !== CELLS[k].innerHTML
                && CELLS[i + 4].innerHTML === ''
              ) {
                replace(CELLS[i + 4], CELLS[k]);
                moveMade = true;
                break;
              } else if (
                CELLS[i].innerHTML !== CELLS[k].innerHTML
                && k === i + 4
              ) {
                break;
              }
            } else if (CELLS[i].innerHTML === '' && CELLS[k].innerHTML !== '') {
              replace(CELLS[i], CELLS[k]);
              moveMade = true;
            }
          }
        }
      }

      handleInput(moveMade);
      break;

    case 'ArrowRight':
      for (let j = 3; j < 16; j += 4) {
        for (let i = j; i >= j - 3; i--) {
          for (let k = i - 1; k >= j - 3; k--) {
            if (CELLS[i].innerHTML !== '' && CELLS[k].innerHTML !== '') {
              if (CELLS[i].innerHTML === CELLS[k].innerHTML) {
                merge(CELLS[i], CELLS[k]);
                moveMade = true;
                break;
              } else if (
                CELLS[i].innerHTML !== CELLS[k].innerHTML
                && CELLS[i - 1].innerHTML === ''
              ) {
                replace(CELLS[i - 1], CELLS[k]);
                moveMade = true;
                break;
              } else if (
                CELLS[i].innerHTML !== CELLS[k].innerHTML
                && k === i - 1
              ) {
                break;
              }
            } else if (CELLS[i].innerHTML === '' && CELLS[k].innerHTML !== '') {
              replace(CELLS[i], CELLS[k]);
              moveMade = true;
            }
          }
        }
      }

      handleInput(moveMade);
      break;

    case 'ArrowDown':
      for (let j = 15; j >= 12; j--) {
        for (let i = j; i >= 0; i -= 4) {
          for (let k = i - 4; k >= 0; k -= 4) {
            if (CELLS[i].innerHTML !== '' && CELLS[k].innerHTML !== '') {
              if (CELLS[i].innerHTML === CELLS[k].innerHTML) {
                merge(CELLS[i], CELLS[k]);
                moveMade = true;
                break;
              } else if (
                CELLS[i].innerHTML !== CELLS[k].innerHTML
                && CELLS[i - 4].innerHTML === ''
              ) {
                replace(CELLS[i - 4], CELLS[k]);
                moveMade = true;
                break;
              } else if (
                CELLS[i].innerHTML !== CELLS[k].innerHTML
                && k === i - 4
              ) {
                break;
              }
            } else if (CELLS[i].innerHTML === '' && CELLS[k].innerHTML !== '') {
              replace(CELLS[i], CELLS[k]);
              moveMade = true;
            }
          }
        }
      }

      handleInput(moveMade);
      break;

    default:
      break;
  }
}

function checkMergingAvailable() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (CELLS[i * 4 + j].innerHTML === CELLS[i * 4 + j + 1].innerHTML
        || (CELLS[j * 4 + i].innerHTML === CELLS[j * 4 + i + 4].innerHTML)) {
        return true;
      }
    }
  }

  return false;
}

function checkIfMovesAvailable() {
  for (let i = 0; i < 16; i++) {
    if (CELLS[i].innerHTML === '') {
      return true;
    }
  }

  return checkMergingAvailable();
}

function inputRandom() {
  let randomIndex = Math.floor(Math.random() * MAX_INDEX);

  while (CELLS[randomIndex].innerHTML) {
    randomIndex = Math.floor(Math.random() * MAX_INDEX);
  }

  const value = Math.random() > 0.1 ? 2 : 4;

  applyValue(CELLS[randomIndex], value);
}

function handleInput(moveMade) {
  if (!moveMade) {
    return;
  }

  inputRandom();

  if (checkFor2048()) {
    return;
  }

  if (!checkIfMovesAvailable()) {
    MOVING_AVAILABLE = false;

    document.querySelector('.message-lose')
      .classList.remove('hidden');
  }
}

// ESLint wouldn't let me push, so...
// eslint-disable-next-line no-unused-vars
function startGame() {
  reset();

  for (let i = 0; i < 2; i++) {
    inputRandom();
  }
}

document.addEventListener('keydown', e => {
  document.querySelector('.start').innerHTML = 'Restart';
  handleMoving(e.key.toString());
});

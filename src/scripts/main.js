/* eslint-disable no-shadow */
/* eslint-disable max-len */
'use strict';

const startBtn = document.querySelector('.start');
const gameBoard = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

let scoreCounter = 0;
let hasButtonBeenClicked = false;
let stopGame = false;

const field = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function randomTile() {
  const randomNumber = Math.floor(Math.random() * 16);

  const fieldWithoutZero = field.every(n => n !== 0);

  if (fieldWithoutZero) {
    return;
  }

  if (field[randomNumber] !== 0) {
    return randomTile();
  }

  field[randomNumber] = Math.random() < 0.1 ? 4 : 2;

  gameBoard[randomNumber].classList.add(`field-cell--${field[randomNumber]}`);
  gameBoard[randomNumber].innerHTML = field[randomNumber];

  checkAdjacentFields();
}

function start() {
  startBtn.addEventListener('click', () => {
    if (hasButtonBeenClicked) {
      location.reload();
    } else {
      hasButtonBeenClicked = true;
      messageStart.classList.add('hidden');
      startBtn.classList.remove('start');
      startBtn.classList.add('restart');
      startBtn.innerHTML = 'Restart';
      randomTile();
      randomTile();
      move();
    }
  });
}

function merge(id, i, cell, diff) {
  let operation;

  if (diff === 'subtraction') {
    operation = id - i;
  }

  if (diff === 'add') {
    operation = id + i;
  }

  gameBoard[operation].classList.add(`field-cell--${parseInt(cell.innerHTML) * 2}`);
  gameBoard[operation].classList.remove(`field-cell--${parseInt(cell.innerHTML)}`);
  gameBoard[operation].innerHTML = parseInt(cell.innerHTML) * 2;
  cell.classList.remove(`field-cell--${cell.innerHTML}`);
  cell.innerHTML = '';

  field[id] = 0;
  field[operation] = parseInt(gameBoard[operation].innerHTML);

  scoreCounter += parseInt(gameBoard[operation].innerHTML);
  score.innerHTML = scoreCounter.toString();

  winGame();
}

function replaceTile(id, i, cell, diff) {
  let operation;

  if (diff === 'subtraction') {
    operation = id - i;
  }

  if (diff === 'add') {
    operation = id + i;
  }

  field[id] = 0;
  field[operation] = parseInt(cell.innerHTML);
  gameBoard[operation].classList.add(`field-cell--${cell.innerHTML}`);
  gameBoard[operation].innerHTML = cell.innerHTML;
  cell.classList.remove(`field-cell--${cell.innerHTML}`);
  cell.innerHTML = '';
}

function handleArrowUpEvent() {
  for (let id = 0; id < gameBoard.length; id++) {
    if (field[id] !== 0 && id > 3) {
      for (let i = 12; i > 0; i -= 4) {
        if (field[id - i] === 0) {
          replaceTile(id, i, gameBoard[id], 'subtraction');
          break;
        }

        if (
          (i === 4 && field[id - i] === field[id])
          || (i === 8 && field[id - i] === field[id] && field[id - i + 4] === 0)
          || (i === 12 && field[id - i] === field[id] && field[id - i + 4] === 0 && field[id - i + 8] === 0)
        ) {
          merge(id, i, gameBoard[id], 'subtraction');
          break;
        }
      }
    }
  }
};

function handleArrowDownEvent() {
  for (let int = gameBoard.length - 1; int >= 0; int--) {
    const id = int;

    if (field[id] !== 0 && id < 12) {
      for (let i = 12; i > 0; i -= 4) {
        if (field[id + i] === 0) {
          replaceTile(id, i, gameBoard[int], 'add');
          break;
        }

        if (
          (i === 4 && field[id + i] === field[id])
          || (i === 8 && field[id + i] === field[id] && field[id + i - 4] === 0)
          || (i === 12 && field[id + i] === field[id] && field[id + i - 4] === 0 && field[id + i - 8] === 0)
        ) {
          merge(id, i, gameBoard[int], 'add');
          break;
        }
      }
    }
  }
};

function handleArrowLeftEvent() {
  for (let id = 0; id < gameBoard.length; id++) {
    if (field[id] !== 0 && id < 16 && id > 12) {
      for (let i = 3; i > 0; i--) {
        if (field[id - i] === 0 && (id - i) >= 12) {
          replaceTile(id, i, gameBoard[id], 'subtraction');
          break;
        }

        if ((i === 1 && field[id - i] === field[id])
        || (i === 2 && field[id - i] === field[id] && field[id - i + 1] === 0)
        || (i === 3 && field[id - i] === field[id] && field[id - i + 1] === 0 && field[id - i + 2] === 0)
        ) {
          merge(id, i, gameBoard[id], 'subtraction');
          break;
        }
      }
    }

    if (field[id] !== 0 && id < 12 && id > 8) {
      for (let i = 3; i > 0; i--) {
        if (field[id - i] === 0 && (id - i) >= 8) {
          replaceTile(id, i, gameBoard[id], 'subtraction');
          break;
        }

        if ((i === 1 && field[id - i] === field[id])
        || (i === 2 && field[id - i] === field[id] && field[id - i + 1] === 0)
        || (i === 3 && field[id - i] === field[id] && field[id - i + 1] === 0 && field[id - i + 2] === 0)
        ) {
          merge(id, i, gameBoard[id], 'subtraction');
          break;
        }
      }
    }

    if (field[id] !== 0 && id < 8 && id > 4) {
      for (let i = 3; i > 0; i--) {
        if (field[id - i] === 0 && (id - i) >= 4) {
          replaceTile(id, i, gameBoard[id], 'subtraction');
          break;
        }

        if ((i === 1 && field[id - i] === field[id])
        || (i === 2 && field[id - i] === field[id] && field[id - i + 1] === 0)
        || (i === 3 && field[id - i] === field[id] && field[id - i + 1] === 0 && field[id - i + 2] === 0)
        ) {
          merge(id, i, gameBoard[id], 'subtraction');
          break;
        }
      }
    }

    if (field[id] !== 0 && id < 4 && id > 0) {
      for (let i = 3; i > 0; i--) {
        if (field[id - i] === 0) {
          replaceTile(id, i, gameBoard[id], 'subtraction');
          break;
        }

        if ((i === 1 && field[id - i] === field[id])
        || (i === 2 && field[id - i] === field[id] && field[id - i + 1] === 0)
        || (i === 3 && field[id - i] === field[id] && field[id - i + 1] === 0 && field[id - i + 2] === 0)
        ) {
          merge(id, i, gameBoard[id], 'subtraction');
          break;
        }
      }
    }
  }
};

function handleArrowRightEvent() {
  for (let id = gameBoard.length - 1; id >= 0; id--) {
    if (field[id] !== 0 && id < 15 && id > 11) {
      for (let i = 3; i > 0; i--) {
        if (field[id + i] === 0) {
          replaceTile(id, i, gameBoard[id], 'add');
          break;
        }

        if ((i === 1 && field[id + i] === field[id])
        || (i === 2 && field[id + i] === field[id] && field[id + i - 1] === 0)
        || (i === 3 && field[id + i] === field[id] && field[id + i - 1] === 0 && field[id + i - 2] === 0)
        ) {
          merge(id, i, gameBoard[id], 'add');
          break;
        }
      }
    }

    if (field[id] !== 0 && id < 11 && id > 7) {
      for (let i = 3; i > 0; i--) {
        if (field[id + i] === 0 && (id + i) <= 11) {
          replaceTile(id, i, gameBoard[id], 'add');
          break;
        }

        if ((i === 1 && field[id + i] === field[id])
        || (i === 2 && field[id + i] === field[id] && field[id + i - 1] === 0)
        || (i === 3 && field[id + i] === field[id] && field[id + i - 1] === 0 && field[id + i - 2] === 0)
        ) {
          merge(id, i, gameBoard[id], 'add');
          break;
        }
      }
    }

    if (field[id] !== 0 && id < 7 && id > 3) {
      for (let i = 3; i > 0; i--) {
        if (field[id + i] === 0 && (id + i) <= 7) {
          replaceTile(id, i, gameBoard[id], 'add');
          break;
        }

        if ((i === 1 && field[id + i] === field[id])
        || (i === 2 && field[id + i] === field[id] && field[id + i - 1] === 0)
        || (i === 3 && field[id + i] === field[id] && field[id + i - 1] === 0 && field[id + i - 2] === 0)
        ) {
          merge(id, i, gameBoard[id], 'add');
          break;
        }
      }
    }

    if (field[id] !== 0 && id < 3 && id >= 0) {
      for (let i = 3; i > 0; i--) {
        if (field[id + i] === 0 && (id + i) <= 3) {
          replaceTile(id, i, gameBoard[id], 'add');
          break;
        }

        if ((i === 1 && field[id + i] === field[id])
        || (i === 2 && field[id + i] === field[id] && field[id + i - 1] === 0)
        || (i === 3 && field[id + i] === field[id] && field[id + i - 1] === 0 && field[id + i - 2] === 0)
        ) {
          merge(id, i, gameBoard[id], 'add');
          break;
        }
      }
    }
  }
};

function move() {
  document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowUp' && !stopGame) {
      handleArrowUpEvent();
      randomTile();
    } else if (event.code === 'ArrowDown' && !stopGame) {
      handleArrowDownEvent();
      randomTile();
    } else if (event.code === 'ArrowLeft' && !stopGame) {
      handleArrowLeftEvent();
      randomTile();
    } else if (event.code === 'ArrowRight' && !stopGame) {
      handleArrowRightEvent();
      randomTile();
    }
  });
};

function winGame() {
  for (const i of field) {
    if (i === 2048) {
      messageWin.classList.remove('hidden');

      stopGame = true;
    }
  }
}

function checkAdjacentFields() {
  for (let i = 0; i < 16; i++) {
    const isLeftEdge = i % 4 === 0;
    const isRightEdge = (i + 1) % 4 === 0;

    if (
      (i < 4 && !isRightEdge && field[i] === field[i + 1])
      || (i < 12 && !isRightEdge && field[i] === field[i + 1])
      || (i >= 4 && i < 8 && !isLeftEdge && field[i] === field[i - 1])
      || (i >= 8 && i < 12 && !isLeftEdge && field[i] === field[i - 1])
      || (i < 12 && field[i] === field[i + 4])
      || (i >= 4 && field[i] === field[i - 4])
      || (i >= 12 && !isLeftEdge && field[i] === field[i - 1])
      || (i >= 12 && !isRightEdge && field[i] === field[i + 1])
    ) {
      // console.log('keep play');
      return true;
    }

    if (
      ((i === 0 || i === 4 || i === 8 || i === 12)
        && (((i + 4) % 4 === 0 && field[i] === field[i + 4])
          || ((i - 4) % 4 === 0 && field[i] === field[i - 4])))

        || ((i === 1 || i === 5 || i === 9 || i === 13)
          && (((i + 4 === 5 || i + 4 === 9 || i + 4 === 13) && field[i] === field[i + 4])
            || ((i - 4 === 9 || i - 4 === 5 || i - 4 === 1) && field[i] === field[i - 4])))

        || ((i === 2 || i === 6 || i === 10 || i === 14)
          && (((i + 4 === 6 || i + 4 === 10 || i + 4 === 14) && field[i] === field[i + 4])
            || ((i - 4 === 10 || i - 4 === 6 || i - 4 === 2) && field[i] === field[i - 4])))

        || ((i === 3 || i === 7 || i === 11 || i === 15)
          && (((i + 4 === 7 || i + 4 === 11 || i + 4 === 15) && field[i] === field[i + 4])
            || ((i - 4 === 11 || i - 4 === 7 || i - 4 === 3) && field[i] === field[i - 4])))
    ) {
      // console.log('keep play');
      return true;
    }
  }

  const copyField = [...field];

  const fieldWithoutZero = copyField.every(n => n !== 0);

  if (fieldWithoutZero) {
    messageLose.classList.remove('hidden');

    return (false);
  }
}

start();

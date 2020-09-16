'use strict';

const button = document.querySelector('button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const cell = document.querySelectorAll('td');

function random() {
  const rand = Math.floor(Math.random() * cell.length);

  if (cell[rand].innerHTML === '') {
    cell[rand].innerHTML = (Math.random() <= 0.1) ? 4 : 2;
    checkForLose();
    design();
  } else {
    random();
  }
}

function design() {
  for (let i = 0; i < cell.length; i++) {
    cell[i].className = 'field-cell';

    switch (cell[i].innerHTML) {
      case '': cell[i].className = 'field-cell';
        break;
      case '2': cell[i].classList.add('field-cell--2');
        break;
      case '4': cell[i].classList.add('field-cell--4');
        break;
      case '8': cell[i].classList.add('field-cell--8');
        break;
      case '16': cell[i].classList.add('field-cell--16');
        break;
      case '32': cell[i].classList.add('field-cell--32');
        break;
      case '64': cell[i].classList.add('field-cell--64');
        break;
      case '128': cell[i].classList.add('field-cell--128');
        break;
      case '256': cell[i].classList.add('field-cell--256');
        break;
      case '512': cell[i].classList.add('field-cell--512');
        break;
      case '1024': cell[i].classList.add('field-cell--1024');
        break;
      case '2048': cell[i].classList.add('field-cell--2048');
        break;
    }
  }
}

const board = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15]];

function moveUp() {
  for (let j = 0; j < 4; j++) {
    for (let i = 1; i < 4; i++) {
      if (cell[board[i][j]].innerHTML) {
        let row = i;

        while (row > 0) {
          if (cell[board[row - 1][j]].innerHTML === '') {
            cell[board[row - 1][j]].innerHTML = cell[board[row][j]].innerHTML;
            cell[board[row][j]].innerHTML = '';
            row--;
          } else if (cell[board[row - 1][j]].innerHTML
            === cell[board[row][j]].innerHTML) {
            cell[board[row - 1][j]].innerHTML *= 2;
            cell[board[row][j]].innerHTML = '';

            score.innerHTML = +score.innerHTML
            + (+cell[board[row - 1][j]].innerHTML);
            checkForWin();
            break;
          } else {
            break;
          }
        }
      }
    }
  }
}

function moveDown() {
  for (let j = 0; j < 4; j++) {
    for (let i = 2; i >= 0; i--) {
      if (cell[board[i][j]].innerHTML) {
        let row = i;

        while (row + 1 < 4) {
          if (cell[board[row + 1][j]].innerHTML === '') {
            cell[board[row + 1][j]].innerHTML = cell[board[row][j]].innerHTML;
            cell[board[row][j]].innerHTML = '';
            row++;
          } else if (cell[board[row + 1][j]].innerHTML
            === cell[board[row][j]].innerHTML) {
            cell[board[row + 1][j]].innerHTML *= 2;
            cell[board[row][j]].innerHTML = '';

            score.innerHTML = +score.innerHTML
            + (+cell[board[row + 1][j]].innerHTML);
            checkForWin();
            break;
          } else {
            break;
          }
        }
      }
    }
  }
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    for (let j = 2; j >= 0; j--) {
      if (cell[board[i][j]].innerHTML) {
        let col = j;

        while (col + 1 < 4) {
          if (cell[board[i][col + 1]].innerHTML === '') {
            cell[board[i][col + 1]].innerHTML = cell[board[i][col]].innerHTML;
            cell[board[i][col]].innerHTML = '';
            col++;
          } else if (cell[board[i][col]].innerHTML
            === cell[board[i][col + 1]].innerHTML) {
            cell[board[i][col + 1]].innerHTML *= 2;
            cell[board[i][col]].innerHTML = '';

            score.innerHTML = +score.innerHTML
            + (+cell[board[i][col + 1]].innerHTML);
            checkForWin();
            break;
          } else {
            break;
          }
        }
      }
    }
  }
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      if (cell[board[i][j]].innerHTML) {
        let col = j;

        while (col - 1 >= 0) {
          if (cell[board[i][col - 1]].innerHTML === '') {
            cell[board[i][col - 1]].innerHTML = cell[board[i][col]].innerHTML;
            cell[board[i][col]].innerHTML = '';
            col--;
          } else if (cell[board[i][col]].innerHTML
            === cell[board[i][col - 1]].innerHTML) {
            cell[board[i][col - 1]].innerHTML *= 2;
            cell[board[i][col]].innerHTML = '';

            score.innerHTML = +score.innerHTML
            + (+cell[board[i][col - 1]].innerHTML);
            checkForWin();
            break;
          } else {
            break;
          }
        }
      }
    }
  }
}

function startGame(event) {
  const codes = event.keyCode;

  switch (codes) {
    case 38:
      moveUp();
      random();
      design();
      break;
    case 40:
      moveDown();
      random();
      design();
      break;
    case 37:
      moveLeft();
      random();
      design();
      break;
    case 39:
      moveRight();
      random();
      design();
      break;
  }
}

button.addEventListener('click', () => {
  messageStart.hidden = true;
  button.innerHTML = 'Restart';
  button.classList.add('restart');
  button.classList.remove('start');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  score.innerHTML = '0';
  cleanTable();
  random();
  random();
  document.addEventListener('keydown', startGame);
});

function cleanTable() {
  [...cell].map(el => {
    el.textContent = '';
  });
}

function checkForWin() {
  for (let i = 0; i < cell.length; i++) {
    if (+cell[i].innerHTML === 2048) {
      messageWin.classList.remove('hidden');
      document.removeEventListener('keydown', startGame);
    }
  }
}

function checkForLose() {
  let count = 0;

  for (let i = 0; i < cell.length; i++) {
    if (cell[i].innerHTML === '') {
      count++;
    }
  }

  if (count === 0) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', startGame);
  }
};

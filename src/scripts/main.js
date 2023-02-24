'use strict';

const buttonStart = document.querySelector('.button');
const field = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const randomNumber = () => Math.floor(Math.random() * 4);
let score = 0;

buttonStart.addEventListener('click', () => {
  fieldCells.forEach(cell => {
    cell.innerHTML = 0;
  });

  score = 0;
  gameScore.innerHTML = 0;

  generate();
  generate();

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  buttonStart.classList.remove('start');
  buttonStart.classList.add('restart');
  buttonStart.textContent = 'Restart';

  changeCellColor();
  hiddenZero();
});

document.addEventListener('keydown', (e) => {
  if (!messageWin.classList.contains('hidden')
    || buttonStart.classList.contains('start')) {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      moveLeft();
      sumCells();
      moveLeft();
      generate();
      changeCellColor();
      hiddenZero();
      showLoseMessage();
      break;
    case 'ArrowRight':
      moveRight();
      sumCells();
      moveRight();
      generate();
      changeCellColor();
      hiddenZero();
      showLoseMessage();
      break;
    case 'ArrowUp':
      moveUp();
      sumColumns();
      moveUp();
      generate();
      changeCellColor();
      hiddenZero();
      showLoseMessage();
      break;
    case 'ArrowDown':
      moveDown();
      sumColumns();
      moveDown();
      generate();
      changeCellColor();
      hiddenZero();
      showLoseMessage();
      break;
  }
});

function generate() {
  const randomCell = field.rows[randomNumber()].cells[randomNumber()];

  if (randomCell.innerHTML === '0') {
    randomCell.innerHTML = (Math.random() < 0.1) ? '4' : '2';
  } else {
    generate();
  }
};

function hiddenZero() {
  fieldCells.forEach(cell => {
    if (+cell.innerHTML === 0) {
      cell.style.color = '#d6cdc4';
    } else {
      cell.style.color = '';
    }
  });
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    const row = [];

    for (let j = 0; j < 4; j++) {
      const cell = +field.rows[i].cells[j].innerHTML;

      row.push(cell);
    }

    const numbers = row.filter(num => num);

    const empties = 4 - numbers.length;
    const zeros = Array(empties).fill(0);

    const newRow = numbers.concat(zeros);

    for (let j = 0; j < 4; j++) {
      field.rows[i].cells[j].innerHTML = newRow[j];
    }
  }
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    const row = [];

    for (let j = 0; j < 4; j++) {
      const cell = +field.rows[i].cells[j].innerHTML;

      row.push(cell);
    }

    const numbers = row.filter(num => num);

    const empties = 4 - numbers.length;
    const zeros = Array(empties).fill(0);

    const newRow = zeros.concat(numbers);

    for (let j = 0; j < 4; j++) {
      field.rows[i].cells[j].innerHTML = newRow[j];
    }
  }
}

function moveUp() {
  for (let i = 0; i < 4; i++) {
    const column = [];

    for (let j = 0; j < 4; j++) {
      const cell = +field.rows[j].cells[i].innerHTML;

      column.push(cell);
    }

    const numbers = column.filter(num => num);

    const empties = 4 - numbers.length;
    const zeros = Array(empties).fill(0);

    const newColumn = numbers.concat(zeros);

    for (let j = 0; j < 4; j++) {
      field.rows[j].cells[i].innerHTML = newColumn[j];
    }
  }
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    const column = [];

    for (let j = 0; j < 4; j++) {
      const cell = +field.rows[j].cells[i].innerHTML;

      column.push(cell);
    }

    const numbers = column.filter(num => num);

    const empties = 4 - numbers.length;
    const zeros = Array(empties).fill(0);

    const newColumn = zeros.concat(numbers);

    for (let j = 0; j < 4; j++) {
      field.rows[j].cells[i].innerHTML = newColumn[j];
    }
  }
}

function sumCells() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (+field.rows[i].cells[j].innerHTML
        === +field.rows[i].cells[j + 1].innerHTML) {
        const sum = +field.rows[i].cells[j].innerHTML * 2;

        field.rows[i].cells[j].innerHTML = sum;
        field.rows[i].cells[j + 1].innerHTML = 0;
        score += sum;
        gameScore.innerHTML = score;
      }
    }
  }

  showWinMessage();
}

function sumColumns() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (+field.rows[j].cells[i].innerHTML
        === +field.rows[j + 1].cells[i].innerHTML) {
        const sum = +field.rows[j].cells[i].innerHTML * 2;

        field.rows[j].cells[i].innerHTML = sum;
        field.rows[j + 1].cells[i].innerHTML = 0;
        score += sum;
        gameScore.innerHTML = score;
      }
    }
  }

  showWinMessage();
}

function showWinMessage() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (+field.rows[i].cells[j].innerHTML === 2048) {
        messageWin.classList.toggle('hidden');
      }
    }
  }
}

function showLoseMessage() {
  let isGameStopped = false;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (+field.rows[j].cells[i].innerHTML
          === +field.rows[j + 1].cells[i].innerHTML
        || +field.rows[i].cells[j].innerHTML
          === +field.rows[i].cells[j + 1].innerHTML
        || +field.rows[i].cells[j].innerHTML === 0
      ) {
        return;
      } else {
        isGameStopped = true;
      }
    }
  }

  if (isGameStopped) {
    messageLose.classList.toggle('hidden');
  }
}

function changeCellColor() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (field.rows[i].cells[j].innerHTML === '0') {
        field.rows[i].cells[j].className = 'field-cell';
      } else {
        field.rows[i].cells[j].className = `
          field-cell field-cell--${field.rows[i].cells[j].innerHTML}
        `;
      }
    }
  }
}

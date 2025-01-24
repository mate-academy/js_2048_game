'use strict';

let scoreValue = 0;
const score = document.querySelector('.game-score');
const button = document.querySelector('.start');
const elements = document.querySelectorAll('.field-cell');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const massageStart = document.querySelector('.message-start');

button.addEventListener('click', () => {
  massageStart.style.display = 'none';
  startGame();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      goUp();
      break;
    case 'ArrowDown':
      goDown();
      break;
    case 'ArrowLeft':
      goLeft();
      break;
    case 'ArrowRight':
      goRight();
      break;
  }
});

function startGame() {
  restart();
  addRandomNumber();
  addRandomNumber();
}

function addRandomNumber() {
  const emptyCells = Array.from(elements).filter((el) => !el.textContent);

  if (emptyCells.length > 0) {
    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newValue = selectNumber();

    randomCell.className = `field-cell field-cell--${newValue}`;
    randomCell.textContent = `${newValue}`;
  }
}

function selectNumber() {
  return Math.random() > 0.1 ? 2 : 4;
}

function restart() {
  scoreValue = 0;
  score.innerHTML = `${scoreValue}`;

  elements.forEach((element) => {
    element.className = 'field-cell';
    element.textContent = '';
  });

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  button.className = 'button restart';
  button.innerHTML = 'Restart';
}

function goUp() {
  move('up');
  getStatus();
}

function goDown() {
  move('down');
  getStatus();
}

function goLeft() {
  move('left');
  getStatus();
}

function goRight() {
  move('right');
  getStatus();
}

function move(direction) {
  const size = 4;
  let moved = false;

  for (let i = 0; i < size; i++) {
    const line = [];

    for (let j = 0; j < size; j++) {
      const index = digitDirection(i, j, size, direction);
      const value = parseInt(elements[index].textContent) || 0;

      if (value !== 0) {
        line.push(value);
      }
    }

    const combined = combineValues(line);

    for (let j = 0; j < size; j++) {
      const index = digitDirection(i, j, size, direction);

      if (combined[j] !== undefined) {
        elements[index].className = `field-cell field-cell--${combined[j]}`;
        elements[index].textContent = `${combined[j]}`;
      } else {
        elements[index].className = 'field-cell';
        elements[index].textContent = '';
      }
    }

    if (line.length > 0) {
      moved = true;
    }
  }

  if (moved) {
    addRandomNumber();
  }
}

function digitDirection(i, j, size, direction) {
  if (direction === 'up') {
    return j * size + i;
  }

  if (direction === 'down') {
    return (size - 1 - j) * size + i;
  }

  if (direction === 'left') {
    return i * size + j;
  }

  if (direction === 'right') {
    return i * size + (size - 1 - j);
  }
}

function combineValues(values) {
  for (let i = 0; i < values.length - 1; i++) {
    if (values[i] === values[i + 1]) {
      values[i] *= 2;
      getScore(values[i]);
      values.splice(i + 1, 1);
    }
  }

  return values;
}

function getScore(value) {
  scoreValue += value;
  score.innerHTML = `${scoreValue}`;
}

function getState() {
  const size = 4;
  const state = [];
  let movesAvailable = false;
  let gameWon = false;

  for (let i = 0; i < size; i++) {
    const row = [];

    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      const value = parseInt(elements[index].textContent) || 0;

      row.push(value);

      if (value === 0) {
        movesAvailable = true;
      } else {
        if (
          i > 0 &&
          value === (parseInt(elements[index - size].textContent) || 0)
        ) {
          movesAvailable = true;
        }

        if (
          j > 0 &&
          value === (parseInt(elements[index - 1].textContent) || 0)
        ) {
          movesAvailable = true;
        }
      }

      if (value === 2048) {
        gameWon = true;
      }
    }
    state.push(row);
  }

  return { state, movesAvailable, gameWon };
}

function getStatus() {
  const { movesAvailable, gameWon } = getState();

  if (gameWon) {
    winMessage.classList.remove('hidden');
  }

  if (!movesAvailable && !gameWon) {
    loseMessage.classList.remove('hidden');
  }
}

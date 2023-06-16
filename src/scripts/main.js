'use strict';

Array.prototype.random = function() {
  return this[Math.floor((Math.random() * this.length))];
};

const game = document.querySelector('.container');
const startButton = game.querySelector('.button');
const messages = game.querySelector('.message-container');
const gameField = game.querySelectorAll('.field-cell');
const startMessage = messages.querySelector('.message-start');
const loseMessage = messages.querySelector('.message-lose');
const winMessage = messages.querySelector('.message-win');
const score = game.querySelector('.game-score');
const fields = {};
const colorClasses = ['field-cell--2', 'field-cell--4',
  'field-cell--8', 'field-cell--16', 'field-cell--32',
  'field-cell--64', 'field-cell--128', 'field-cell--256',
  'field-cell--512', 'field-cell--1024', 'field-cell--2048'];
const directions = {
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
};
const finalResult = 2048;
let curScore = 0;

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    startMessage.classList.add('hidden');

    [...gameField].forEach((field, i) => {
      fields[i] = field.innerText;
    });

    generateFirst(fields);
  } else if (startButton.classList.contains('restart')) {
    gameField.forEach(field => {
      field.innerText = '';
      field.classList.remove(...colorClasses);
    });

    for (let i = 0; i < 16; i++) {
      fields[i] = '';
    }

    generateFirst(fields);

    score.innerHTML = 0;
    curScore = 0;
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
  }
});

document.addEventListener('keydown', event => {
  if (!startButton.classList.contains('start')
    && loseMessage.classList.contains('hidden')
    && winMessage.classList.contains('hidden')) {
    switch (event.key) {
      case directions.ArrowUp:
        move(directions.ArrowUp, fields);
        rematch(fields);
        break;
      case directions.ArrowDown:
        move(directions.ArrowDown, fields);
        rematch(fields);
        break;
      case directions.ArrowLeft:
        move(directions.ArrowLeft, fields);
        rematch(fields);
        break;
      case directions.ArrowRight:
        move(directions.ArrowRight, fields);
        rematch(fields);
        break;
      default:
        return;
    }

    let freeFields = Object
      .keys(Object
        .fromEntries(Object
          .entries(fields)
          .filter(x => x[1] === '')));

    if (freeFields.length > 0) {
      const randomField = freeFields.random();
      const addedNumber = Math.random() >= 0.1
        ? 2
        : 4;

      fields[randomField] = addedNumber;
      gameField[+randomField].textContent = addedNumber;
    }

    freeFields = Object
      .keys(Object
        .fromEntries(Object
          .entries(fields)
          .filter(x => x[1] === '')));

    paint(gameField);

    score.innerHTML = curScore;

    const isLose = lose(fields);

    if (checkWin(fields)) {
      winMessage.classList.remove('hidden');
    }

    if (freeFields.length === 0 && isLose) {
      loseMessage.classList.remove('hidden');
    }
  }
});

const lose = (fields) => {
  const endArray = [3, 7, 11, 15];
  let counter = 0;

  for (let i = 0; i <= 15; i++) {
    if (
      ((fields[i] !== fields[i + 1] && !endArray.includes(i))
        || (endArray.includes(i) && fields[i] !== fields[i - 1]))
      && fields[i] !== fields[i + 4]) {
      counter++;
    }
  }

  return counter === 16;
};

const checkWin = (object) => {
  const values = Object.values(object);

  return values.some(value => value === finalResult);
};

const move = (direction, object) => {
  const cycles = {
    i: 0,
    limit() {
      return this.i <= 0;
    },
    increment: 1,
    indexFirst: 0,
    indexSecond: 0,
    indexThird: 0,
  };

  const firstCycle = {};
  const secondCycle = {};
  const thirdCycle = {};

  Object.setPrototypeOf(firstCycle, cycles);
  Object.setPrototypeOf(secondCycle, cycles);
  Object.setPrototypeOf(thirdCycle, cycles);

  switch (direction) {
    case directions.ArrowUp:
      cycles.increment = 1;
      cycles.indexFirst = -4;
      cycles.indexSecond = -8;
      cycles.indexThird = -12;

      firstCycle.i = 4;

      firstCycle.limit = function() {
        return this.i <= 7;
      };

      secondCycle.i = 8;

      secondCycle.limit = function() {
        return this.i <= 11;
      };

      thirdCycle.i = 12;

      thirdCycle.limit = function() {
        return this.i <= 15;
      };
      break;
    case directions.ArrowDown:
      cycles.increment = -1;
      cycles.indexFirst = 4;
      cycles.indexSecond = 8;
      cycles.indexThird = 12;

      firstCycle.i = 11;

      firstCycle.limit = function() {
        return this.i >= 8;
      };

      secondCycle.i = 7;

      secondCycle.limit = function() {
        return this.i >= 4;
      };

      thirdCycle.i = 3;

      thirdCycle.limit = function() {
        return this.i >= 0;
      };
      break;
    case directions.ArrowLeft:
      cycles.increment = 4;
      cycles.indexFirst = -1;
      cycles.indexSecond = -2;
      cycles.indexThird = -3;

      firstCycle.i = 1;

      firstCycle.limit = function() {
        return this.i <= 13;
      };

      secondCycle.i = 2;

      secondCycle.limit = function() {
        return this.i <= 14;
      };

      thirdCycle.i = 3;

      thirdCycle.limit = function() {
        return this.i <= 15;
      };
      break;
    case directions.ArrowRight:
      cycles.increment = 4;
      cycles.indexFirst = 1;
      cycles.indexSecond = 2;
      cycles.indexThird = 3;

      firstCycle.i = 2;

      firstCycle.limit = function() {
        return this.i <= 14;
      };

      secondCycle.i = 1;

      secondCycle.limit = function() {
        return this.i <= 13;
      };

      thirdCycle.i = 0;

      thirdCycle.limit = function() {
        return this.i <= 12;
      };
      break;
  }

  for (let i = firstCycle.i; firstCycle.limit(); i += firstCycle.increment) {
    if (object[i] === object[i + firstCycle.indexFirst]
        && checkField(object[i])) {
      object[i + firstCycle.indexFirst] = newNumber(object[i]);
      curScore += newNumber(object[i]);
      object[i] = '';
    } else if (object[i + firstCycle.indexFirst] === '') {
      object[i + firstCycle.indexFirst] = object[i];
      object[i] = '';
    }

    firstCycle.i += firstCycle.increment;
  }

  for (let i = secondCycle.i; secondCycle.limit(); i += secondCycle.increment) {
    if (object[i] === object[i + secondCycle.indexFirst]
        && checkField(object[i])) {
      object[i + secondCycle.indexFirst] = newNumber(object[i]);
      curScore += newNumber(object[i]);
      object[i] = '';
    } else if (object[i + secondCycle.indexFirst] === '') {
      if (object[i + secondCycle.indexSecond] === object[i]
          && checkField(object[i])) {
        object[i + secondCycle.indexSecond] = newNumber(object[i]);
        curScore += newNumber(object[i]);
        object[i] = '';
      } else if (object[i + secondCycle.indexSecond] === '') {
        object[i + secondCycle.indexSecond] = object[i];
        object[i] = '';
      } else {
        object[i + secondCycle.indexFirst] = object[i];
        object[i] = '';
      }
    }

    secondCycle.i += secondCycle.increment;
  }

  for (let i = thirdCycle.i; thirdCycle.limit(); i += thirdCycle.increment) {
    if (object[i] === object[i + thirdCycle.indexFirst]
        && checkField(object[i])) {
      object[i + thirdCycle.indexFirst] = newNumber(object[i]);
      curScore += newNumber(object[i]);
      object[i] = '';
    } else if (object[i + thirdCycle.indexFirst] === '') {
      if (object[i + thirdCycle.indexSecond] === object[i]
          && checkField(object[i])) {
        object[i + thirdCycle.indexSecond] = newNumber(object[i]);
        curScore += newNumber(object[i]);
        object[i] = '';
      } else if (object[i + thirdCycle.indexSecond] === '') {
        if (object[i + thirdCycle.indexThird] === object[i]
            && checkField(object[i])) {
          object[i + thirdCycle.indexThird] = newNumber(object[i]);
          curScore += newNumber(object[i]);
          object[i] = '';
        } else if (object[i + thirdCycle.indexThird] === '') {
          object[i + thirdCycle.indexThird] = object[i];
          object[i] = '';
        } else {
          object[i + thirdCycle.indexSecond] = object[i];
          object[i] = '';
        }
      } else {
        object[i + thirdCycle.indexFirst] = object[i];
        object[i] = '';
      }
    }

    thirdCycle.i += thirdCycle.increment;
  }
};

const rematch = (fields) => {
  for (let i = 0; i <= 15; i++) {
    gameField[i].textContent = fields[i];
  }
};

const checkField = (field) => field !== '';

const paint = (gameField) => {
  gameField.forEach(field => {
    switch (field.textContent) {
      case '2':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--2');
        break;
      case '4':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--4');
        break;
      case '8':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--8');
        break;
      case '16':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--16');
        break;
      case '32':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--32');
        break;
      case '64':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--64');
        break;
      case '128':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--128');
        break;
      case '256':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--256');
        break;
      case '512':
        field.classList.add('field-cell--512');
        break;
      case '1024':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--1024');
        break;
      case '2048':
        field.classList.remove(...colorClasses);
        field.classList.add('field-cell--2048');
        break;
      default:
        field.classList.remove(...colorClasses);
    }
  });
};

const generateFirst = (object) => {
  const keys = Object.keys(object);
  const firstRandomField = keys.random();

  keys.splice(firstRandomField, 1);

  const secondRandomField = keys.random();

  const addedNumber = () => {
    return Math.random() >= 0.1
      ? 2
      : 4;
  };

  const first = addedNumber();
  const second = addedNumber();

  fields[firstRandomField] = first;
  fields[secondRandomField] = second;
  gameField[+firstRandomField].textContent = first;
  gameField[+secondRandomField].textContent = second;

  paint(gameField);
};

const newNumber = (str) => Number(str) * 2;

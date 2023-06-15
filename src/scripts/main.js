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

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    startMessage.classList.add('hidden');

    [...gameField].forEach((field, i) => {
      fields[i] = field.innerText;
    });
  } else if (startButton.classList.contains('restart')) {
    gameField.forEach(field => {
      field.innerText = '';
      field.classList.remove(...colorClasses);
    });

    for (let i = 0; i < 16; i++) {
      fields[i] = '';
    }
    score.innerHTML = 0;
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
        upArrow(fields);
        rematch(fields);
        break;
      case directions.ArrowDown:
        downArrow(fields);
        rematch(fields);
        break;
      case directions.ArrowLeft:
        leftArrow(fields);
        rematch(fields);
        break;
      case directions.ArrowRight:
        rightArrow(fields);
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

    const randomField = freeFields.random();
    const addedNumber = Math.random() >= 0.1
      ? 2
      : 4;

    fields[randomField] = addedNumber;
    gameField[+randomField].textContent = addedNumber;

    freeFields = Object
      .keys(Object
        .fromEntries(Object
          .entries(fields)
          .filter(x => x[1] === '')));

    paint(gameField);

    score.innerHTML = Object.values(fields).reduce((a, b) => +a + +b);

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

const upArrow = (fields) => {
  for (let i = 4; i <= 7; i++) {
    if (fields[i] === fields[i - 4] && checkField(fields[i])) {
      fields[i - 4] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i - 4] === '') {
      fields[i - 4] = fields[i];
      fields[i] = '';
    }
  }

  for (let i = 8; i <= 11; i++) {
    if (fields[i] === fields[i - 4] && checkField(fields[i])) {
      fields[i - 4] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i - 4] === '') {
      if (fields[i - 8] === fields[i] && checkField(fields[i])) {
        fields[i - 8] = Number(fields[i]) * 2;
        fields[i] = '';
      } else if (fields[i - 8] === '') {
        fields[i - 8] = fields[i];
        fields[i] = '';
      } else {
        fields[i - 4] = fields[i];
        fields[i] = '';
      }
    }
  }

  for (let i = 12; i <= 15; i++) {
    if (fields[i] === fields[i - 4] && checkField(fields[i])) {
      fields[i - 4] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i - 4] === '') {
      if (fields[i - 8] === fields[i] && checkField(fields[i])) {
        fields[i - 8] = Number(fields[i]) * 2;
        fields[i] = '';
      } else if (fields[i - 8] === '') {
        if (fields[i - 12] === fields[i] && checkField(fields[i])) {
          fields[i - 12] = Number(fields[i]) * 2;
          fields[i] = '';
        } else if (fields[i - 12] === '') {
          fields[i - 12] = fields[i];
          fields[i] = '';
        } else {
          fields[i - 8] = fields[i];
          fields[i] = '';
        }
      } else {
        fields[i - 4] = fields[i];
        fields[i] = '';
      }
    }
  }
};

const downArrow = (fields) => {
  for (let i = 11; i >= 8; i--) {
    if (fields[i] === fields[i + 4] && checkField(fields[i])) {
      fields[i + 4] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i + 4] === '') {
      fields[i + 4] = fields[i];
      fields[i] = '';
    }
  }

  for (let i = 7; i >= 4; i--) {
    if (fields[i] === fields[i + 4] && checkField(fields[i])) {
      fields[i + 4] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i + 4] === '') {
      if (fields[i + 8] === fields[i] && checkField(fields[i])) {
        fields[i + 8] = Number(fields[i]) * 2;
        fields[i] = '';
      } else if (fields[i + 8] === '') {
        fields[i + 8] = fields[i];
        fields[i] = '';
      } else {
        fields[i + 4] = fields[i];
        fields[i] = '';
      }
    }
  }

  for (let i = 3; i >= 0; i--) {
    if (fields[i] === fields[i + 4] && checkField(fields[i])) {
      fields[i + 4] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i + 4] === '') {
      if (fields[i + 8] === fields[i] && checkField(fields[i])) {
        fields[i + 8] = Number(fields[i]) * 2;
        fields[i] = '';
      } else if (fields[i + 8] === '') {
        if (fields[i + 12] === fields[i] && checkField(fields[i])) {
          fields[i + 12] = Number(fields[i]) * 2;
          fields[i] = '';
        } else if (fields[i + 12] === '') {
          fields[i + 12] = fields[i];
          fields[i] = '';
        } else {
          fields[i + 8] = fields[i];
          fields[i] = '';
        }
      } else {
        fields[i + 4] = fields[i];
        fields[i] = '';
      }
    }
  }
};

const leftArrow = (fields) => {
  for (let i = 1; i <= 13; i += 4) {
    if (fields[i] === fields[i - 1] && checkField(fields[i])) {
      fields[i - 1] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i - 1] === '') {
      fields[i - 1] = fields[i];
      fields[i] = '';
    }
  }

  for (let i = 2; i <= 14; i += 4) {
    if (fields[i] === fields[i - 1] && checkField(fields[i])) {
      fields[i - 1] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i - 1] === '') {
      if (fields[i - 2] === fields[i] && checkField(fields[i])) {
        fields[i - 2] = Number(fields[i]) * 2;
        fields[i] = '';
      } else if (fields[i - 2] === '') {
        fields[i - 2] = fields[i];
        fields[i] = '';
      } else {
        fields[i - 1] = fields[i];
        fields[i] = '';
      }
    }
  }

  for (let i = 3; i <= 15; i += 4) {
    if (fields[i] === fields[i - 1] && checkField(fields[i])) {
      fields[i - 1] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i - 1] === '') {
      if (fields[i - 2] === fields[i] && checkField(fields[i])) {
        fields[i - 2] = Number(fields[i]) * 2;
        fields[i] = '';
      } else if (fields[i - 2] === '') {
        if (fields[i - 3] === fields[i] && checkField(fields[i])) {
          fields[i - 3] = Number(fields[i]) * 2;
          fields[i] = '';
        } else if (fields[i - 3] === '') {
          fields[i - 3] = fields[i];
          fields[i] = '';
        } else {
          fields[i - 2] = fields[i];
          fields[i] = '';
        }
      } else {
        fields[i - 1] = fields[i];
        fields[i] = '';
      }
    }
  }
};

const rightArrow = (fields) => {
  for (let i = 2; i <= 14; i += 4) {
    if (fields[i] === fields[i + 1] && checkField(fields[i])) {
      fields[i + 1] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i + 1] === '') {
      fields[i + 1] = fields[i];
      fields[i] = '';
    }
  }

  for (let i = 1; i <= 13; i += 4) {
    if (fields[i] === fields[i + 1] && checkField(fields[i])) {
      fields[i + 1] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i + 1] === '') {
      if (fields[i + 2] === fields[i] && checkField(fields[i])) {
        fields[i + 2] = Number(fields[i]) * 2;
        fields[i] = '';
      } else if (fields[i + 2] === '') {
        fields[i + 2] = fields[i];
        fields[i] = '';
      } else {
        fields[i + 1] = fields[i];
        fields[i] = '';
      }
    }
  }

  for (let i = 0; i <= 12; i += 4) {
    if (fields[i] === fields[i + 1] && checkField(fields[i])) {
      fields[i + 1] = Number(fields[i]) * 2;
      fields[i] = '';
    } else if (fields[i + 1] === '') {
      if (fields[i + 2] === fields[i] && checkField(fields[i])) {
        fields[i + 2] = Number(fields[i]) * 2;
        fields[i] = '';
      } else if (fields[i + 2] === '') {
        if (fields[i + 3] === fields[i] && checkField(fields[i])) {
          fields[i + 3] = Number(fields[i]) * 2;
          fields[i] = '';
        } else if (fields[i + 3] === '') {
          fields[i + 3] = fields[i];
          fields[i] = '';
        } else {
          fields[i + 2] = fields[i];
          fields[i] = '';
        }
      } else {
        fields[i + 1] = fields[i];
        fields[i] = '';
      }
    }
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

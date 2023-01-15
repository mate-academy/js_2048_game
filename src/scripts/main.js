'use strict';

const rows = document.querySelectorAll('.field-row');
const score = document.querySelector('.game-score');
const message = document.querySelector('.message-lose');
const win = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const scoreAnimation = document.querySelector('.score-animation');
const button = document.querySelector('.button');

let arrayObject = [[], [], [], []];
let scoreGame = 0;
let gameStart = false;

class Ceil {
  constructor(value, position) {
    this.value = value;
    this.position = position;
  }

  setValue(number) {
    this.value = number;
  }

  getValue() {
    return this.value;
  }
}

/* auxiliary functions */

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const createGridElements = () => {
  for (let i = 0; i < rows.length; i++) {
    for (let q = 0; q < rows[i].children.length; q++) {
      if (arrayObject[i].length < 4) {
        arrayObject[i].push(
          new Ceil(0, rows[i].children[q])
        );
      }
    }
  }

  for (let i = 0; i < 2; i++) {
    getRandomElement(getRandomElement(arrayObject)
      .filter(el => el.getValue() === 0)).value
      = getRandomElement([2, 4]);
  }
};

const renderElements = (array) => {
  array.forEach(el => {
    el.forEach(item => {
      item.position.innerHTML = '';

      if (item.position.classList[1]) {
        item.position.classList.remove(item.position.classList[1]);
      }
    });
  });
  score.innerHTML = '0';

  array.forEach(el => {
    el.forEach(item => {
      if (item.getValue()) {
        item.position.innerHTML = item.getValue();
        item.position.classList.add(`field-cell--${item.getValue()}`);
      }
    });
  });
};

const addAnimationClass = (number) => {
  scoreAnimation.classList.add('animation');

  scoreAnimation.innerHTML = `+${number}`;

  setTimeout(() => {
    scoreAnimation.classList.remove('animation');
  }, 500);
};

const compersionArray = (copy, array) => {
  let result = true;

  copy.forEach((el, index) => {
    el.map(item => item.value).forEach((element, i) => {
      if (array[index].map(item => item.getValue())[i] !== element) {
        result = false;
      }
    });
  });

  return result;
};

const restartGame = () => {
  message.classList.remove('hidden');
};

const checkOnWin = () => {
  let result = false;

  arrayObject.forEach(el => {
    if (el.some(item => item.getValue() === 2048)) {
      win.classList.remove('hidden');

      result = true;
    }
  });

  return result;
};

const checkMovie = () => {
  let UpToDown = false;
  let leftToRigth = false;

  arrayObject.forEach(el => {
    if (checkOnDoubleCount(el, 4)) {
      leftToRigth = true;
    }
  });

  for (let i = 0; i < arrayObject.length; i++) {
    arrayObject[i].forEach((el, index) => {
      if (arrayObject[i + 1]) {
        if (el.getValue() === arrayObject[i + 1][index].getValue()) {
          UpToDown = true;
        }
      }
    });
  }

  return !UpToDown && !leftToRigth;
};

const getElementWithZeroValue = () => {
  const result = [];

  arrayObject.forEach(el => {
    el.forEach(item => {
      if (item.getValue() === 0) {
        result.push(item);
      }
    });
  });

  return result;
};

const checkOnDoubleCount = (array, countStep) => {
  for (let i = 0; i < countStep; i++) {
    if (array[i + 1]) {
      if (array[i].getValue() === array[i + 1].getValue()) {
        return true;
      }
    }
  }

  return false;
};

/* functions for events ArrorLeft ArrowRight */

const changeValueElement = (array, select, scorePerMovie) => {
  for (let i = 0; i < array.length; i++) {
    if (select.getValue() > 0 && array[i].getValue() > 0
      && select.getValue() !== array[i].getValue()) {
      break;
    }

    if (select.getValue() === array[i].getValue()) {
      select.setValue(select.getValue() + array[i].getValue());
      array[i].setValue(0);

      if (select.getValue() + array[i].getValue()) {
        scoreGame += select.getValue();
        scorePerMovie.push(select.getValue() + array[i].getValue());
      }
    }

    if (select.getValue() === 0 && array[i].getValue() !== 0) {
      select.setValue(array[i].getValue());
      array[i].setValue(0);
    }
  }

  return select;
};

const returnChangeArray = (countStep, arr, scorePerMovie) => {
  const result = [];

  for (let i = 0; i < countStep; i++) {
    const select = arr.shift();

    result.push(changeValueElement(arr, select, scorePerMovie));
  }

  return result;
};

const leftOrRight = (said) => {
  const copy = JSON.parse(JSON.stringify(arrayObject));
  const scorePerMovie = [];

  arrayObject = arrayObject.map(el => {
    const countStep = el.length;

    const result = returnChangeArray(countStep, said
      ? el.reverse()
      : el, scorePerMovie);

    if (scorePerMovie.reduce((acc, item) => acc + item, 0)) {
      addAnimationClass(scorePerMovie.reduce((acc, item) => acc + item, 0));
    }

    if (checkOnDoubleCount(result, countStep)
      && compersionArray(copy, arrayObject)) {
      return said
        ? returnChangeArray(countStep, result, scorePerMovie).reverse()
        : returnChangeArray(countStep, result, scorePerMovie);
    }

    return said ? result.reverse() : result;
  });

  if (!compersionArray(copy, arrayObject)) {
    getRandomElement(getElementWithZeroValue())
      .setValue(getRandomElement([2, 4]));
    renderElements(arrayObject);
  }
  score.innerHTML = scoreGame;
};

/* functions for events ArrowUp ArrowDown */

const returnChangeArrays = (select, filerArray, array, scorePerMovie) => {
  const wrongNumber = [];

  for (let i = 0; i < array.length; i++) {
    array.filter(el => !filerArray.includes(el)).forEach((item) => {
      for (let q = 0; q < select.length; q++) {
        if (select[q].getValue() > 0
          && item[q].getValue() > 0
          && item[q].getValue() !== select[q].getValue()) {
          wrongNumber.push(q);
        }

        if (select[q].getValue() === 0 && item[q].getValue() > 0) {
          select[q].setValue(select[q].getValue() + item[q].getValue());
          item[q].setValue(0);
        }

        if (select[q].getValue() === item[q].getValue()
          && !wrongNumber.includes(q)
          && select[q].getValue() !== 0 && item[q].getValue() !== 0) {
          select[q].setValue(select[q].getValue() + item[q].getValue());
          item[q].setValue(0);

          if (select[q].getValue() + item[i].getValue()) {
            scoreGame += select[q].getValue();
            scorePerMovie.push(select[q].getValue() + item[i].getValue());
          }
        }
      }
    });
  }

  return select;
};

const UpOrDown = (said) => {
  const copy = JSON.parse(JSON.stringify(arrayObject));
  const arraySeleced = [];
  const array = said === 'Down' ? arrayObject.reverse() : arrayObject;
  const scorePerMovie = [];

  arrayObject = array.map((el) => {
    const select = el;

    arraySeleced.push(select);

    return returnChangeArrays(
      select,
      arraySeleced,
      arrayObject,
      scorePerMovie);
  });

  if (scorePerMovie.reduce((acc, item) => acc + item, 0)) {
    addAnimationClass(scorePerMovie.reduce((acc, item) => acc + item, 0));
  }

  if (!compersionArray(copy, said === 'Down'
    ? arrayObject.reverse()
    : arrayObject)) {
    getRandomElement(getElementWithZeroValue())
      .setValue(getRandomElement([2, 4]));
    renderElements(arrayObject);
  }
  score.innerHTML = scoreGame;
};

/* listeners */

window.addEventListener('keydown', (e) => {
  switch (true) {
    case e.key === 'ArrowLeft': {
      if (!checkOnWin()) {
        leftOrRight();
      }

      if (!getElementWithZeroValue(arrayObject).length) {
        if (checkMovie()) {
          restartGame();
        };
      }
      break;
    }

    case e.key === 'ArrowRight': {
      if (!checkOnWin()) {
        leftOrRight('right');
      }

      if (!getElementWithZeroValue(arrayObject).length) {
        if (checkMovie()) {
          restartGame();
        };
      }
      break;
    }

    case e.key === 'ArrowDown': {
      if (!checkOnWin()) {
        UpOrDown('Down');
      }

      if (!getElementWithZeroValue(arrayObject).length) {
        if (!checkMovie()) {
          restartGame();
        };
      }
      break;
    }

    case e.key === 'ArrowUp': {
      if (!checkOnWin()) {
        UpOrDown();
      }

      if (!getElementWithZeroValue(arrayObject).length) {
        if (checkMovie()) {
          restartGame();
        };
      }
      break;
    }
  }
});

button.addEventListener('click', () => {
  if (!gameStart) {
    createGridElements();
    renderElements(arrayObject);
  }
  messageStart.classList.add('hidden');
  button.classList.add('restart');
  button.innerHTML = 'Restart';
  button.classList.remove('start');
  gameStart = true;

  if (checkMovie()) {
    arrayObject = arrayObject.map(() => []);
    message.classList.add('hidden');
    createGridElements();
    renderElements(arrayObject);
    scoreGame = 0;
    score.innerHTML = '0';
  };
});

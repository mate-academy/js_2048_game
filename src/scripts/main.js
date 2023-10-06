'use strict';

const allTr = [...document.querySelectorAll('tr')];
const allTdFromPage = [...document.querySelectorAll('td')];
const startButton = document.querySelector('.start');
const table = document.querySelector('.game-field');
const score = document.querySelector('.game-score');

const random = function() {
  const a = Math.random();
  let res;

  if (a < 0.9) {
    res = 2;
  } else {
    res = 4;
  }

  return res;
};

const creator = function() {
  const content = random();

  const needTr = allTr[Math.floor(Math.random() * 4)];
  const allTd = [...needTr.querySelectorAll('td')];
  const needTd = allTd[Math.floor(Math.random() * 4)];

  if (needTd.classList.contains('play')) {
    return creator();
  }

  table.style.display = 'block';

  needTd.classList.add('play');
  needTd.classList.add(`field-cell--${content}`);
  needTd.textContent = content;

  if (loseMoment()) {
    lose();
  }
};

const start = function() {
  document.addEventListener('keyup', moveToLeft);
  document.addEventListener('keyup', moveToRight);
  document.addEventListener('keyup', moveToUp);
  document.addEventListener('keyup', moveToDown);

  score.textContent = '0';

  allTdFromPage.forEach(a => {
    a.className = 'field-cell';
  });

  allTdFromPage.forEach(a => {
    a.textContent = '';
  });

  document.querySelector('.message').textContent = 'Press "Restart" to reload.';
  document.querySelector('.message').classList.remove('message-lose');
  document.querySelector('.message').classList.remove('message-win');
  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
  startButton.style.fontSize = '15px';
  creator();
  creator();
};

const finish = function() {
  document.querySelector('.message').textContent
    = 'You are winner! Press "Start" to reload.';

  document.querySelector('.message').classList.add('message-win');
  startButton.textContent = 'Start';
  startButton.style.fontSize = '16px';
  startButton.className = 'button start';
  document.removeEventListener('keyup', moveToLeft);
  document.removeEventListener('keyup', moveToRight);
  document.removeEventListener('keyup', moveToUp);
  document.removeEventListener('keyup', moveToDown);
};

const lose = function() {
  document.querySelector('.message').textContent
    = 'You lose! Press "Start" to reload.';
  document.querySelector('.message').classList.add('message-lose');
  startButton.textContent = 'Start';
  startButton.style.fontSize = '16px';
  startButton.className = 'button start';
  document.removeEventListener('keyup', moveToLeft);
  document.removeEventListener('keyup', moveToRight);
  document.removeEventListener('keyup', moveToUp);
  document.removeEventListener('keyup', moveToDown);
};

const loseMoment = function() {
  const allPlayTd = [...document.querySelectorAll('.play')];

  if (allPlayTd.length < 16) {
    return false;
  }

  for (let i = 0; i < allTdFromPage.length; i++) {
    const needTr = allTdFromPage[i].closest('Tr');
    const tdOnNeedTr = [...needTr.children];
    const index = tdOnNeedTr.indexOf(allTdFromPage[i]);
    let a = '';
    let b = '';
    let c = '';
    let d = '';

    if (tdOnNeedTr[index + 1]) {
      a = tdOnNeedTr[index + 1].textContent;
    }

    if (allTdFromPage[i + 4]) {
      b = allTdFromPage[i + 4].textContent;
    }

    if (tdOnNeedTr[index - 1]) {
      c = tdOnNeedTr[index - 1].textContent;
    }

    if (allTdFromPage[i - 4]) {
      d = allTdFromPage[i - 4].textContent;
    }

    if (allTdFromPage[i].textContent === a) {
      return false;
    }

    if (allTdFromPage[i].textContent === b) {
      return false;
    }

    if (allTdFromPage[i].textContent === c) {
      return false;
    }

    if (allTdFromPage[i].textContent === d) {
      return false;
    }
  }

  return true;
};

const moveToLeft = function(e) {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    const movingTd = [...document.querySelectorAll('.play')];
    let count = 0;
    let sum = 0;

    for (let i = 0; i < movingTd.length; i++) {
      const array = [...movingTd[i].closest('tr').children];
      let index = array.indexOf(movingTd[i]);
      const a = movingTd[i].className;
      const b = movingTd[i].textContent;

      while (true) {
        if (index - 1 < 0) {
          break;
        }

        if (array[index - 1].classList.contains('play')
          && !array[index - 1].classList.contains(`field-cell--${b}`)) {
          break;
        }

        if (array[index - 1].classList.contains(`field-cell--${b}`)) {
          array[index - 1].className = `field-cell--${+b * 2} play field-cell`;
          array[index - 1].textContent = `${b * 2}`;
          sum += +array[index - 1].textContent;
          array[index].className = 'field-cell';
          array[index].textContent = '';
          count++;

          if (array[index - 1].textContent === '2048') {
            finish();
          }

          break;
        }

        array[index - 1].className = a;
        array[index - 1].textContent = b;
        array[index].className = 'field-cell';
        array[index].textContent = '';
        index--;
        count++;
      }
    }

    if (count > 0) {
      creator();
    }

    score.textContent = `${+score.textContent + sum}`;
  }
};

const moveToRight = function(e) {
  if (e.key === 'ArrowRight' || e.key === 'd') {
    const movingTd = [...document.querySelectorAll('.play')];
    let count = 0;
    let sum = 0;

    for (let i = movingTd.length - 1; i >= 0; i--) {
      const array = [...movingTd[i].closest('tr').children];
      let index = array.indexOf(movingTd[i]);
      const a = movingTd[i].className;
      const b = movingTd[i].textContent;

      while (true) {
        if (index + 1 > 3) {
          break;
        }

        if (array[index + 1].classList.contains('play')
          && !array[index + 1].classList.contains(`field-cell--${b}`)) {
          break;
        }

        if (array[index + 1].classList.contains(`field-cell--${b}`)) {
          array[index + 1].className = `field-cell--${+b * 2} play field-cell`;
          array[index + 1].textContent = `${b * 2}`;
          sum += +array[index + 1].textContent;
          array[index].className = 'field-cell';
          array[index].textContent = '';
          count++;

          if (array[index + 1].textContent === '2048') {
            finish();
          }

          break;
        }

        array[index + 1].className = a;
        array[index + 1].textContent = b;
        array[index].className = 'field-cell';
        array[index].textContent = '';
        index++;
        count++;
      }
    }

    if (count > 0) {
      creator();
    }

    score.textContent = `${+score.textContent + sum}`;
  }
};

const moveToUp = function(e) {
  if (e.key === 'ArrowUp' || e.key === 'w') {
    const movingTd = [...document.querySelectorAll('.play')];
    let count = 0;
    let sum = 0;

    for (let i = 0; i < movingTd.length; i++) {
      const array = [...movingTd[i].closest('tr').children];
      const indexFirst = array.indexOf(movingTd[i]);
      const arrayForFunction = [];

      for (let n = 0; n < 4; n++) {
        arrayForFunction.push(allTr[n].children[indexFirst]);
      }

      const a = movingTd[i].className;
      const b = movingTd[i].textContent;
      let index = arrayForFunction.indexOf(movingTd[i]);

      while (true) {
        if (index - 1 < 0) {
          break;
        }

        if (arrayForFunction[index - 1].classList.contains('play')
          && !arrayForFunction[index - 1].classList.contains(
            `field-cell--${b}`)) {
          break;
        }

        if (arrayForFunction[index - 1].classList.contains(
          `field-cell--${b}`)) {
          arrayForFunction[index - 1].className
            = `field-cell--${+b * 2} play field-cell`;
          arrayForFunction[index - 1].textContent = `${b * 2}`;
          sum += +arrayForFunction[index - 1].textContent;
          arrayForFunction[index].className = 'field-cell';
          arrayForFunction[index].textContent = '';
          count++;

          if (arrayForFunction[index - 1].textContent === '2048') {
            finish();
          }

          break;
        }

        arrayForFunction[index - 1].className = a;
        arrayForFunction[index - 1].textContent = b;
        arrayForFunction[index].className = 'field-cell';
        arrayForFunction[index].textContent = '';
        index--;
        count++;
      }
    }

    if (count > 0) {
      creator();
    }

    score.textContent = `${+score.textContent + sum}`;
  }
};

const moveToDown = function(e) {
  if (e.key === 'ArrowDown' || e.key === 's') {
    const movingTd = [...document.querySelectorAll('.play')];
    let count = 0;
    let sum = 0;

    for (let i = movingTd.length - 1; i >= 0; i--) {
      const array = [...movingTd[i].closest('tr').children];
      const indexFirst = array.indexOf(movingTd[i]);
      const arrayForFunction = [];

      for (let n = 0; n < 4; n++) {
        arrayForFunction.push(allTr[n].children[indexFirst]);
      }

      const a = movingTd[i].className;
      const b = movingTd[i].textContent;
      let index = arrayForFunction.indexOf(movingTd[i]);

      while (true) {
        if (index + 1 > 3) {
          break;
        }

        if (arrayForFunction[index + 1].classList.contains('play')
          && !arrayForFunction[index + 1].classList.contains(
            `field-cell--${b}`)) {
          break;
        }

        if (arrayForFunction[index + 1].classList.contains(
          `field-cell--${b}`)) {
          arrayForFunction[index + 1].className
            = `field-cell--${+b * 2} play field-cell`;
          arrayForFunction[index + 1].textContent = `${b * 2}`;
          sum += +arrayForFunction[index + 1].textContent;
          arrayForFunction[index].className = 'field-cell';
          arrayForFunction[index].textContent = '';
          count++;

          if (arrayForFunction[index + 1].textContent === '2048') {
            finish();
          }

          break;
        }

        arrayForFunction[index + 1].className = a;
        arrayForFunction[index + 1].textContent = b;
        arrayForFunction[index].className = 'field-cell';
        arrayForFunction[index].textContent = '';
        index++;
        count++;
      }
    }

    if (count > 0) {
      creator();
    }

    score.textContent = `${+score.textContent + sum}`;
  }
};

startButton.addEventListener('click', start);

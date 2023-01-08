'use strict';

const score = document.querySelector('.game-score');
let gameScore = 0;

// сообщения в игре
function gameMassedge(number) {
  const messageCon = document.querySelectorAll('.message');

  switch (number) {
    case 0:
      messageCon[0].className = messageCon[0].className.replace('hidden', '');
      messageCon[1].className = messageCon[1].className + ' ' + 'hidden';
      messageCon[2].className = messageCon[2].className + ' ' + 'hidden';

      return;
    case 1:
      messageCon[0].className = messageCon[0].className + ' ' + 'hidden';
      messageCon[1].className = messageCon[1].className.replace('hidden', '');
      messageCon[2].className = messageCon[2].className + ' ' + 'hidden';

      return;

    default:
      messageCon[0].className = messageCon[0].className + ' ' + 'hidden';
      messageCon[1].className = messageCon[1].className + ' ' + 'hidden';
      messageCon[2].className = messageCon[2].className + ' ' + 'hidden';
  }
}

// рандомное значение
function random() {
  return Math.round(Math.random() * 15);
}

// значение 2 или 4 (10%)
function meaning() {
  const meaningRendom = Math.random() * 100;

  if (meaningRendom <= 10) {
    return 4;
  }

  return 2;
}

// функция заполнения пустых ячеек
function additionTwoFour() {
  const cells = document.getElementsByClassName('field-cell');
  const td = document.getElementsByTagName('td');

  const resuktGL = [...td].filter(x => x.innerText === '');

  if (resuktGL.length === 0) {
    gameMassedge(0);

    return;
  }

  const twoFour = meaning();
  let randomCells = random();

  while (cells[randomCells].textContent) {
    randomCells = random();
  }

  setTimeout(() => {
    cells[randomCells].textContent = twoFour;
    // eslint-disable-next-line max-len
    cells[randomCells].className = 'field-cell' + ' ' + 'field-cell--' + twoFour;
  }, 100);
}

// старт/рестaрт игры
document.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') {
    return;
  }

  additionTwoFour();
  additionTwoFour();

  switch (e.target.innerText) {
    case 'Start':
      e.target.innerText = 'Restart';
      e.target.className = e.target.className.replace('start', 'restart');
      gameMassedge();

      return;
    case 'Restart':
      const td = document.querySelectorAll('td');

      td.forEach(x => {
        x.innerText = '';
        x.className = 'field-cell';
      });
      document.querySelector('.game-score').innerText = '0';
      gameMassedge();
  }
});

// преобразование массива для вверх /вниз
function sortArrayUD(arrayTag) {
  const arrayTagNew = [[], [], [], []];

  for (let k = 0; k < 4; k++) {
    arrayTagNew[0][k] = (arrayTag[k].children[0]);
    arrayTagNew[1][k] = (arrayTag[k].children[1]);
    arrayTagNew[2][k] = (arrayTag[k].children[2]);
    arrayTagNew[3][k] = (arrayTag[k].children[3]);
  }

  return arrayTagNew;
}

// преобразование массива для вверх /вниз  ввозврат
function sortArrayUDV(arrayTag) {
  const arrayTagNew = [[], [], [], []];

  for (let k = 0; k < 4; k++) {
    arrayTagNew[0][k] = (arrayTag[k][0]);
    arrayTagNew[1][k] = (arrayTag[k][1]);
    arrayTagNew[2][k] = (arrayTag[k][2]);
    arrayTagNew[3][k] = (arrayTag[k][3]);
  }

  return arrayTagNew;
}

// преобразование массива для право влево
function sortArrayLR(arrayTag) {
  const arrayTagNew = [[], [], [], []];

  for (let k = 0; k < 4; k++) {
    arrayTagNew[k][0] = (arrayTag[k].children[0]);
    arrayTagNew[k][1] = (arrayTag[k].children[1]);
    arrayTagNew[k][2] = (arrayTag[k].children[2]);
    arrayTagNew[k][3] = (arrayTag[k].children[3]);
  }

  return arrayTagNew;
}

// ревеверс массива
function reversArray(arrayTag) {
  const result = [...arrayTag].map(cell => cell.reverse());

  return result;
}

// сдвигание массива
function sortL(cell) {
  for (let k = 0; k < 3; k++) {
    for (let i = 0; i < 3; i++) {
      if (!cell[i].innerText) {
        cell[i].innerText = cell[i + 1].innerText;
        cell[i + 1].innerText = '';
      }
    }
  }
}

// суммирование массива
function left(arrayTag) {
  const result = [...arrayTag].map(cell => {
    sortL(cell);

    for (let i = 0; i < 3; i++) {
      // eslint-disable-next-line max-len
      if (cell[i].innerText === cell[i + 1].innerText && cell[i].innerText !== '') {
        cell[i].innerText = Number(cell[i + 1].innerText) * 2;
        cell[i + 1].innerText = '';
        gameScore += Number(cell[i].innerText);
        score.innerText = gameScore;

        if (gameScore === 2048) {
          gameMassedge(1);

          return;
        }
        i++;
      }
    }

    sortL(cell);

    return cell;
  });

  return result;
}

// вставка новой таблицы
function tabNew(arrayTag) {
  const tbodyNew = document.createElement('tbody');

  // eslint-disable-next-line max-len
  tbodyNew.innerHTML = arrayTag.map(c => `<tr class="field-row">${c.map(td => `<td class="field-cell${td.innerText === '' ? '' : (' field-cell--' + td.innerText)}">${td.innerText}</td>`).join('')}</tr>`).join('');

  const tbody = document.querySelector('tbody');
  const table = document.querySelector('.game-field');

  tbody.remove();
  table.append(tbodyNew);
}

// обработка нажатия стрелок вправо влево
document.addEventListener('keydown', (e) => {
  const tr = document.getElementsByTagName('tr');
  let trArray;
  let resultArray;

  switch (e.key) {
    case 'ArrowLeft':
      trArray = sortArrayLR(tr);
      resultArray = left(trArray);

      tabNew(resultArray);

      additionTwoFour();
      break;
    case 'ArrowRight':
      trArray = sortArrayLR(tr);

      resultArray = left(reversArray(trArray));

      tabNew(reversArray(resultArray));

      additionTwoFour();

      break;
    case 'ArrowDown':
      trArray = sortArrayUD(tr);
      resultArray = left(reversArray(trArray));

      tabNew(sortArrayUDV(reversArray(resultArray)));

      additionTwoFour();

      break;
    case 'ArrowUp':
      trArray = sortArrayUD(tr);
      resultArray = left(trArray);

      tabNew(sortArrayUDV(resultArray));

      additionTwoFour();

      break;
  };
});

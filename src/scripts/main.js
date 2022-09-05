'use strict';

// write your code here

const button = document.querySelector('.button');
const line = document.querySelectorAll('tr'); // [4]
const eachTd = document.querySelectorAll('td');
const messageLose = document.body.querySelector('.message-lose');
const messageWin = document.body.querySelector('.message-win');

button.addEventListener('click', () => {
  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
  button.classList.add('restart');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  resetAll('all');
  gameStart();
});

function randomStand(freePosition) {
  for (const element of eachTd) {
    if (element.textContent === '') {
      freePosition.push(element);
    }
  }

  if (freePosition.length === 0) {
    gameFinish();
  }

  let randomCount = 1;

  do {
    randomCount = Math.round(Math.random() * (4 - 2) + 2);
  } while (randomCount % 2 === 1);

  const randomElement = Math.round(
    Math.random() * (freePosition.length - 1) + 0
  );

  changeElement(freePosition[randomElement], randomCount);
}
// создание рандомных значений

function gameStart() {
  const message = document.body.querySelector('.message-start');

  message.classList.add('hidden');

  const freePosition = [];

  randomStand(freePosition);

  document.addEventListener('keydown', pushElement);
} // основа для запуска

function gameFinish() {
  let resultScore = 0;

  for (const item of eachTd) {
    if (item.textContent > 0) {
      resultScore += parseInt(item.textContent, 10);
    }
  }

  const score = document.body.querySelector('.game-score');

  if (parseInt(score.textContent, 10) > resultScore) {
    messageWin.classList.add('hidden');
    messageLose.classList.remove('hidden');
  } else if (parseInt(score.textContent, 10) < resultScore) {
    score.textContent = resultScore;
    messageLose.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }
} // основа для завершения

function resetAll(pos = 'all', index) {
  if (pos === 'horizont') {
    for (const element of line[index].children) {
      changeElement(element, 0);
    }
  } else if (pos === 'vertical') {
    line.forEach((element) => {
      changeElement(element.children[index], 0);
    });
  } else if (pos === 'all') {
    eachTd.forEach((item) => {
      changeElement(item, 0);
    });
  }
} // сброс всех елементов на линии

function changeElement(htmlItem, value) {
  const correctValue = value === 0 ? 'field-cell' : `field-cell--${value}`;

  let removeClass = 'field-cell';

  if (htmlItem.textContent > 0) {
    removeClass = `field-cell--${htmlItem.textContent}`;
  }

  htmlItem.classList.remove(removeClass);
  htmlItem.classList.add(correctValue);
  htmlItem.textContent = value !== 0 ? value : null;
} // меняет фон и значение

function pushElement(keyEvent) {
  const lineOne = [];
  const lineTwo = [];
  const lineThree = [];
  const lineFour = [];
  const massLine = [lineOne, lineTwo, lineThree, lineFour];

  // massLine - масив с блоками со всеми
  // (как одинаковыми, так и одиночными) значениями, с пробелами
  line.forEach((element) => {
    lineOne.push(element.children[0]);
    lineTwo.push(element.children[1]);
    lineThree.push(element.children[2]);
    lineFour.push(element.children[3]);
  });

  switch (keyEvent.key) {
    case 'ArrowUp':
      massLine.forEach((lineElement, index) => {
        const resultMass = [];
        // здесь храняться результаты вычислений + значения большие от 0

        for (let i = 0; i < lineElement.length; i++) {
          const secondCondition
            = i === lineElement.length - 1
              ? false
              : lineElement[i + 1].textContent === lineElement[i].textContent;
          const conditionOne = lineElement[i].textContent > 0;
          const conditionThree
            = i === lineElement.length - 1
              ? false
              : lineElement[i + 1].textContent > 0;
          const oneElement = parseInt(lineElement[i].textContent, 10);

          if (conditionOne && conditionThree && secondCondition) {
            const threeElement = parseInt(lineElement[i + 1].textContent, 10);
            const result = oneElement + threeElement;

            resultMass.push(result);
            i++;
          } else if (conditionOne) {
            resultMass.push(oneElement);
          }
        }
        resetAll('vertical', index);

        lineElement.forEach((posElement, indexElement) => {
          if (resultMass[indexElement]) {
            changeElement(posElement, resultMass[indexElement]);
          }
        });
      });

      break;
    case 'ArrowDown':
      massLine.forEach((lineElement, index) => {
        const resultMass = [];
        // здесь храняться результаты вычислений + значения большие от 0

        for (let i = lineElement.length - 1; i >= 0; i--) {
          const firstCondition
            = i === 0
              ? false
              : lineElement[i - 1].textContent === lineElement[i].textContent;
          const conditionOne = lineElement[i].textContent > 0;
          const conditionTwo
            = i === 0 ? false : lineElement[i - 1].textContent > 0;
          const oneElement = parseInt(lineElement[i].textContent, 10);

          if (conditionOne && conditionTwo && firstCondition) {
            const result = oneElement * 2;

            resultMass.push(result);
            i--;
          } else if (conditionOne) {
            resultMass.push(oneElement);
          }
        }
        resetAll('vertical', index);

        let indexElement = 0;

        for (let i = lineElement.length - 1; i >= 0; i--) {
          if (resultMass[indexElement]) {
            changeElement(lineElement[i], resultMass[indexElement]);
          }
          indexElement++;
        }
      });
      break;
    case 'ArrowLeft':
      line.forEach((element, index) => {
        const resultMass = [];

        for (let i = 0; i < element.children.length; i++) {
          const statusOne
            = i === element.children.length - 1
              ? false
              : element.children[i + 1].textContent > 0;
          const statusTwo = element.children[i].textContent > 0;
          const statusThree
            = i === element.children.length - 1
              ? false
              : element.children[i + 1].textContent
                === element.children[i].textContent;
          const elementRecount = parseInt(element.children[i].textContent, 10);

          if (statusOne && statusTwo && statusThree) {
            resultMass.push(elementRecount * 2);
            i++;
          } else if (statusTwo) {
            resultMass.push(elementRecount);
          }
        }
        resetAll('horizont', index);

        let indexElement = 0;

        for (const posElement of line[index].children) {
          if (resultMass[indexElement]) {
            changeElement(posElement, resultMass[indexElement]);
          }
          indexElement++;
        }
      });
      break;
    case 'ArrowRight':
      line.forEach((element, index) => {
        const resultMass = [];

        for (let i = element.children.length - 1; i >= 0; i--) {
          const statusOne
            = i === 0 ? false : element.children[i - 1].textContent > 0;
          const statusTwo = element.children[i].textContent > 0;
          const statusThree
            = i === 0
              ? false
              : element.children[i - 1].textContent
                === element.children[i].textContent;
          const elementRecount = parseInt(element.children[i].textContent, 10);

          if (statusOne && statusTwo && statusThree) {
            resultMass.push(elementRecount * 2);
            i--;
          } else if (statusTwo) {
            resultMass.push(elementRecount);
          }
        }
        resetAll('horizont', index);

        let indexElement = 0;

        for (let pos = line[index].children.length - 1; pos >= 0; pos--) {
          if (resultMass[indexElement]) {
            changeElement(line[index].children[pos], resultMass[indexElement]);
          }
          indexElement++;
        }
      });
      break;
  }
  const freePosition = [];
  randomStand(freePosition);
} // сумирование и размещение после нажатия кнопки

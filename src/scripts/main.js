'use strict';
const ceils = document.querySelectorAll('.field-cell');

function startGame() {
  const randomIndex1 = Math.floor(Math.random() * ceils.length);
  const randomIndex2 = Math.floor(Math.random() * ceils.length);

  ceils[randomIndex1].classList.add('field-cell--2');
  ceils[randomIndex1].textContent = '2';

  ceils[randomIndex2].classList.add('field-cell--2');
  ceils[randomIndex2].textContent = '2';
}

function generateNewCeil() {
  let a;
  let randomCeil;

  do {
    a = true;

    const randomNumber = Math.random();
    const probability = (randomNumber < 0.3) ? 0.4 : 0.6;

    randomCeil = Math.floor(Math.random() * ceils.length);

    if (ceils[randomCeil].textContent === '') {
      const newValue = (probability < 0.5) ? '4' : '2';
      ceils[randomCeil].textContent = newValue;
      ceils[randomCeil].classList.add(`field-cell--${newValue}`);
      a = false;
    }
  } while (!a);
}

function move(items, itemsFrom) {
  if (itemsFrom === 0) {
    for (let j = 1; j < 4; j++) {
      if (items[j].textContent !== '') {
        for (let k = j; k > 0; k--) {
          const value = +items[k].textContent;

          if (items[k - 1].textContent === '') {
            items[k - 1].textContent = items[k].textContent;
            items[k - 1].classList.add(`field-cell--${value}`);
            items[k].textContent = '';
            items[k].classList = 'field-cell';
          } else if (items[k - 1].textContent === items[k].textContent) {
            items[k - 1].textContent = value * 2;
            items[k - 1].classList.add(`field-cell--${value * 2}`);
            items[k].textContent = '';
            items[k].classList = 'field-cell';
            break;
          }
        }
      }
    }
  } else {
    for (let j = 2; j >= 0; j--) {
      if (items[j].textContent !== '') {
        for (let k = j; k < 3; k++) {
          const value = +items[k].textContent;

          if (items[k + 1].textContent === '') {
            items[k + 1].textContent = items[k].textContent;
            items[k + 1].classList.add(`field-cell--${value}`);
            items[k].textContent = '';
            items[k].classList = 'field-cell';
          } else if (items[k + 1].textContent === items[k].textContent) {
            const value = +items[k + 1].textContent * 2;

            items[k + 1].textContent = value * 2;
            items[k + 1].classList.add(`field-cell--${value * 2}`);
            items[k].textContent = '';
            items[k].classList = 'field-cell';
            break;
          }
        }
      }
    }
  }
}

function moveLeft() {
  for (let i = 0; i < 4; i++) {
    const row = document.querySelectorAll('.field-row')[i];
    const cells = row.querySelectorAll('.field-cell');

    move(cells, 0)
  }

  generateNewCeil();
}

function moveRight() {
  for (let i = 0; i < 4; i++) {
    const row = document.querySelectorAll('.field-row')[i];
    const cells = row.querySelectorAll('.field-cell');

    move(cells, 1)
  }

  generateNewCeil();
}

function moveUp() {
  for (let i = 0; i < 4; i++) {
    const column = document.querySelectorAll(`.field-row .field-cell:nth-child(${i + 1})`);

    move(column, 0)
  }

  generateNewCeil();
}

function moveDown() {
  for (let i = 0; i < 4; i++) {
    const column = document.querySelectorAll(`.field-row .field-cell:nth-child(${i + 1})`);

    move(column, 1)
  }

  generateNewCeil();
}


document.addEventListener('keydown', event => {

  switch (event.key) {
    case 'ArrowLeft':
      moveLeft()
      break;
    case 'ArrowRight':
      moveRight()

      break;
    case 'ArrowUp':
      moveUp()
      break;
    case 'ArrowDown':
      moveDown()
      break;
    default:
      break;
  }
});

document.getElementById('startButton').addEventListener('click', startGame);
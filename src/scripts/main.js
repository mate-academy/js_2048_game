/* eslint-disable no-fallthrough */
'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

const btn = document.querySelector('.button');
const cells = [...document.getElementsByClassName('field-cell')];

btn.addEventListener('click', (e) => {
  if (btn.classList.contains('start')) {
    btn.classList.remove('start');

    btn.classList.add('restart');
    btn.textContent = 'Restart';
  }

  if (btn.classList.contains('restart')) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].classList.remove(`field-cell--${cells[i].textContent}`);
      cells[i].textContent = '';
    }
  }

  generateInitial();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  let counter = 0;

  switch (e.key) {
    case 'ArrowLeft': {
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.length >= 2) {
          const mod = i % 4;
          let currentIndex = i;

          switch (mod) {
            case 1:
            case 2:
              // eslint-disable-next-line padding-line-between-statements
            case 3: {
              while (currentIndex % 4 > 0
                && cells[currentIndex - 1].classList.length < 2) {
                cells[currentIndex - 1].classList
                  .add(`field-cell--${cells[currentIndex].textContent}`);

                cells[currentIndex - 1]
                  .textContent = cells[currentIndex].textContent;

                cells[currentIndex].classList
                  .remove(`field-cell--${cells[currentIndex].textContent}`);
                cells[currentIndex].textContent = '';

                counter++;

                currentIndex--;
              }

              if (currentIndex % 4 > 0 && cells[currentIndex - 1].textContent
                  === cells[currentIndex].textContent
                  && !cells[currentIndex - 1].getAttribute('data-merged')) {
                const mult = cells[currentIndex - 1].textContent * 2;
                const multSecond = cells[currentIndex].textContent;

                cells[currentIndex - 1].textContent = mult;

                cells[currentIndex - 1]
                  .classList.remove(`field-cell--${mult / 2}`);

                cells[currentIndex - 1].setAttribute('data-merged', true);

                cells[currentIndex - 1].classList.add(`field-cell--${mult}`);

                cells[currentIndex]
                  .classList.remove(`field-cell--${multSecond}`);
                cells[currentIndex].textContent = '';

                counter++;
              }

              break;
            }

            default: {
              break;
            }
          }
        }
      }

      break;
    }

    case 'ArrowRight': {
      for (let i = cells.length - 1; i >= 0; i--) {
        if (cells[i].classList.length >= 2) {
          const mod = i % 4;
          let currentIndex = i;

          switch (mod) {
            case 0:
            case 1:
              // eslint-disable-next-line padding-line-between-statements
            case 2: {
              while (currentIndex % 4 < (cells.length - 1) % 4
                && cells[currentIndex + 1].classList.length < 2) {
                cells[currentIndex + 1].classList
                  .add(`field-cell--${cells[currentIndex].textContent}`);

                cells[currentIndex + 1]
                  .textContent = cells[currentIndex].textContent;

                cells[currentIndex].classList
                  .remove(`field-cell--${cells[currentIndex].textContent}`);
                cells[currentIndex].textContent = '';

                counter++;

                currentIndex++;
              }

              if (currentIndex % 4 < (cells.length - 1) % 4
                 && cells[currentIndex + 1].textContent
                  === cells[currentIndex].textContent
                  && !cells[currentIndex + 1].getAttribute('data-merged')) {
                const mult = cells[currentIndex + 1].textContent * 2;
                const multSecond = cells[currentIndex].textContent;

                cells[currentIndex + 1].textContent = mult;

                cells[currentIndex + 1]
                  .classList.remove(`field-cell--${mult / 2}`);

                cells[currentIndex + 1].classList.add(`field-cell--${mult}`);
                cells[currentIndex + 1].setAttribute('data-merged', true);

                cells[currentIndex]
                  .classList.remove(`field-cell--${multSecond}`);
                cells[currentIndex].textContent = '';

                counter++;
              }

              break;
            }

            default: {
              break;
            }
          }
        }
      }

      break;
    }

    case 'ArrowUp': {
      for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.length >= 2 && i >= 4) {
          let currentIndex = i;

          while (currentIndex >= 4
            && cells[currentIndex - 4].classList.length < 2) {
            cells[currentIndex - 4].classList
              .add(`field-cell--${cells[currentIndex].textContent}`);

            cells[currentIndex - 4]
              .textContent = cells[currentIndex].textContent;

            cells[currentIndex].classList
              .remove(`field-cell--${cells[currentIndex].textContent}`);
            cells[currentIndex].textContent = '';

            counter++;

            currentIndex -= 4;
          }

          if (currentIndex >= 4 && cells[currentIndex - 4].textContent
              === cells[currentIndex].textContent
              && !cells[currentIndex - 4].getAttribute('data-merged')) {
            const mult = cells[currentIndex - 4].textContent * 2;
            const multSecond = cells[currentIndex].textContent;

            cells[currentIndex - 4].textContent = mult;

            cells[currentIndex - 4]
              .classList.remove(`field-cell--${mult / 2}`);

            cells[currentIndex - 4].classList.add(`field-cell--${mult}`);
            cells[currentIndex - 4].setAttribute('data-merged', true);

            cells[currentIndex]
              .classList.remove(`field-cell--${multSecond}`);
            cells[currentIndex].textContent = '';

            counter++;
          }
        }
      }

      break;
    }

    case 'ArrowDown': {
      for (let i = cells.length - 1; i >= 0; i--) {
        if (cells[i].classList.length >= 2 && i < cells.length - 4) {
          let currentIndex = i;

          while (currentIndex < cells.length - 4
            && cells[currentIndex + 4].classList.length < 2) {
            cells[currentIndex + 4].classList
              .add(`field-cell--${cells[currentIndex].textContent}`);

            cells[currentIndex + 4]
              .textContent = cells[currentIndex].textContent;

            cells[currentIndex].classList
              .remove(`field-cell--${cells[currentIndex].textContent}`);
            cells[currentIndex].textContent = '';

            counter++;

            currentIndex += 4;
          }

          if (currentIndex < cells.length - 4
            && cells[currentIndex + 4].textContent
              === cells[currentIndex].textContent
              && !cells[currentIndex + 4].getAttribute('data-merged')) {
            const mult = cells[currentIndex + 4].textContent * 2;
            const multSecond = cells[currentIndex].textContent;

            cells[currentIndex + 4].textContent = mult;

            cells[currentIndex + 4]
              .classList.remove(`field-cell--${mult / 2}`);

            cells[currentIndex + 4].classList.add(`field-cell--${mult}`);
            cells[currentIndex + 4].setAttribute('data-merged', true);

            cells[currentIndex]
              .classList.remove(`field-cell--${multSecond}`);
            cells[currentIndex].textContent = '';

            counter++;
          }
        }
      }

      break;
    }
  }

  if (counter !== 0) {
    generateInitial();
  }

  removeAttrs();
});

function generateInitial() {
  let rand = Math.ceil(Math.random() * (cells.length - 1));

  while (cells[rand].classList.length >= 2) {
    rand = Math.floor(Math.random() * (cells.length - 1));
  }

  const rIndex = Math.round(Math.random()) === 1 ? 4 : 2;

  cells[rand].classList.add(`field-cell--${rIndex}`);
  cells[rand].textContent = rIndex;
}

function removeAttrs() {
  const mergedItems = document.querySelectorAll('[data-merged=true]');

  for (const merged of mergedItems) {
    merged.removeAttribute('data-merged');
  }
}

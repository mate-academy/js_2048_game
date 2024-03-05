'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

// отримуємо доступ до різних єлементів на сторінці html
// та кидаємо їх в змінні щоб потім їх легко отримувати
const container = document.querySelector('.container');
const button = container.querySelector('.button');
const messageStart = container.querySelector('.message-start');
const messageLose = container.querySelector('.message-lose');
const messageWin = container.querySelector('.message-win');
const scoreInfo = container.querySelector('.game-score');

// коли було натиснуто кнопку 'button'
// (це ми розуміємо через 'addEventListener'(сlick))
// і робимо наступні дії які нам потрібно
button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    game.start();

    // змінюємо текст
    button.textContent = 'Restart';
    // додаємо новий клас для scc щоб стилізувати
    button.classList.add('restart');
    // видяляємо старий клас стилізації
    button.classList.remove('start');
  } else {
    game.restart();

    // тут все робимо навпаки якщо наша перевірка 'if' false
    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  }

  // думаю зрозуміло (ховаємо всі повідомлення під час гри)
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  // викликаєио функцію. Опис її буде нижче !!!!
  // !!! а сюди потім додади опис що функція робить
  updateUI();
});

// по полицям:
// читаємо яка клавіша була натистуна (перебираємо тільки варіанти
// вверх, вниз, вліво, вправо) інші ігноруємо
// відповідно запускаємо функцію в залежності від натиснутої клавіши
document.addEventListener('keydown', (keyboard) => {
  switch (keyboard.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      break;
  }

  updateUI();
});

function updateUI() {
  const gameState = game.getState().flat();
  const fieldCells = container.querySelectorAll('.field-cell');

  fieldCells.forEach((fieldCell, index) => {
    const classList = fieldCell.classList;
    const classArray = classList;

    for (const className of classArray) {
      if (className !== 'field-cell') {
        classList.remove(className);
        fieldCell.textContent = '';
      }
    }

    if (gameState[index] !== 0) {
      fieldCell.classList.add(`field-cell--${gameState[index]}`);
      fieldCell.textContent = gameState[index];
    }
  });

  scoreInfo.textContent = game.getScore();

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }
}

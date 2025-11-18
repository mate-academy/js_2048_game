const Game = require('../modules/Game.class');

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

const container = document.querySelector('.container');
const tBodyEl = document.querySelector('tbody');
const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messagesCollection = document.querySelectorAll('.message');
const game = new Game(score, container);

button.addEventListener('click', function () {
  if (this.classList.contains('start')) {
    game.start();
    this.classList.replace('start', 'restart');
    this.textContent = 'Restart';

    messagesCollection.forEach((message) => {
      message.classList.add('hidden');
    });
  } else {
    game.restart();
    this.classList.replace('restart', 'start');
    this.textContent = 'Start';

    messagesCollection.forEach((message) => {
      if (message.classList.contains('message-start')) {
        message.classList.remove('hidden');
      } else {
        message.classList.add('hidden');
      }
    });
  }
  score.textContent = game.score;
});

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const cell =
      mutation.target.nodeType === Node.TEXT_NODE
        ? mutation.target.parentElement
        : mutation.target;

    if (cell && cell.tagName === 'TD') {
      const newText = cell.textContent.trim();

      if (newText !== '') {
        cell.classList.add('cell-animate');

        cell.addEventListener(
          'animationend',
          () => {
            cell.classList.remove('cell-animate');
          },
          { once: true },
        );
      }
    }

    if (mutation.target.textContent === '2048') {
      game.statusGame = `win`;

      messagesCollection.forEach((message) => {
        if (message.classList.contains('message-win')) {
          message.classList.remove('hidden');
        }
      });
    }
  });
});

observer.observe(tBodyEl, {
  childList: true, // слухає додавання/видалення вузлів
  characterData: true, // слухає зміну тексту
  subtree: true, // слухає всі вкладені елементи (td, tr, span...)
});

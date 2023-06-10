import Game from './Game';

const button = document.querySelector('button');
let game;

button.addEventListener('click', (ev) => {
  const startMess = document.querySelector('.message-start');

  if (game) {
    game.stop();
  }
  startMess.classList.add('hidden');
  game = new Game();
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
});

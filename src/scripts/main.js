import { Data } from './Data.js';

const HTML_CELLS = document.querySelectorAll('.field-cell');

const Game = new Data(HTML_CELLS);

Game.FIELD = Game.makeMatrix();
Game.moveList = Game.makeMatrix();
Game.HTML_MATRIX = Game.makeMatrix(HTML_CELLS);

function eventListener(keyEvent) {
  document.querySelector('.button').classList = 'button restart';
  document.querySelector('.button').innerText = 'Restart';

  const PREV_FIELD = Game.FIELD.map(elem => [...elem]);

  Game.madeMove = true;

  Game.moveField(Game.FIELD, keyEvent.key, Game.moveList);
  Game.visualize(keyEvent.key, PREV_FIELD);

  for (let i = 0; i < Game.moveList.length; i++) {
    for (let j = 0; j < Game.moveList.length; j++) {
      Game.moveList[i][j] = 0;
    }
  }

  document.querySelector('.game-score').innerText = `${Game.score}`;

  if (!Game.canMoveHorizontaly(Game.FIELD)
  && !Game.canMoveVerticaly(Game.FIELD)
  && !Game.hasEmptySpace(Game.FIELD)) {
    document.querySelector('.game-field__game-over').style.display = 'flex';
    document.removeEventListener('keydown', eventListener);

    setTimeout(() => {
      document.querySelector('.game-field__game-over').style.opacity = '1';
      document.querySelector('.message-lose').classList.remove('hidden');
    }, 10);
  } else if (Game.winStatus) {
    document.querySelector('.game-field__game-win').style.display = 'flex';
    document.removeEventListener('keydown', eventListener);

    setTimeout(() => {
      document.querySelector('.game-field__game-win').style.opacity = '1';
      document.querySelector('.message-win').classList.remove('hidden');
    }, 10);
  }
};

document.body.querySelector('.button').addEventListener('click', () => {
  document.querySelector('.message-start').classList.add('hidden');

  if (Game.madeMove) {
    location.reload();
  }

  setTimeout(() => {
    Game.randomCell(Game.FIELD);
    Game.randomCell(Game.FIELD);
    Game.visualize(Game.FIELD, Game.HTML_MATRIX, Game.moveList);
  }, 50);

  document.addEventListener('keydown', eventListener);
});

'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// #region getScore
const gameScore = document.querySelector('.game-score');

function actualizeScore() {
  gameScore.textContent = game.getScore();
}
// #endregion

// #region actualize board
function actualizeBoard() {
  const table = Array.from(document.querySelector('tbody').children);

  for (let r = 0; r < table.length; r++) {
    for (let c = 0; c < 4; c++) {
      if (game.board[r][c] === 0) {
        table[r].children[c].textContent = '';
        table[r].children[c].className = 'field-cell';
      } else {
        table[r].children[c].textContent = game.board[r][c];

        table[r].children[c].className =
          `field-cell field-cell--${game.board[r][c]}`;
      }
    }
  }
}
// #endregion

// #region start game
const startButton = document.querySelector('.button.start');

startButton.addEventListener(
  'click',
  () => {
    game.start();
    actualizeBoard();

    document.querySelector('.message-start').className =
      'message message-start hidden';

    startButton.className = 'button restart';
    startButton.textContent = 'Restart';

    startButton.addEventListener('click', () => {
      game.restart();
      actualizeBoard();
      actualizeScore();

      document.querySelector('.message-lose').className =
        'message message-lose hidden';

      document.querySelector('.message-win').className =
        'message message-win hidden';
    });

    // #region game logic
    const doc = document.querySelector('html');

    doc.addEventListener('keydown', (e) => {
      if (game.getStatus() === 'playing') {
        if (
          ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)
        ) {
          const boardBefore = game.board.map((row) => [...row]);

          if (game.isAvailableMove()) {
            if (e.key === 'ArrowRight') {
              game.moveRight();
            }

            if (e.key === 'ArrowLeft') {
              game.moveLeft();
            }

            if (e.key === 'ArrowDown') {
              game.moveDown();
            }

            if (e.key === 'ArrowUp') {
              game.moveUp();
            }
          }

          const boardAfter = game.board;

          let changed = false;

          for (let r = 0; r < game.board.length; r++) {
            for (let c = 0; c < game.board.length; c++) {
              if (boardBefore[r][c] !== boardAfter[r][c]) {
                changed = true;
                break;
              }
            }
          }

          if (changed) {
            game.generateRandom();
            actualizeScore();
            actualizeBoard();

            if (game.isWin()) {
              document.querySelector('.message-win').className =
                'message message-win';
              game.status = 'win';
            }
          } else {
            if (game.isAvailableMove() === false) {
              game.status = 'lose';

              document.querySelector('.message-lose').className =
                'message message-lose';
            }
          }
        }
      }
    });

    // #endregion
  },
  { once: true },
);
// #endregion

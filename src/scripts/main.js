const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const rows = Array.from(gameField.rows);
const cells = rows.map((row) => Array.from(row.cells)).flat();
const scoreTab = document.querySelector('.game-score');
const winMessage = document.querySelector('.message.message-win.hidden');
const loseMessage = document.querySelector('.message.message-lose.hidden');
const startMessage = document.querySelector('.message.message-start');

const updateScore = () => {
  game.getScore(cells);
  scoreTab.innerText = game.score;
};

const checkForWin = () => {
  if (scoreTab.innerText === '2048') {
    winMessage.classList.remove('hidden');
  }
};

const checkForLose = () => {
  if (game.checkForLose()) {
    loseMessage.classList.remove('hidden');
  }
};

document.addEventListener('click', (e) => {
  const start = e.target.closest('.button.start');
  const restart = e.target.closest('.button.restart');

  if (start) {
    start.classList.remove('start');
    start.classList.add('restart');
    start.innerText = 'Restart';
    game.start();
    game.updateBoard(rows);
    updateScore();
    addColors();

    startMessage.classList.add('hidden');
  }

  if (restart) {
    restart.classList.remove('restart');
    restart.classList.add('start');
    restart.innerText = 'Start';
    game.restart();
    game.updateBoard(rows);
    updateScore();
    addColors();

    if (!winMessage.classList.contains('hidden')) {
      winMessage.classList.add('hidden');
    }

    if (!loseMessage.classList.contains('hidden')) {
      loseMessage.classList.add('hidden');
    }

    if (startMessage.classList.contains('hidden')) {
      startMessage.classList.remove('hidden');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    const oldBoard = structuredClone(game.board);

    game.moveVertically(true, false);
    game.combineVertically(true, false);
    game.moveVertically(true, false);

    if (game.checkForChanges(oldBoard, game.board)) {
      game.generate();
    }
    game.updateBoard(rows);
    updateScore();
    addColors();
    checkForWin();
    checkForLose();
  }

  if (e.key === 'ArrowDown') {
    const oldBoard = structuredClone(game.board);

    game.moveVertically(false, true);
    game.combineVertically(false, true);
    game.moveVertically(false, true);

    if (game.checkForChanges(oldBoard, game.board)) {
      game.generate();
    }
    game.updateBoard(rows);
    updateScore();
    addColors();
    checkForWin();
    checkForLose();
  }

  if (e.key === 'ArrowLeft') {
    const oldBoard = structuredClone(game.board);

    game.moveHorizontally(true, false);
    game.combineHorizontally(true, false);
    game.moveHorizontally(true, false);

    if (game.checkForChanges(oldBoard, game.board)) {
      game.generate();
    }
    game.updateBoard(rows);
    updateScore();
    addColors();
    checkForWin();
    checkForLose();
  }

  if (e.key === 'ArrowRight') {
    const oldBoard = structuredClone(game.board);

    game.moveHorizontally(false, true);
    game.combineHorizontally(false, true);
    game.moveHorizontally(false, true);

    if (game.checkForChanges(oldBoard, game.board)) {
      game.generate();
    }
    game.updateBoard(rows);
    updateScore();
    addColors();
    checkForWin();
    checkForLose();
  }
});

function addColors() {
  for (let i = 0; i < cells.length; i++) {
    for (const className of cells[i].classList) {
      if (className.startsWith('field-cell--')) {
        cells[i].classList.remove(className);
      }
    }

    if (parseInt(cells[i].innerText) > 0) {
      cells[i].classList.add(`field-cell--${parseInt(cells[i].innerText)}`);
    }
  }
}


import { Board } from './classes/Board.js';
import { createStartButton } from './classes/StartButton.js';
import { ScoreCounter } from './classes/ScoreCounter.js';

const scoreCounterElement = document.querySelector('.game-score');
const scoreCounter = new ScoreCounter(scoreCounterElement);

const boardElement = document.querySelector('.board');
const board = new Board(boardElement, scoreCounter);

const startButtonElement = document.querySelector('.tile--button');
const startButton = createStartButton(startButtonElement);

board.fillBoard();

startButton.addEventListener('click', () => {
  if (startButton.isRestart) {
    stopGame();
  } else {
    startGame();
  }
});

function startGame() {
  startButton.toggle();
  board.resetLinkedCards();
  board.firstSpawn(2);

  document.addEventListener('keydown', handleKeyPress);
}

function stopGame() {
  scoreCounter.reset();
  startButton.toggle();
  board.clear();
  document.removeEventListener('keydown', handleKeyPress);
}

function handleKeyPress() {
  switch (event.key) {
    case 'ArrowUp':
      board.swipe('Up');
      break;
    case 'ArrowDown':
      board.swipe('Down');
      break;
    case 'ArrowLeft':
      board.swipe('Left');
      break;
    case 'ArrowRight':
      board.swipe('Right');
      break;
    default:
      break;
  }
}

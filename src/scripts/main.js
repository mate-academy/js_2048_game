
import { Board } from './classes/Board.js';
import { createStartButton } from './classes/StartButton.js';

const board = new Board(document.querySelector('.board'));

board.fillBoard();

const buttonElement = document.querySelector('.tile--button');
const startButton = createStartButton(buttonElement);

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

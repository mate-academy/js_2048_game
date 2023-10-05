import { Move } from './move';

class Game extends Move {
  constructor() {
    super();
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
  }

  init() {
    this.setInitData();
    this.buttonEl.addEventListener('click', this.handleButtonClick);
  }

  handleKeydown({ key }) {
    switch (key) {
      case 'ArrowDown':
        this.goDown();
        break;

      case 'ArrowLeft':
        this.goLeft();
        break;

      case 'ArrowUp':
        this.goUp();
        break;

      case 'ArrowRight':
        this.goRight();
        break;

      default:
        return;
    }

    if (!this.isGameOver) {
      this.setRandomNumbers();
      this.updateCells();
      this.updateScore();
    }

    this.checkIfGameIsOver();
  }

  addKeydownListener() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  removeKeydownListener() {
    document.removeEventListener('keydown', this.handleKeydown);
  }

  handleButtonClick() {
    this.isGameStart = !this.isGameStart;

    if (this.isGameStart) {
      this.startGame();
    } else {
      this.restartGame();
    }

    this.updateCells();
  }
}

const newGame = new Game();

newGame.init();

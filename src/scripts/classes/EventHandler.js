export class EventHandler {
  constructor(board, gameOverCallback) {
    this.board = board;
    this.gameOver = gameOverCallback;
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
  }

  handleTouchStart() {
    this.startX = event.changedTouches[0].screenX;
    this.startY = event.changedTouches[0].screenY;
  }

  handleTouchEnd() {
    const endX = event.changedTouches[0].screenX;
    const endY = event.changedTouches[0].screenY;

    this.swipeHandler(endX - this.startX, endY - this.startY);
  }

  keyDownHandler() {
    let deltaX = 0; let deltaY = 0;

    switch (event.key) {
      case 'ArrowUp': deltaY = -1; break;
      case 'ArrowDown': deltaY = 1; break;
      case 'ArrowLeft': deltaX = -1; break;
      case 'ArrowRight': deltaX = 1; break;
      default: return;
    }

    this.swipeHandler(deltaX, deltaY);
  }

  swipeHandler(deltaX, deltaY) {
    let gameContinue;
    const swipe = this.board.swipe.bind(this.board);

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      gameContinue = deltaX > 0 ? swipe('Right') : swipe('Left');
    } else {
      gameContinue = deltaY > 0 ? swipe('Down') : swipe('Up');
    }

    if (gameContinue === 'Win') {
      this.gameOver(true);
    }

    if (gameContinue === 'Lose') {
      this.gameOver(false);
    }
  }

  start() {
    document.addEventListener('keydown', this.keyDownHandler);

    this.board.boardElement
      .addEventListener('touchstart', this.handleTouchStart, false);

    this.board.boardElement
      .addEventListener('touchend', this.handleTouchEnd, false);
  }

  stop() {
    document.removeEventListener('keydown', this.keyDownHandler);

    this.board.boardElement
      .removeEventListener('touchstart', this.handleTouchStart);

    this.board.boardElement
      .removeEventListener('touchend', this.handleTouchEnd);
  }
}
